<script lang="ts">
  // Training = repeatedly nudge up the probability the model gives to the REAL
  // next word. Each "learn" raises the true word's score; its probability climbs
  // and the model's "surprise" (loss) falls. Hand-set illustration. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      prompt: "日本の首都は",
      words: ["東京", "大阪", "ラーメン", "走る", "青い"],
      title: "「次の単語」を当てる練習をさせてみる",
      blank: "＿＿＿",
      learn: "1 回 学習する",
      reset: "最初から",
      step: (s: number, l: string) => `学習回数: ${s}　／　驚き（損失）: ${l}`,
      tag: " 正解",
      idle: "いまモデルは「大阪」を選びがちで、正解の「東京」に自信がありません。「学習」を押してみましょう。",
      done: (s: number, p: number) =>
        `${s} 回の学習で「東京」の確率が ${p}% に。驚き（損失）もぐっと下がりました。`,
      prog: (s: number) => `${s} 回学習：「東京」の確率が上がり、驚き（損失）が下がっています。`,
    },
    en: {
      prompt: "The capital of Japan is",
      words: ["Tokyo", "Osaka", "ramen", "runs", "blue"],
      title: "Train the model to guess the next word",
      blank: "___",
      learn: "Learn once",
      reset: "Restart",
      step: (s: number, l: string) => `Steps: ${s}  /  Surprise (loss): ${l}`,
      tag: " correct",
      idle: 'Right now the model leans toward "Osaka" and isn\'t confident in the correct word "Tokyo". Try pressing "Learn".',
      done: (s: number, p: number) =>
        `After ${s} step(s), "Tokyo" is at ${p}%. The surprise (loss) has dropped sharply too.`,
      prog: (s: number) => `${s} step(s): "Tokyo" is climbing, and the surprise (loss) is falling.`,
    },
  }[lang];

  const { prompt } = T;
  const { words } = T;
  const correct = 0;
  const start = [0.2, 0.4, 0.1, 0, -0.2];

  let logits = $state([...start]);
  let step = $state(0);

  function softmax(xs: number[]): number[] {
    const m = Math.max(...xs);
    const ex = xs.map((x) => Math.exp(x - m));
    const s = ex.reduce((a, b) => a + b, 0);
    return ex.map((e) => e / s);
  }

  const probs = $derived(softmax(logits));
  const loss = $derived(-Math.log(probs[correct]));

  function learn() {
    logits[correct] += 0.8;
    step += 1;
  }
  function reset() {
    logits = [...start];
    step = 0;
  }

  const status = $derived(
    step === 0
      ? T.idle
      : probs[correct] > 0.8
        ? T.done(step, Math.round(probs[correct] * 100))
        : T.prog(step),
  );
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <p class="nw-prompt">{prompt} <span class="nw-blank">{T.blank}</span></p>

  <div class="ll-controls">
    <button class="btn btn--accent" onclick={learn}>{T.learn}</button>
    <button class="btn" onclick={reset}>{T.reset}</button>
    <span class="ll-step">{T.step(step, loss.toFixed(2))}</span>
  </div>

  {#each words as w, i (w)}
    <div class="nw-row {i === correct ? 'correct' : ''}">
      <span class="nw-word"
        >{w}{#if i === correct}<span class="nw-tag">{T.tag}</span>{/if}</span
      >
      <div class="ll-bar-track">
        <div class="ll-bar-fill" style={`width:${probs[i] * 100}%`}></div>
      </div>
      <span class="nw-pct">{Math.round(probs[i] * 100)}%</span>
    </div>
  {/each}

  <p class="ll-status">{status}</p>
</div>
