<script lang="ts">
  // Free text vs structured output. In free mode the answer's wording changes
  // every time, so a program trying to grab the temperature is unreliable. In
  // structured (JSON) mode the shape is fixed, so weather["temperature"] always works.
  // Illustrative; in-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  const T = {
    ja: {
      title: "同じ質問に、2 つの答えさせ方",
      prompt: "東京の明日の天気は？",
      freeBtn: "自由な文で答えさせる",
      jsonBtn: "決まった型で答えさせる（JSON）",
      again: "もう一度きく",
      freeAnswers: [
        "東京は明日、晴れときどき曇り。28 度くらいまで上がるでしょう。",
        "あすの東京はおおむね晴れ、日中はおよそ 30℃ 前後まで上がりそうです。",
        "明日の東京、天気は良好。ぽかぽか陽気になりますよ。",
      ],
      jsons: [
        '{ "city": "Tokyo", "condition": "sunny", "temperature": 28 }',
        '{ "city": "Tokyo", "condition": "cloudy", "temperature": 26 }',
        '{ "city": "Tokyo", "condition": "rainy", "temperature": 22 }',
      ],
      jsonTemps: [28, 26, 22],
      freeRead: [
        "プログラムが気温を取り出そうとすると… 「28 度」を発見。今回はうまくいった。",
        "プログラムが気温を取り出そうとすると… 「30℃」？ 単位も位置も毎回ちがい、あやうい。",
        "プログラムが気温を取り出そうとすると… 数字が見つからない。お手上げ。",
      ],
      jsonRead: (v: number) =>
        `プログラムが weather["temperature"] と書くと、今回も確実に ${v} を取り出せます。`,
      freeNote:
        "自由な文は、人には自然。でも言い回しが毎回変わるので、プログラムが決まった情報を取り出すのは運まかせになりがちです。",
      jsonNote:
        "「この型（鍵）で答えて」とあらかじめ指定しておくと、モデルは必ずその形で返します。これが構造化出力です。もう一度きくと値は変わりますが、形（鍵の並び）は変わりません。だから次の処理に、そのまま流しこめます。",
      modeFree: "自由な文",
      modeJson: "構造化出力（JSON）",
    },
    en: {
      title: "Two ways to make it answer the same question",
      prompt: "What's tomorrow's weather in Tokyo?",
      freeBtn: "Answer in free text",
      jsonBtn: "Answer in a fixed shape (JSON)",
      again: "Ask again",
      freeAnswers: [
        "Tokyo tomorrow: sunny with some clouds, up to around 28°C.",
        "Mostly clear in Tokyo tomorrow, climbing to roughly 30 degrees by midday.",
        "Lovely weather in Tokyo tomorrow — warm and pleasant!",
      ],
      jsons: [
        '{ "city": "Tokyo", "condition": "sunny", "temperature": 28 }',
        '{ "city": "Tokyo", "condition": "cloudy", "temperature": 26 }',
        '{ "city": "Tokyo", "condition": "rainy", "temperature": 22 }',
      ],
      jsonTemps: [28, 26, 22],
      freeRead: [
        "The program tries to grab the temperature… found “28”. Worked this time.",
        "The program tries to grab the temperature… “30 degrees”? Units and position differ each time — shaky.",
        "The program tries to grab the temperature… no number to be found. Stuck.",
      ],
      jsonRead: (v: number) =>
        `When the program writes weather["temperature"], it reliably gets ${v} this time too.`,
      freeNote:
        "Free text is natural for a person. But the wording changes every time, so a program pulling out a fixed fact is left to luck.",
      jsonNote:
        'Tell it up front "answer in this shape (these keys)" and the model always returns that shape. That is structured output. Ask again and the values change, but the shape — the keys — does not budge. So it flows straight into the next step.',
      modeFree: "free text",
      modeJson: "structured output (JSON)",
    },
  }[lang];

  let mode = $state<"free" | "json">("free");
  let variant = $state(0);
  let jvariant = $state(0);

  function setFree() {
    mode = "free";
    variant = 0;
  }
  function setJson() {
    mode = "json";
    jvariant = 0;
  }
  function again() {
    if (mode === "free") {
      variant = (variant + 1) % T.freeAnswers.length;
    } else {
      jvariant = (jvariant + 1) % T.jsons.length;
    }
  }
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <p class="nw-prompt">{T.prompt}</p>

  <div class="ll-controls">
    <button class="btn {mode === 'free' ? 'btn--accent' : ''}" onclick={setFree}>{T.freeBtn}</button
    >
    <button class="btn {mode === 'json' ? 'btn--accent' : ''}" onclick={setJson}>{T.jsonBtn}</button
    >
    <button class="btn" onclick={again}>{T.again}</button>
  </div>

  {#if mode === "free"}
    <p class="st-tag">{T.modeFree}</p>
    <div class="st-answer">{T.freeAnswers[variant]}</div>
    <p class="ll-status st-read">{T.freeRead[variant]}</p>
    <p class="ll-status">{T.freeNote}</p>
  {:else}
    <p class="st-tag">{T.modeJson}</p>
    <div class="st-answer je-mono">{T.jsons[jvariant]}</div>
    <p class="ll-status st-read st-ok">{T.jsonRead(T.jsonTemps[jvariant])}</p>
    <p class="ll-status">{T.jsonNote}</p>
  {/if}
</div>
