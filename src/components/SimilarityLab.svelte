<script lang="ts">
  // Two adjustable arrows with live distance / dot product / direction-score
  // readouts. The point: doubling an arrow changes distance and the raw dot
  // product, but the direction score (cosine) doesn't budge. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  const T = {
    ja: {
      title: "距離・内積・向きの点数を、さわって比べる",
      wordA: "単語 A",
      wordB: "単語 B",
      aspects: ["移動っぽさ", "速さ"],
      presetSprint: "走る と ダッシュする",
      presetWalk: "走る と 歩く",
      double: "B を 2 倍にする",
      dist: "距離",
      dot: "内積",
      cos: "向きの点数",
      hint: "距離と内積は矢印の長さ（勢い）で変わりますが、向きの点数は向きだけで決まります。",
      zero: "矢印の長さが 0 だと向きが決められません。スライダーを動かしてみてください。",
      same: "2 本はぴったり同じ向き。長さ（勢い）をいくら変えても、向きの点数は 1 のままです。",
      close: "かなり向きがそろっています。「意味が近い」の判定です。",
      mid: "向きはそこそこ。意味は“親戚”くらいの判定です。",
      far: "向きはだいぶ違います。「意味が遠い」の判定です。",
    },
    en: {
      title: "Distance, dot product & direction score — hands on",
      wordA: "word A",
      wordB: "word B",
      aspects: ["movement", "speed"],
      presetSprint: "run vs sprint",
      presetWalk: "run vs walk",
      double: "Double B",
      dist: "distance",
      dot: "dot product",
      cos: "direction score",
      hint: "Distance and the dot product move with arrow length (momentum); the direction score depends on direction alone.",
      zero: "A zero-length arrow has no direction. Move the sliders.",
      same: "The two arrows point exactly the same way. Change the lengths all you like — the direction score stays at 1.",
      close: 'The directions line up well: a "close in meaning" verdict.',
      mid: "The directions half agree — more like distant relatives.",
      far: 'The directions disagree: a "far in meaning" verdict.',
    },
  }[lang];

  let ax = $state(0.6);
  let ay = $state(0.6);
  let bx = $state(0.7);
  let by = $state(0.15);

  const dist = $derived(Math.hypot(ax - bx, ay - by));
  const dot = $derived(ax * bx + ay * by);
  const la = $derived(Math.hypot(ax, ay));
  const lb = $derived(Math.hypot(bx, by));
  const cos = $derived(la > 0.01 && lb > 0.01 ? dot / (la * lb) : null);

  function presetSprint() {
    ax = 0.6;
    ay = 0.6;
    bx = 1.2;
    by = 1.2;
  }
  function presetWalk() {
    ax = 0.6;
    ay = 0.6;
    bx = 0.7;
    by = 0.15;
  }
  const canDouble = $derived(bx <= 1.2 && by <= 1.2 && (bx > 0 || by > 0));
  function double() {
    bx = Math.round(bx * 2 * 100) / 100;
    by = Math.round(by * 2 * 100) / 100;
  }

  // SVG geometry: origin (30, 210), 1 unit = 72px, max 2.4 units.
  const X = (v: number) => 30 + v * 72;
  const Y = (v: number) => 210 - v * 72;

  const status = $derived(
    cos === null ? T.zero : cos > 0.99 ? T.same : cos > 0.9 ? T.close : cos > 0.5 ? T.mid : T.far,
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="sl-cols">
    <div class="sl-panel">
      {#each T.aspects as a, i (a)}
        <label class="sb-row">
          <span class="sb-label">A・{a}: {(i === 0 ? ax : ay).toFixed(2)}</span>
          {#if i === 0}
            <input type="range" min="0" max="2.4" step="0.05" bind:value={ax} />
          {:else}
            <input type="range" min="0" max="2.4" step="0.05" bind:value={ay} />
          {/if}
        </label>
      {/each}
      {#each T.aspects as a, i ("b" + a)}
        <label class="sb-row">
          <span class="sb-label">B・{a}: {(i === 0 ? bx : by).toFixed(2)}</span>
          {#if i === 0}
            <input type="range" min="0" max="2.4" step="0.05" bind:value={bx} />
          {:else}
            <input type="range" min="0" max="2.4" step="0.05" bind:value={by} />
          {/if}
        </label>
      {/each}
      <div class="ll-controls">
        <button class="btn" onclick={presetSprint}>{T.presetSprint}</button>
        <button class="btn" onclick={presetWalk}>{T.presetWalk}</button>
        <button class="btn btn--accent" onclick={double} disabled={!canDouble}>{T.double}</button>
      </div>
    </div>

    <svg class="sl-canvas" viewBox="0 0 260 240" role="img" aria-label={T.title}>
      <defs>
        <marker id="sl-ah-a" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" class="sl-head-a"></path>
        </marker>
        <marker id="sl-ah-b" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L7,3 L0,6 Z" class="sl-head-b"></path>
        </marker>
      </defs>
      <path class="sl-axis" d="M30,20 L30,210 L250,210"></path>
      <line class="sl-vec-a" x1={X(0)} y1={Y(0)} x2={X(ax)} y2={Y(ay)} marker-end="url(#sl-ah-a)"
      ></line>
      <line class="sl-vec-b" x1={X(0)} y1={Y(0)} x2={X(bx)} y2={Y(by)} marker-end="url(#sl-ah-b)"
      ></line>
      <text class="sl-lbl-a" x={X(ax) + 6} y={Y(ay) - 6}>A</text>
      <text class="sl-lbl-b" x={X(bx) + 6} y={Y(by) + 12}>B</text>
    </svg>
  </div>

  <div class="sl-readouts">
    <span class="sl-readout">{T.dist}: <strong>{dist.toFixed(2)}</strong></span>
    <span class="sl-readout">{T.dot}: <strong>{dot.toFixed(2)}</strong></span>
    <span class="sl-readout">{T.cos}: <strong>{cos === null ? "—" : cos.toFixed(2)}</strong></span>
  </div>

  <p class="ll-status">{status}</p>
  <p class="ll-status">{T.hint}</p>
</div>
