<script lang="ts">
  // Pick which word is "looking" (the query). The bars show how much attention it
  // pays to every word in the sentence — including ones far away. Weights are a
  // hand-set illustration (not a trained model), chosen to show the idea clearly.
  // In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      title: "どの単語に「注目」している？",
      tokens: ["犬", "が", "ボール", "を", "投げた", "ので", "それ", "を", "追いかけた"],
      // attention weights for each query word (index -> weights over all tokens, sum 1)
      W: {
        6: [0.05, 0.01, 0.62, 0.04, 0.15, 0.02, 0.03, 0.03, 0.05],
        8: [0.4, 0.02, 0.05, 0.02, 0.06, 0.03, 0.3, 0.05, 0.07],
      } as Record<number, number[]>,
      labels: { 6: "「それ」が見る", 8: "「追いかけた」が見る" } as Record<number, string>,
      takeaways: {
        6: "「それ」がいちばん見ているのは『ボール』（62%）。6 語も前にあるのに、距離に関係なく直接つながれる。これが昔のやり方にできなかったこと。",
        8: "「追いかけた」は、主語の『犬』（40%）と目的語の『それ』（30%）に強く注目。「誰が・何を」を、離れた単語から直接集めている。",
      } as Record<number, string>,
    },
    en: {
      title: 'Which word is it "paying attention" to?',
      tokens: ["The", "dog", "threw", "the", "ball", "so", "it", "chased", "it"],
      // attention weights for each query word (index -> weights over all tokens, sum 1)
      W: {
        6: [0.01, 0.05, 0.15, 0.04, 0.62, 0.02, 0.03, 0.03, 0.05],
        7: [0.02, 0.4, 0.06, 0.02, 0.05, 0.03, 0.3, 0.05, 0.07],
      } as Record<number, number[]>,
      labels: { 6: "“it” looks", 7: "“chased” looks" } as Record<number, string>,
      takeaways: {
        6: "What “it” looks at most is “ball” (62%). Even though it’s six words back, they connect directly regardless of distance — exactly what the old way couldn’t do.",
        7: "“chased” pays strong attention to the subject “dog” (40%) and the object “it” (30%). It gathers “who did what” directly from far-apart words.",
      } as Record<number, string>,
    },
  }[lang];

  const { tokens } = T;
  const queries = Object.keys(T.W).map(Number);

  let qi = $state(queries[0]);
  const w = $derived(T.W[qi]);
  const takeaway = $derived(T.takeaways[qi]);
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="ll-controls">
    {#each queries as q (q)}
      <button class="btn {qi === q ? 'btn--accent' : ''}" onclick={() => (qi = q)}>
        {T.labels[q]}
      </button>
    {/each}
  </div>

  <div class="ad-cols">
    {#each tokens as t, i (t + i)}
      <div class="ad-col {i === qi ? 'q' : ''}">
        <span class="ad-pct">{Math.round(w[i] * 100)}%</span>
        <div class="ad-track"><div class="ad-fill" style={`height:${w[i] * 100}%`}></div></div>
        <span class="ad-word">{t}</span>
      </div>
    {/each}
  </div>

  <p class="ll-status">{takeaway}</p>
</div>
