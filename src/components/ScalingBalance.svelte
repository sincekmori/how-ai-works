<script lang="ts">
  // Two levers: how much compute you spend (budget), and how you split it between
  // a bigger model vs more data. More compute lowers the achievable loss (with
  // diminishing returns); the split is best balanced in the middle (Chinchilla
  // idea). Illustrative numbers, not a real fit. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      title: "予算をどう使う？ スケーリングのバランス",
      budget: (b: number) => `計算予算（コンピュータの量）: ${b}`,
      split: (s: number) => `配分：データ重視 ←→ モデル重視（${s}%）`,
      lossLabel: (l: string) => `予測される損失（短いほど賢い）: <strong>${l}</strong>`,
      balanced: "⚖️ バランス良し！ この予算を最大限に活かせています。",
      modelHeavy: "🧠 モデルが大きすぎ・データ不足。せっかくの容量を活かしきれていません。",
      dataHeavy: "📚 データは多いのにモデルが小さすぎ。覚えきる入れ物が足りません。",
      tail: "　予算を増やすほど損失の下限は下がりますが、だんだん効きにくくなります。",
    },
    en: {
      title: "How do you spend the budget? The scaling balance",
      budget: (b: number) => `Compute budget (amount of computer): ${b}`,
      split: (s: number) => `Split: data-heavy ←→ model-heavy (${s}%)`,
      lossLabel: (l: string) => `Predicted loss (shorter is smarter): <strong>${l}</strong>`,
      balanced: "⚖️ Well balanced! You are getting the most out of this budget.",
      modelHeavy: "🧠 Model too big, not enough data. You can't make full use of the capacity.",
      dataHeavy:
        "📚 Plenty of data, but the model is too small. Not enough container to memorize it.",
      tail: "  The more budget you add, the lower the loss floor — but the effect tapers off.",
    },
  }[lang];

  let budget = $state(30); // 1..100 (compute)
  let split = $state(50); // 0 = all data, 100 = all model size

  const base = $derived(1.2 + 3 / budget ** 0.35); // floor that compute can reach
  const penalty = $derived(1.5 * ((split - 50) / 50) ** 2); // off-balance waste
  const loss = $derived(base + penalty);

  // map loss (~1.6 .. ~5.0) to a 0..100 bar where shorter = better
  const lossPct = $derived(Math.max(4, Math.min(100, ((loss - 1.4) / 3.6) * 100)));

  const verdict = $derived(
    Math.abs(split - 50) <= 12 ? T.balanced : split > 62 ? T.modelHeavy : T.dataHeavy,
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <label class="sb-row">
    <span class="sb-label">{T.budget(budget)}</span>
    <input type="range" min="1" max="100" bind:value={budget} />
  </label>

  <label class="sb-row">
    <span class="sb-label">{T.split(split)}</span>
    <input type="range" min="0" max="100" bind:value={split} />
  </label>

  <p class="ll-errlabel">{@html T.lossLabel(loss.toFixed(2))}</p>
  <div class="ll-bar-track"><div class="ll-bar-fill" style={`width:${lossPct}%`}></div></div>

  <p class="ll-status">
    {verdict}{T.tail}
  </p>
</div>
