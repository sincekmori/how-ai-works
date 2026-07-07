<script lang="ts">
  // Build a word's "profile" by hand: move the three aspect sliders until the row
  // of numbers matches the hidden target word. Teaches "a word = a row of numbers"
  // by doing. Hand-set illustrative values; in-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Word {
    name: string;
    v: [number, number, number];
  }

  const T = {
    ja: {
      title: "数の並びを、自分の手で作ってみる",
      aspects: ["動物っぽさ", "大きさ", "速さ"],
      words: [
        { name: "犬", v: [0.8, 0.3, 0.7] },
        { name: "虎", v: [0.9, 0.8, 0.7] },
        { name: "車", v: [0.1, 0.7, 0.9] },
        { name: "猫", v: [0.9, 0.2, 0.6] },
      ] as Word[],
      goal: (w: string) => `お題：「${w}」の数の並びを作ってみよう`,
      up: "↑ もっと大きく",
      down: "↓ もっと小さく",
      ok: "✓ ちょうどいい",
      next: "次のお題",
      matched: (w: string, v: string) =>
        `正解！ 「${w}」＝ (${v})。この並びが「${w}」の“プロフィール”です。`,
      hint: "その単語らしさを想像しながら、3 つとも ✓ になるまで動かしてみましょう。",
    },
    en: {
      title: "Build a row of numbers with your own hands",
      aspects: ["animal-ness", "size", "speed"],
      words: [
        { name: "dog", v: [0.8, 0.3, 0.7] },
        { name: "tiger", v: [0.9, 0.8, 0.7] },
        { name: "car", v: [0.1, 0.7, 0.9] },
        { name: "cat", v: [0.9, 0.2, 0.6] },
      ] as Word[],
      goal: (w: string) => `Target: build the row of numbers for "${w}"`,
      up: "↑ higher",
      down: "↓ lower",
      ok: "✓ just right",
      next: "Next target",
      matched: (w: string, v: string) => `Correct! "${w}" = (${v}). That row is "${w}"'s profile.`,
      hint: "Picture the word and move the sliders until all three read ✓.",
    },
  }[lang];

  let ti = $state(0);
  let vals = $state([0.5, 0.5, 0.5]);

  const target = $derived(T.words[ti]);
  const hints = $derived(
    vals.map((v, i) => {
      const d = v - target.v[i];
      return Math.abs(d) < 0.075 ? "ok" : d < 0 ? "up" : "down";
    }),
  );
  const matched = $derived(hints.every((h) => h === "ok"));

  function next() {
    ti = (ti + 1) % T.words.length;
    vals = [0.5, 0.5, 0.5];
  }

  const hintText = (h: string) => (h === "ok" ? T.ok : h === "up" ? T.up : T.down);
  const status = $derived(
    matched ? T.matched(target.name, target.v.map((x) => x.toFixed(1)).join(", ")) : T.hint,
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <p class="nw-prompt">{T.goal(target.name)}</p>

  {#each T.aspects as a, i (a)}
    <label class="sb-row">
      <span class="sb-label">{a}: {vals[i].toFixed(2)}</span>
      <input type="range" min="0" max="1" step="0.05" bind:value={vals[i]} />
      <span class="am-hint {hints[i]}">{hintText(hints[i])}</span>
    </label>
  {/each}

  <div class="ll-controls">
    <button class="btn" onclick={next}>{T.next}</button>
  </div>

  <p class="ll-status {matched ? 'am-matched' : ''}">{status}</p>
</div>
