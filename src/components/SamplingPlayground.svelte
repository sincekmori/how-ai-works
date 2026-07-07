<script lang="ts">
  // Interactive sampling visualizer (in-memory only — no persistence; reload resets).
  // Shows how temperature, top-k and top-p reshape a fixed next-token distribution.
  // Vocabulary is illustrative and model-agnostic.
  interface Tok {
    token: string;
    logit: number;
  }

  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  // Base logits for the next-token candidates after a prompt
  // ("猫がマットの上に___" / "The cat ___ on the mat"). Logits are identical
  // across languages; only the surface words differ.
  const logits = [3.6, 3.1, 2.4, 1.5, 1.2, 0.7, 0.1, -0.4, -1.3, -3];
  const T = {
    ja: {
      title: "サンプリング・プレイグラウンド（次トークン分布）",
      tempLabel: "temperature",
      topkLabel: "top-k",
      toppLabel: "top-p",
      reset: "リセット",
      hint: (kept: number, total: number) =>
        `採用トークン: <b>${kept}</b> / ${total}（淡色＝足切り）`,
      tokens: [
        "座った",
        "寝た",
        "乗った",
        "飛び乗った",
        "いた",
        "丸まった",
        "ジャンプした",
        "鳴いた",
        "消えた",
        "微分した",
      ],
    },
    en: {
      title: "Sampling playground (next-token distribution)",
      tempLabel: "temperature",
      topkLabel: "top-k",
      toppLabel: "top-p",
      reset: "Reset",
      hint: (kept: number, total: number) => `Kept tokens: <b>${kept}</b> / ${total} (faded = cut)`,
      tokens: [
        "sat",
        "slept",
        "climbed on",
        "leapt onto",
        "stayed",
        "curled up",
        "jumped",
        "meowed",
        "vanished",
        "differentiated",
      ],
    },
  }[lang];

  const base: Tok[] = T.tokens.map((token, i) => ({ token, logit: logits[i] }));

  let temperature = $state(0.8);
  let topK = $state(10);
  let topP = $state(1);

  function softmax(values: number[]): number[] {
    const m = Math.max(...values);
    const exps = values.map((v) => Math.exp(v - m));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  }

  const dist = $derived.by(() => {
    const t = Math.max(0.01, temperature);
    // 1) temperature-scaled softmax over all candidates
    const rows = base.map((d) => ({ token: d.token, logit: d.logit, p: 0, kept: true }));
    const probs = softmax(rows.map((r) => r.logit / t));
    rows.forEach((r, i) => (r.p = probs[i]));
    // 2) sort by probability (descending)
    rows.sort((a, b) => b.p - a.p);
    // 3) top-k: keep only the k most probable
    rows.forEach((r, rank) => {
      if (rank >= topK) {
        r.kept = false;
      }
    });
    // 4) top-p (nucleus): keep the smallest prefix whose cumulative prob ≥ p
    let cum = 0;
    let reachedP = false;
    for (const r of rows) {
      if (!r.kept) {
        continue;
      }
      if (reachedP) {
        r.kept = false;
        continue;
      }
      cum += r.p;
      if (cum >= topP) {
        reachedP = true;
      } // this row is the last kept one
    }
    // 5) renormalize kept tokens
    const keptSum = rows.filter((r) => r.kept).reduce((a, r) => a + r.p, 0) || 1;
    return rows.map((r) => ({
      token: r.token,
      logit: r.logit,
      p: r.p,
      kept: r.kept,
      pNorm: r.kept ? r.p / keptSum : 0,
    }));
  });

  const keptCount = $derived(dist.filter((r) => r.kept).length);

  function reset() {
    temperature = 0.8;
    topK = 10;
    topP = 1;
  }
</script>

<div class="widget sp">
  <p class="widget__title">{T.title}</p>

  <div class="sp__controls">
    <label>
      <span>{T.tempLabel} <b>{temperature.toFixed(2)}</b></span>
      <input type="range" min="0.01" max="2" step="0.01" bind:value={temperature} />
    </label>
    <label>
      <span>{T.topkLabel} <b>{topK}</b></span>
      <input type="range" min="1" max={base.length} step="1" bind:value={topK} />
    </label>
    <label>
      <span>{T.toppLabel} <b>{topP.toFixed(2)}</b></span>
      <input type="range" min="0.05" max="1" step="0.01" bind:value={topP} />
    </label>
    <button type="button" class="btn" onclick={reset}>{T.reset}</button>
  </div>

  <p class="sp__hint">{@html T.hint(keptCount, base.length)}</p>

  <ul class="sp__bars">
    {#each dist as row (row.token)}
      <li class:dim={!row.kept}>
        <span class="sp__label">{row.token}</span>
        <span class="sp__track">
          <span class="sp__fill" style={`width:${(row.kept ? row.pNorm : row.p) * 100}%`}></span>
        </span>
        <span class="sp__pct">{((row.kept ? row.pNorm : row.p) * 100).toFixed(1)}%</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .sp__controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.6rem 1rem;
    align-items: end;
    margin-bottom: 0.8rem;
  }
  .sp__controls label {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.82rem;
  }
  .sp__controls input[type="range"] {
    width: 100%;
    accent-color: var(--accent);
  }
  .sp__hint {
    font-size: 0.82rem;
    color: var(--fg-muted);
    margin: 0 0 0.6rem;
  }
  .sp__bars {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .sp__bars li {
    display: grid;
    grid-template-columns: 6.5rem 1fr 3.2rem;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }
  .sp__bars li.dim {
    opacity: 0.32;
  }
  .sp__label {
    font-variant-numeric: tabular-nums;
  }
  .sp__track {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    border-radius: 6px;
    height: 0.85rem;
    overflow: hidden;
  }
  .sp__fill {
    display: block;
    height: 100%;
    background: var(--accent);
    border-radius: 6px;
    transition: width 0.15s ease;
  }
  .sp__pct {
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--fg-muted);
  }
</style>
