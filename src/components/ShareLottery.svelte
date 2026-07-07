<script lang="ts">
  // The shares really are lottery tickets: draw the same question again and again,
  // and the words come out in different orders — yet the counts creep toward the
  // handed-out shares. Explains why chat replies differ run to run. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  const T = {
    ja: {
      title: "同じ質問で、くじを何回も引いてみる",
      prompt: "私の好きな食べ物は",
      blank: "＿＿＿",
      cands: [
        ["カレー", 35],
        ["ラーメン", 30],
        ["寿司", 20],
        ["パン", 15],
      ] as [string, number][],
      draw1: "1 回引く",
      draw10: "10 回引く",
      reset: "リセット",
      count: (n: number, p: string) => `${n} 回 (${p}%)`,
      last: (w: string) => `今回出たのは「${w}」でした。`,
      idle: "「1 回引く」を押すと、配られた割合にしたがって 1 語が選ばれます。",
      few: (n: number) =>
        `${n} 回引きました。回数が少ないうちは、割合どおりには出ません。それでいいのです。`,
      many: (n: number) =>
        `${n} 回引きました。出た回数の割合が、配られた割合にどんどん近づいています。`,
    },
    en: {
      title: "Draw the same question's lottery, again and again",
      prompt: "My favorite food is",
      blank: "___",
      cands: [
        ["curry", 35],
        ["ramen", 30],
        ["sushi", 20],
        ["bread", 15],
      ] as [string, number][],
      draw1: "Draw once",
      draw10: "Draw 10 times",
      reset: "Reset",
      count: (n: number, p: string) => `${n}× (${p}%)`,
      last: (w: string) => `This time it came out "${w}".`,
      idle: 'Press "Draw once" and one word is picked according to its share.',
      few: (n: number) =>
        `${n} draw(s) so far. With few draws the counts stray from the shares — and that's fine.`,
      many: (n: number) =>
        `${n} draws so far. The share of times each word came out is creeping toward its handed-out share.`,
    },
  }[lang];

  let counts = $state([0, 0, 0, 0]);
  let last = $state(-1);

  const total = $derived(counts.reduce((a, b) => a + b, 0));

  function drawOne() {
    const r = Math.random() * 100;
    let acc = 0;
    for (let i = 0; i < T.cands.length; i += 1) {
      acc += T.cands[i][1];
      if (r < acc) {
        counts[i] += 1;
        last = i;
        return;
      }
    }
    counts[counts.length - 1] += 1;
    last = counts.length - 1;
  }

  function draw(n: number) {
    for (let i = 0; i < n; i += 1) {
      drawOne();
    }
  }

  function reset() {
    counts = [0, 0, 0, 0];
    last = -1;
  }

  const pct = (i: number) => (total === 0 ? "0" : ((counts[i] / total) * 100).toFixed(0));
  const status = $derived(
    total === 0
      ? T.idle
      : `${T.last(T.cands[last][0])} ${total < 30 ? T.few(total) : T.many(total)}`,
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <p class="nw-prompt">
    {T.prompt} <span class="nw-blank">{last === -1 ? T.blank : T.cands[last][0]}</span>
  </p>

  <div class="ll-controls">
    <button class="btn btn--accent" onclick={() => draw(1)}>{T.draw1}</button>
    <button class="btn" onclick={() => draw(10)}>{T.draw10}</button>
    <button class="btn" onclick={reset}>{T.reset}</button>
  </div>

  {#each T.cands as [w, share], i (w)}
    <div class="nw-row {i === last ? 'correct' : ''}">
      <span class="nw-word">{w}</span>
      <div class="ll-bar-track"><div class="ll-bar-fill" style={`width:${share}%`}></div></div>
      <span class="nw-pct">{share}%</span>
      <span class="lt-count">{T.count(counts[i], pct(i))}</span>
    </div>
  {/each}

  <p class="ll-status">{status}</p>
</div>
