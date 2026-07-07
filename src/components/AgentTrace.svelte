<script lang="ts">
  // Step through a small agent run: think → act (tool) → observe, looped until
  // the task is done. Two tool calls, then a final answer. Shows that an agent is
  // just the tool-use turn, repeated with a goal in mind. Illustrative; in-memory.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Step {
    who: "user" | "think" | "act" | "observe" | "answer";
    text: string;
  }

  const T = {
    ja: {
      title: "エージェントの仕事ぶりを、1 歩ずつ",
      whoLabel: {
        user: "あなた",
        think: "考える",
        act: "道具を使う",
        observe: "結果を見る",
        answer: "答える",
      },
      steps: [
        { who: "user", text: "明日の東京、いちばん暖かい時間に散歩したい。何時がいい？" },
        { who: "think", text: "時間ごとの気温がいる。天気の道具を使おう。" },
        { who: "act", text: 'get_hourly_weather("Tokyo", "tomorrow")' },
        { who: "observe", text: '{ "09": 22, "12": 27, "15": 29, "18": 24 }' },
        { who: "think", text: "15 時ごろに 29℃ まで上がる。でも雨がないかも確かめたい。" },
        { who: "act", text: 'get_rain("Tokyo", "tomorrow", "15:00")' },
        { who: "observe", text: '{ "rain_pct": 5 }' },
        { who: "think", text: "15 時は暖かく、雨も少ない。これで答えられる。" },
        { who: "answer", text: "明日は 15 時ごろがおすすめです。約 29℃、雨の心配も少なめですよ。" },
      ] as Step[],
      next: "次の 1 歩",
      reset: "最初から",
      idle: "「次の 1 歩」で、エージェントが考えて道具を使い、また考えるループを追えます。",
      done: "完了。1 回の返事では終わらず、考える→道具→結果を何度も回して、目的をやり遂げました。",
    },
    en: {
      title: "Watch an agent work, one step at a time",
      whoLabel: {
        user: "you",
        think: "think",
        act: "use a tool",
        observe: "read result",
        answer: "answer",
      },
      steps: [
        { who: "user", text: "I want to walk at the warmest hour in Tokyo tomorrow. When?" },
        { who: "think", text: "I need the temperature by hour. Use the weather tool." },
        { who: "act", text: 'get_hourly_weather("Tokyo", "tomorrow")' },
        { who: "observe", text: '{ "09": 22, "12": 27, "15": 29, "18": 24 }' },
        { who: "think", text: "15:00 is warmest at 29°C. But check there's no rain." },
        { who: "act", text: 'get_rain("Tokyo", "tomorrow", "15:00")' },
        { who: "observe", text: '{ "rain_pct": 5 }' },
        { who: "think", text: "15:00 is warm and nearly dry. I can answer now." },
        {
          who: "answer",
          text: "Aim for around 15:00 tomorrow — about 29°C and little chance of rain.",
        },
      ] as Step[],
      next: "Next step",
      reset: "Restart",
      idle: 'Press "Next step" to follow the agent think, use a tool, and think again.',
      done: "Done. Not one reply but many loops of think → tool → result carried the task through.",
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
        <span class="tl-text {step.who === 'act' || step.who === 'observe' ? 'je-mono' : ''}"
          >{step.text}</span
        >
      </div>
    {/each}
  </div>

  {#if status}
    <p class="ll-status">{status}</p>
  {/if}
</div>
