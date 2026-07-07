<script lang="ts">
  // 3D "meaning map". WebGL can't be server-rendered, so this island is mounted with
  // client:only. It auto-rotates on load (renderMode="always") so it's obviously 3D
  // and invites interaction; the moment the user drags, auto-rotation stops and they
  // take over. (We trade on-demand rendering for that clear affordance.)
  // @threlte/core only — no @threlte/extras (see README).
  import { Canvas } from "@threlte/core";
  import Scene from "./EmbeddingScene.svelte";

  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      title: "意味の地図（3D・ドラッグで回せます）",
      aria: "意味の近い単語どうしが近くに集まる3Dの地図。ドラッグで回転できます。",
      hint: "🖱 ドラッグで回す",
      legend: ["動物", "王族", "数", "色"],
      note: "点はすべて実際の単語です。<strong>意味の近い単語ほど近くに集まる</strong>のが見えます（犬・猫…はひとかたまり、赤・青…は別のかたまり）。実際の埋め込みは数百〜数千次元で、ここでは 3 次元に落としています。",
    },
    en: {
      title: "Map of meaning (3D — drag to rotate)",
      aria: "A 3D map where words close in meaning cluster together. Drag to rotate.",
      hint: "🖱 Drag to rotate",
      legend: ["Animals", "Royalty", "Numbers", "Colors"],
      note: "Every dot is a real word. You can see that <strong>the closer two words are in meaning, the closer they sit</strong> (dog, cat… form one cluster; red, blue… form another). Real embeddings have hundreds to thousands of dimensions; here we have flattened them down to 3.",
    },
  }[lang];

  let rotX = $state(0.3);
  let rotY = $state(0.2);
  let userActive = $state(false);
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  // Gentle auto-rotation until the user first grabs it.
  $effect(() => {
    let raf = 0;
    const tick = () => {
      if (userActive) {
        return;
      } // user has taken over → stop auto-rotating
      rotY += 0.0035;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });

  function onPointerDown(e: PointerEvent) {
    userActive = true;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) {
      return;
    }
    rotY += (e.clientX - lastX) * 0.008;
    rotX += (e.clientY - lastY) * 0.008;
    lastX = e.clientX;
    lastY = e.clientY;
  }
  function onPointerUp() {
    dragging = false;
  }
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>
  <div
    class="embed-canvas"
    role="img"
    aria-label={T.aria}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointerleave={onPointerUp}
  >
    {#if !userActive}
      <div class="embed-hint">{T.hint}</div>
    {/if}
    <Canvas renderMode="always">
      <Scene {rotX} {rotY} {lang} />
    </Canvas>
  </div>
  <ul class="embed-legend">
    <li><span style="background:#fb923c"></span>{T.legend[0]}</li>
    <li><span style="background:#a78bfa"></span>{T.legend[1]}</li>
    <li><span style="background:#34d399"></span>{T.legend[2]}</li>
    <li><span style="background:#60a5fa"></span>{T.legend[3]}</li>
  </ul>
  <p class="embed-note">{@html T.note}</p>
</div>

<style>
  .embed-canvas {
    position: relative;
    touch-action: none;
    cursor: grab;
  }
  .embed-canvas:active {
    cursor: grabbing;
  }
  .embed-hint {
    position: absolute;
    top: 0.6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    font-size: 0.8rem;
    color: #fff;
    background: rgb(0 0 0 / 45%);
    border: 1px solid rgb(255 255 255 / 28%);
    border-radius: 999px;
    padding: 0.2rem 0.75rem;
    pointer-events: none;
  }
  .embed-legend {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    margin: 0.7rem 0 0.3rem;
    padding: 0;
    font-size: 0.82rem;
  }
  .embed-legend li {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .embed-legend span {
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 999px;
    display: inline-block;
  }
  .embed-note {
    font-size: 0.8rem;
    color: var(--fg-muted);
    margin: 0;
  }
</style>
