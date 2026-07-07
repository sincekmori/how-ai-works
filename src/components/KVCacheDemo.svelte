<script lang="ts">
  // Generation re-attends to every past word each step. Recomputing all of it
  // every time costs ~n²/2 work by the n-th word; caching past keys/values makes
  // each step do only the new word (~n total). Slide n and watch the gap grow.
  // Illustrative counts (relative units). In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      title: "KV キャッシュ：作った分を覚えておくと、どれだけ速い？",
      slider: (n: number) => `生成した単語の数: ${n}`,
      noCacheLabel: "毎回ぜんぶ計算",
      cacheLabel: "キャッシュ再利用",
      status: (v: { n: number; noCache: number; cache: number; ratio: string }) =>
        `${v.n} 語めまで作る計算量は、キャッシュなしで約 ${v.noCache}、ありで約 ${v.cache}。その差は <strong>約 ${v.ratio} 倍</strong>です。長い文ほど差がぐんぐん開きます（その代わり、覚えておくメモリは少し増えます）。`,
    },
    en: {
      title: "KV cache: how much faster is it to remember what you made?",
      slider: (n: number) => `Words generated so far: ${n}`,
      noCacheLabel: "Recompute everything",
      cacheLabel: "Reuse the cache",
      status: (v: { n: number; noCache: number; cache: number; ratio: string }) =>
        `The work to make ${v.n} word(s) is about ${v.noCache} without a cache and about ${v.cache} with one — <strong>about ${v.ratio}× </strong>the difference. The longer the sentence, the wider the gap grows (in return, the memory you keep goes up a little).`,
    },
  }[lang];

  let n = $state(12);

  const noCache = $derived((n * (n + 1)) / 2); // 1+2+...+n
  const cache = $derived(n); // one new token's worth each step
  const ratio = $derived(noCache / cache); // = (n+1)/2
  const maxW = $derived(noCache);
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <label class="sb-row">
    <span class="sb-label">{T.slider(n)}</span>
    <input type="range" min="1" max="40" bind:value={n} />
  </label>

  <div class="nw-row">
    <span class="nw-word">{T.noCacheLabel}</span>
    <div class="ll-bar-track">
      <div class="ll-bar-fill" style={`width:${(noCache / maxW) * 100}%; background:#ef4444`}></div>
    </div>
    <span class="nw-pct">{noCache}</span>
  </div>
  <div class="nw-row">
    <span class="nw-word">{T.cacheLabel}</span>
    <div class="ll-bar-track">
      <div class="ll-bar-fill" style={`width:${(cache / maxW) * 100}%; background:#22c55e`}></div>
    </div>
    <span class="nw-pct">{cache}</span>
  </div>

  <p class="ll-status">{@html T.status({ n, noCache, cache, ratio: ratio.toFixed(1) })}</p>
</div>
