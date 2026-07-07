<script lang="ts">
  // "Watch it learn": one click runs a forward sweep (green, L→R = prediction)
  // then a backward sweep (orange, R→L = error flowing back), and the error bar
  // shrinks a little — so learning is something you can literally watch happen.
  // In-memory only; reload resets.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      title: "ニューラルネットが学ぶ様子を見る",
      learn: "1 回 学習する",
      reset: "最初から",
      count: (n: number) => `学習回数: ${n}`,
      input: "入力",
      hidden: "中間層",
      prediction: "予測",
      errLabel: "まちがい（誤差）",
      fwd: "順伝播中… 入力から予測へ",
      bwd: "誤差逆伝播中… まちがいを逆向きに配る",
      idle: "ボタンを押すと 1 回学習します",
      done: (n: number) => `${n} 回学習：まちがいが小さくなりました`,
    },
    en: {
      title: "Watch a neural network learn",
      learn: "Learn once",
      reset: "Restart",
      count: (n: number) => `Rounds: ${n}`,
      input: "input",
      hidden: "hidden",
      prediction: "prediction",
      errLabel: "mistake (loss)",
      fwd: "Forward pass… from input to prediction",
      bwd: "Backpropagation… handing the mistake backward",
      idle: "Press the button to learn one round",
      done: (n: number) => `${n} round(s): the mistake got smaller`,
    },
  }[lang];

  interface Node {
    x: number;
    y: number;
    layer: number;
  }
  const nodes: Node[] = [
    { x: 90, y: 95, layer: 0 },
    { x: 90, y: 165, layer: 0 },
    { x: 270, y: 70, layer: 1 },
    { x: 270, y: 130, layer: 1 },
    { x: 270, y: 190, layer: 1 },
    { x: 450, y: 130, layer: 2 },
  ];
  interface Edge {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    from: number;
    to: number;
  }
  const edges: Edge[] = [];
  for (const a of nodes.filter((n) => n.layer === 0)) {
    for (const b of nodes.filter((n) => n.layer === 1)) {
      edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, from: 0, to: 1 });
    }
  }
  for (const a of nodes.filter((n) => n.layer === 1)) {
    for (const b of nodes.filter((n) => n.layer === 2)) {
      edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, from: 1, to: 2 });
    }
  }

  let error = $state(1);
  let step = $state(0);
  let active = $state(-1);
  let dir = $state<"fwd" | "bwd" | "">("");
  let running = $state(false);

  const sleep = (ms: number) =>
    new Promise<void>((r) => {
      setTimeout(r, ms);
    });

  async function learnOnce() {
    if (running) {
      return;
    }
    running = true;
    dir = "fwd";
    for (const layer of [0, 1, 2]) {
      active = layer;
      // eslint-disable-next-line no-await-in-loop -- sequential by design: paces the animation
      await sleep(340);
    }
    dir = "bwd";
    for (const layer of [2, 1, 0]) {
      active = layer;
      // eslint-disable-next-line no-await-in-loop -- sequential by design: paces the animation
      await sleep(340);
    }
    active = -1;
    dir = "";
    error = Math.max(0.03, error * 0.78);
    step += 1;
    running = false;
  }

  function reset() {
    if (running) {
      return;
    }
    error = 1;
    step = 0;
    active = -1;
    dir = "";
  }

  const cls = (isActive: boolean) => (isActive ? dir : "");
  const status = $derived(
    dir === "fwd" ? T.fwd : dir === "bwd" ? T.bwd : step === 0 ? T.idle : T.done(step),
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="ll-controls">
    <button class="btn btn--accent" onclick={learnOnce} disabled={running}>{T.learn}</button>
    <button class="btn" onclick={reset} disabled={running}>{T.reset}</button>
    <span class="ll-step">{T.count(step)}</span>
  </div>

  <svg
    viewBox="0 0 540 240"
    role="img"
    aria-label="Animation of the forward pass and backpropagation"
  >
    {#each edges as e (e.x1 + "-" + e.y1 + "-" + e.x2 + "-" + e.y2)}
      <line
        class="ll-edge {cls(e.from === active || e.to === active)}"
        x1={e.x1}
        y1={e.y1}
        x2={e.x2}
        y2={e.y2}
      ></line>
    {/each}
    {#each nodes as n (n.x + "-" + n.y)}
      <circle class="ll-node {cls(n.layer === active)}" cx={n.x} cy={n.y} r="13"></circle>
    {/each}
    <text class="f-mut" x="90" y="215" text-anchor="middle">{T.input}</text>
    <text class="f-mut" x="270" y="225" text-anchor="middle">{T.hidden}</text>
    <text class="f-mut" x="450" y="165" text-anchor="middle">{T.prediction}</text>
  </svg>

  <p class="ll-errlabel">{T.errLabel}</p>
  <div class="ll-bar-track"><div class="ll-bar-fill" style={`width:${error * 100}%`}></div></div>
  <p class="ll-status">{status}</p>
</div>
