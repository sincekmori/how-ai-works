<script lang="ts">
  // A decoder-only LLM predicts the next word left to right. While processing
  // position t, attention may look at words 1..t (itself and earlier) but NOT at
  // later words — peeking at the future would be cheating. Click a word (or use the
  // buttons) to set the current position and see what stays visible. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      tokens: ["今日", "は", "とても", "よい", "天気", "だ"],
      title: "未来は見ない：因果マスクを体験する",
      back: "◀ 前へ",
      fwd: "次へ ▶",
      hint: "単語をクリックしても切りかえられます",
      cont: "（文の続き）",
      status: (pos: number, cur: string, next: string) =>
        `いま処理しているのは ${pos + 1} 番目「${cur}」。アテンションで見えるのは 1〜${pos + 1} 番目（自分まで）だけ。` +
        `次の単語「${next}」を当てるのに、未来をのぞいたらカンニングになるからです。`,
    },
    en: {
      tokens: ["Today", "is", "a", "really", "nice", "day"],
      title: "Don’t look at the future: try the causal mask",
      back: "◀ Back",
      fwd: "Next ▶",
      hint: "You can also switch by clicking a word",
      cont: "(the rest of the sentence)",
      status: (pos: number, cur: string, next: string) =>
        `Now processing word ${pos + 1}, “${cur}.” Attention can see only words 1–${pos + 1} (up to itself). ` +
        `To guess the next word, “${next},” peeking at the future would be cheating.`,
    },
  }[lang];

  const { tokens } = T;
  const last = tokens.length - 1;

  let pos = $state(3);

  function setPos(i: number) {
    pos = i;
  }
  function back() {
    if (pos > 0) {
      pos -= 1;
    }
  }
  function fwd() {
    if (pos < last) {
      pos += 1;
    }
  }

  const wcls = (i: number) => (i === pos ? "cur" : i < pos ? "read" : "masked");
  const nextWord = $derived(pos < last ? tokens[pos + 1] : T.cont);
  const status = $derived(T.status(pos, tokens[pos], nextWord));
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="ll-controls">
    <button class="btn" onclick={back} disabled={pos === 0}>{T.back}</button>
    <button class="btn" onclick={fwd} disabled={pos === last}>{T.fwd}</button>
    <span class="ll-step">{T.hint}</span>
  </div>

  <div class="rr-words">
    {#each tokens as t, i (t + i)}
      <button class="rr-w {wcls(i)}" onclick={() => setPos(i)}>
        {t}{#if i > pos}<span class="rr-mask-x"> ✕</span>{/if}
      </button>
    {/each}
  </div>

  <p class="ll-status">{status}</p>
</div>
