<script lang="ts">
  // The old way, made watchable: read a sentence ONE word at a time (you literally
  // cannot jump ahead), while a fixed-size "memo" tries to hold everything. As you
  // move right, the trace of the FIRST word fades — that's long-range forgetting.
  // In-memory only; reload resets.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      words: ["私", "が", "むかし", "住んでいた", "海辺の", "古い", "家"],
      title: "昔の読み方を体験する：一語ずつ、メモは小さいまま",
      next: "次の単語へ",
      play: "通して再生",
      reset: "最初から",
      memoLabel: "メモ（今おぼえている内容）— <em>大きさは決まっていて、増えない</em>",
      memoEmpty: "まだ何も読んでいない",
      memoFull: "これまでの内容を、この箱ひとつに詰め込む",
      survivalLabel: "いちばん最初の言葉「私」が、メモにどれくらい残っている？",
      idle: "「次の単語へ」か「通して再生」を押してみよう",
      mid: (n: number, s: number) =>
        `${n} 語目まで読んだ。メモは更新され、最初の「私」は ${s}% まで薄れた。`,
      end: (s: number) =>
        `最後まで読んだ。最初の「私」は ${s}% しか残っていない。遠い言葉ほど忘れてしまう。`,
    },
    en: {
      words: ["I", "once", "lived", "in", "a", "seaside", "house"],
      title: "Try the old way of reading: one word at a time, with a tiny fixed memo",
      next: "Next word",
      play: "Play through",
      reset: "Restart",
      memoLabel: "Memo (what it remembers now) — <em>its size is fixed; it never grows</em>",
      memoEmpty: "Nothing read yet",
      memoFull: "Everything so far is crammed into this one box",
      survivalLabel: "How much of the very first word, “I”, is still in the memo?",
      idle: "Press “Next word” or “Play through”.",
      mid: (n: number, s: number) =>
        `Read ${n} word(s). The memo was updated, and the first word “I” has faded to ${s}%.`,
      end: (s: number) =>
        `Reached the end. Only ${s}% of the first word “I” remains — the farther back, the more it is forgotten.`,
    },
  }[lang];

  const { words } = T;
  const last = words.length - 1;

  let pos = $state(-1);
  let running = $state(false);

  const sleep = (ms: number) =>
    new Promise<void>((r) => {
      setTimeout(r, ms);
    });

  // How much of the first word survives in the memo by the time we reach `pos`.
  const survival = $derived(pos < 0 ? 0 : Math.round(100 * 0.72 ** pos));

  function step() {
    if (running || pos >= last) {
      return;
    }
    pos += 1;
  }

  async function play() {
    if (running) {
      return;
    }
    running = true;
    if (pos >= last) {
      pos = -1;
    }
    while (pos < last) {
      pos += 1;
      // eslint-disable-next-line no-await-in-loop -- sequential by design: paces the animation
      await sleep(620);
    }
    running = false;
  }

  function reset() {
    if (running) {
      return;
    }
    pos = -1;
  }

  const wcls = (i: number) => (i === pos ? "cur" : i < pos ? "read" : "");
  const status = $derived(
    pos < 0 ? T.idle : pos < last ? T.mid(pos + 1, survival) : T.end(survival),
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="ll-controls">
    <button class="btn btn--accent" onclick={step} disabled={running || pos >= last}>
      {T.next}
    </button>
    <button class="btn" onclick={play} disabled={running}>{T.play}</button>
    <button class="btn" onclick={reset} disabled={running}>{T.reset}</button>
  </div>

  <div class="rr-words">
    {#each words as w, i (w + i)}
      <span class="rr-w {wcls(i)}">{w}</span>
    {/each}
  </div>

  <p class="ll-errlabel">{@html T.memoLabel}</p>
  <div class="rr-memo">{pos < 0 ? T.memoEmpty : T.memoFull}</div>

  <p class="ll-errlabel">{T.survivalLabel}</p>
  <div class="ll-bar-track"><div class="ll-bar-fill" style={`width:${survival}%`}></div></div>

  <p class="ll-status">{status}</p>
</div>
