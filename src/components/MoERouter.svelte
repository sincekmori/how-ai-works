<script lang="ts">
  // Mixture of Experts: many expert mini-networks exist, but each word is routed
  // to only a few. Big total capacity, small per-word compute. Click a word to see
  // which experts it uses. Illustrative routing. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      title: "専門家の振り分け（Mixture of Experts）",
      hint: "単語をクリックすると、その単語が使う専門家が光ります",
      tokens: ["料理", "の", "レシピ", "を", "教えて"],
      status: (token: string, names: string) =>
        `「${token}」は、<strong>8 人</strong>の専門家のうち <strong>${names}</strong> の <strong>2 人だけ</strong>を使います。総数は多いのに、1 単語あたりの計算は少しだけ。だから「容量は大きく、計算は軽く」が両立します。`,
    },
    en: {
      title: "Routing to experts (Mixture of Experts)",
      hint: "Click a word to light up the experts it uses",
      tokens: ["Tell", "me", "a", "recipe", "please"],
      status: (token: string, names: string) =>
        `“${token}” uses only <strong>2</strong> of the <strong>8</strong> experts — <strong>${names}</strong>. There are many in total, yet each word uses just a few, so "large capacity, light computation" hold at the same time.`,
    },
  }[lang];

  const { tokens } = T;
  const routing = [
    [0, 3],
    [6, 7],
    [0, 2],
    [6, 7],
    [4, 5],
  ];
  const experts = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];

  let sel = $state(0);
  const active = $derived(routing[sel]);
  const activeNames = $derived(active.map((i) => experts[i]).join(lang === "ja" ? "・" : " & "));
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <p class="ll-step">{T.hint}</p>
  <div class="rr-words">
    {#each tokens as t, i (t + i)}
      <button class="rr-w {i === sel ? 'cur' : 'read'}" onclick={() => (sel = i)}>{t}</button>
    {/each}
  </div>

  <div class="moe-grid">
    {#each experts as e, i (e)}
      <div class="moe-exp {active.includes(i) ? 'on' : ''}">{e}</div>
    {/each}
  </div>

  <p class="ll-status">{@html T.status(tokens[sel], activeNames)}</p>
</div>
