<script lang="ts">
  // Step through one tool-use turn: the model can't know live weather, so it
  // emits a structured tool call; the program runs the tool and feeds the result
  // back; the model then answers. Illustrative, hand-authored; in-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Step {
    who: "user" | "model" | "prog" | "tool";
    text: string;
  }

  const T = {
    ja: {
      title: "道具を使う一周を、1 歩ずつ",
      whoLabel: { user: "あなた", model: "モデル", prog: "プログラム", tool: "道具（天気 API）" },
      steps: [
        { who: "user", text: "東京、明日は傘いるかな？" },
        {
          who: "model",
          text: '（明日の天気は知らない…道具を使おう）\ncall get_weather("Tokyo", "tomorrow")',
        },
        { who: "prog", text: "モデルの依頼どおり、天気 API を実行する。" },
        { who: "tool", text: '{ "condition": "sunny", "temperature": 28, "rain_pct": 10 }' },
        { who: "prog", text: "結果をモデルに戻す。" },
        { who: "model", text: "明日は晴れ、降水確率 10% です。傘はいらなそうですよ。" },
      ] as Step[],
      next: "次の 1 歩",
      reset: "最初から",
      idle: "「次の 1 歩」を押すと、モデルが道具を使って答えるまでを追えます。",
      done: "一周おわり。モデル単体では知らないことも、道具を挟めば答えられました。",
    },
    en: {
      title: "One tool-use turn, one step at a time",
      whoLabel: { user: "you", model: "model", prog: "program", tool: "tool (weather API)" },
      steps: [
        { who: "user", text: "Tokyo — will I need an umbrella tomorrow?" },
        {
          who: "model",
          text: '(I don\'t know tomorrow\'s weather… use a tool)\ncall get_weather("Tokyo", "tomorrow")',
        },
        { who: "prog", text: "Run the weather API, just as the model asked." },
        { who: "tool", text: '{ "condition": "sunny", "temperature": 28, "rain_pct": 10 }' },
        { who: "prog", text: "Feed the result back to the model." },
        { who: "model", text: "Sunny tomorrow, 10% chance of rain. You won't need an umbrella." },
      ] as Step[],
      next: "Next step",
      reset: "Restart",
      idle: 'Press "Next step" to follow the model using a tool to answer.',
      done: "Turn complete. Something the model alone can't know, answered — with a tool in the loop.",
    },
  }[lang];

  const last = T.steps.length;
  let pos = $state(0);

  function next() {
    if (pos < last) {
      pos += 1;
    }
  }
  function reset() {
    pos = 0;
  }

  const status = $derived(pos === 0 ? T.idle : pos >= last ? T.done : "");
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="ll-controls">
    <button class="btn btn--accent" onclick={next} disabled={pos >= last}>{T.next}</button>
    <button class="btn" onclick={reset} disabled={pos === 0}>{T.reset}</button>
  </div>

  <div class="tl-track">
    {#each T.steps.slice(0, pos) as step, i (i)}
      <div class="tl-row tl-{step.who}">
        <span class="tl-who">{T.whoLabel[step.who]}</span>
        <span class="tl-text {step.who === 'model' || step.who === 'tool' ? 'je-mono' : ''}"
          >{step.text}</span
        >
      </div>
    {/each}
  </div>

  {#if status}
    <p class="ll-status">{status}</p>
  {/if}
</div>
