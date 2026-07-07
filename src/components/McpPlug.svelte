<script lang="ts">
  // Slide the number of models and tools and watch the wire count: hand-wiring is
  // M×N (multiplication), while an MCP hub is M+N (addition). The gap explodes as
  // things grow. Illustrative; in-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  const T = {
    ja: {
      title: "本数をくらべる：手配線 vs MCP",
      models: (n: number) => `モデルの数: ${n}`,
      tools: (n: number) => `道具の数: ${n}`,
      hand: "手配線（直接つなぐ）",
      mcp: "MCP 経由",
      wires: (n: number) => `${n} 本`,
      note: (v: { m: number; n: number; mul: number; add: number }) =>
        `モデル ${v.m} × 道具 ${v.n} だと、手配線は ${v.mul} 本、MCP なら ${v.add} 本。数が増えるほど差は開きます（かけ算 対 足し算）。`,
    },
    en: {
      title: "Compare the wire count: hand-wired vs MCP",
      models: (n: number) => `models: ${n}`,
      tools: (n: number) => `tools: ${n}`,
      hand: "hand-wired (direct)",
      mcp: "via MCP",
      wires: (n: number) => `${n} wires`,
      note: (v: { m: number; n: number; mul: number; add: number }) =>
        `With ${v.m} models × ${v.n} tools, hand-wiring is ${v.mul} wires, MCP is ${v.add}. The gap widens as things grow (multiplication vs addition).`,
    },
  }[lang];

  let m = $state(3);
  let n = $state(4);

  const mul = $derived(m * n);
  const add = $derived(m + n);
  const maxW = $derived(Math.max(mul, 1));
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <label class="sb-row">
    <span class="sb-label">{T.models(m)}</span>
    <input type="range" min="1" max="8" bind:value={m} />
  </label>
  <label class="sb-row">
    <span class="sb-label">{T.tools(n)}</span>
    <input type="range" min="1" max="8" bind:value={n} />
  </label>

  <div class="nw-row">
    <span class="nw-word">{T.hand}</span>
    <div class="ll-bar-track">
      <div class="ll-bar-fill" style={`width:${(mul / maxW) * 100}%; background:#ef4444`}></div>
    </div>
    <span class="nw-pct">{T.wires(mul)}</span>
  </div>
  <div class="nw-row">
    <span class="nw-word">{T.mcp}</span>
    <div class="ll-bar-track">
      <div class="ll-bar-fill" style={`width:${(add / maxW) * 100}%`}></div>
    </div>
    <span class="nw-pct">{T.wires(add)}</span>
  </div>

  <p class="ll-status">{T.note({ m, n, mul, add })}</p>
</div>
