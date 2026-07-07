<script lang="ts">
  // Each point is an actual word: a lit sphere (gives 3D depth) plus a billboarded
  // text label with a dark halo so it stays readable even when labels overlap.
  // Few, well-spaced words per cluster keep it legible.
  import { T } from "@threlte/core";
  import { Sprite, SpriteMaterial, CanvasTexture } from "three";

  type Vec3 = [number, number, number];
  const {
    rotX = 0.3,
    rotY = 0.2,
    lang = "ja",
  }: { rotX?: number; rotY?: number; lang?: "en" | "ja" } = $props();

  // Same clusters/positions/colors in both languages — only the label strings differ.
  const clusterWords = {
    ja: [
      ["犬", "猫", "うさぎ"],
      ["王", "女王", "姫"],
      ["一", "二", "三"],
      ["赤", "青", "緑"],
    ],
    en: [
      ["dog", "cat", "rabbit"],
      ["king", "queen", "princess"],
      ["one", "two", "three"],
      ["red", "blue", "green"],
    ],
  }[lang];

  const clusters: { color: string; center: Vec3; words: string[] }[] = [
    { color: "#fb923c", center: [-3.3, 2, 0.4], words: clusterWords[0] },
    { color: "#a78bfa", center: [3.3, 1.6, -0.9], words: clusterWords[1] },
    { color: "#34d399", center: [-2.7, -2.2, -1], words: clusterWords[2] },
    { color: "#60a5fa", center: [2.9, -1.9, 1.3], words: clusterWords[3] },
  ];
  // small fixed offsets so the words in a cluster don't sit on top of each other
  const offsets: Vec3[] = [
    [0, 0, 0],
    [1.3, -0.3, 0.7],
    [-1, -1, -0.6],
  ];

  function label(word: string, color: string, pos: Vec3): Sprite {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const family = '"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';
      // Start at 92px (the original JA size) and shrink only if the word is too
      // wide for the canvas — so longer English words (e.g. "princess") still fit
      // while single-glyph JA labels keep the exact same size as before.
      let size = 92;
      ctx.font = `bold ${size}px ${family}`;
      const maxWidth = 232;
      while (ctx.measureText(word).width > maxWidth && size > 28) {
        size -= 4;
        ctx.font = `bold ${size}px ${family}`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 12;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
      ctx.strokeText(word, 128, 70);
      ctx.fillStyle = color;
      ctx.fillText(word, 128, 70);
    }
    const texture = new CanvasTexture(canvas);
    texture.anisotropy = 4;
    const sprite = new Sprite(
      new SpriteMaterial({ map: texture, transparent: true, depthWrite: false }),
    );
    sprite.position.set(pos[0], pos[1], pos[2]);
    sprite.scale.set(1.5, 0.75, 1);
    return sprite;
  }

  const points = clusters.flatMap((c) =>
    c.words.map((w, i) => {
      const pos: Vec3 = [
        c.center[0] + offsets[i][0],
        c.center[1] + offsets[i][1],
        c.center[2] + offsets[i][2],
      ];
      return { pos, color: c.color, sprite: label(w, c.color, [pos[0], pos[1] + 0.6, pos[2]]) };
    }),
  );

  // Neutral 3D axes through the origin, so it's obvious this is a 3D space.
  // A cylinder is along Y by default; rotate it onto X and Z. Cones cap the + ends.
  const AX = 4.6;
  const axisRot: Vec3[] = [
    [0, 0, 0], // Y
    [0, 0, Math.PI / 2], // X
    [Math.PI / 2, 0, 0], // Z
  ];
  const tips: { pos: Vec3; rot: Vec3 }[] = [
    { pos: [0, AX, 0], rot: [0, 0, 0] }, // +Y
    { pos: [AX, 0, 0], rot: [0, 0, -Math.PI / 2] }, // +X
    { pos: [0, 0, AX], rot: [Math.PI / 2, 0, 0] }, // +Z
  ];
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
<T.AmbientLight intensity={0.85} />
<T.DirectionalLight position={[5, 6, 8]} intensity={1.3} />

<T.Group rotation.x={rotX} rotation.y={rotY}>
  {#each axisRot as rot (rot.join())}
    <T.Mesh rotation={rot}>
      <T.CylinderGeometry args={[0.02, 0.02, 9.2, 8]} />
      <T.MeshBasicMaterial color="#94a3b8" transparent opacity={0.45} />
    </T.Mesh>
  {/each}
  {#each tips as tip (tip.pos.join())}
    <T.Mesh position={tip.pos} rotation={tip.rot}>
      <T.ConeGeometry args={[0.1, 0.32, 12]} />
      <T.MeshBasicMaterial color="#94a3b8" transparent opacity={0.55} />
    </T.Mesh>
  {/each}

  {#each points as p (p.sprite.uuid)}
    <T.Mesh position={p.pos}>
      <T.SphereGeometry args={[0.24, 24, 24]} />
      <T.MeshStandardMaterial
        color={p.color}
        emissive={p.color}
        emissiveIntensity={0.3}
        roughness={0.35}
        metalness={0.1}
      />
    </T.Mesh>
    <T is={p.sprite} />
  {/each}
</T.Group>
