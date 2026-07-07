<script lang="ts">
  // Two request knobs, hands-on: temperature (ask three times and compare)
  // and max_tokens (cut the same reply short). All replies are canned lines —
  // no model is called. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  const T = {
    ja: {
      title: "2 つのつまみを、さわってみる",
      prompt: "お願い：東京の明日の天気を、ひとことで。",
      tabs: ["temperature", "max_tokens"],
      tempPick: "temperature をえらぶ：",
      tempLabels: ["低（0 に近い）", "中", "高"],
      tempAsk: "同じお願いを 3 回くり返した結果：",
      tempSets: [
        [
          "東京は明日、晴れるでしょう。",
          "東京は明日、晴れるでしょう。",
          "東京は明日、晴れるでしょう。",
        ],
        [
          "東京は明日、おおむね晴れそうです。",
          "明日の東京は晴れ。過ごしやすい一日です。",
          "東京は明日、晴れときどき雲が出ます。",
        ],
        [
          "あしたの東京はピカピカの晴れ！",
          "晴れ。空は青いキャンバスになるでしょう。",
          "東京の空、明日はソーダ水みたいな青。泳げそうですね。",
        ],
      ],
      tempNotes: [
        "ほぼ毎回、同じ返事になります。数字の取り出しなど、ぶれてほしくない仕事向きです。",
        "ほどよく言い回しが変わります。ふだんのチャットは、だいたいこのあたりです。",
        "思い切った言葉が交ざります。アイデア出しには楽しく、事実の確認には不向きです。",
      ],
      lenLabel: "max_tokens（返事の上限）：",
      lenTokens: [
        "東京",
        "は",
        "明日",
        "、",
        "晴れ",
        "て",
        "、",
        "28",
        "度",
        "まで",
        "上がり",
        "ます",
        "。",
        "おでかけ",
        "日和",
        "です",
        "。",
      ],
      lenCut: "ここで上限に当たり、返事は途中でぷつりと切れました。",
      lenOk: "上限に余裕があり、返事は最後まで返ってきました。",
    },
    en: {
      title: "Try the two knobs",
      prompt: "Request: tomorrow's weather in Tokyo, in one line.",
      tabs: ["temperature", "max_tokens"],
      tempPick: "Pick a temperature:",
      tempLabels: ["low (near 0)", "medium", "high"],
      tempAsk: "The same request, repeated three times:",
      tempSets: [
        [
          "Tokyo will be sunny tomorrow.",
          "Tokyo will be sunny tomorrow.",
          "Tokyo will be sunny tomorrow.",
        ],
        [
          "Tokyo looks mostly sunny tomorrow.",
          "Sunny in Tokyo tomorrow — a pleasant day.",
          "Tokyo tomorrow: sunny with a few clouds.",
        ],
        [
          "Tomorrow's Tokyo: gloriously sunny!",
          "Sunny. The sky will be one big blue canvas.",
          "Tokyo's sky tomorrow: soda-water blue. Almost swimmable.",
        ],
      ],
      tempNotes: [
        "Nearly the same reply every time. Good for jobs that must not wobble, like pulling out numbers.",
        "The wording varies pleasantly. Everyday chat sits around here.",
        "Bold words sneak in. Fun for brainstorming, wrong for checking facts.",
      ],
      lenLabel: "max_tokens (cap on the reply):",
      lenTokens: [
        "Tokyo",
        "will",
        "be",
        "sunny",
        "tomorrow",
        ",",
        "going",
        "up",
        "to",
        "28",
        "C",
        ".",
        "A",
        "great",
        "day",
        "out",
        ".",
      ],
      lenCut: "The cap was hit here — the reply stops mid-sentence.",
      lenOk: "The cap had room to spare; the reply came back whole.",
    },
  }[lang];

  let tab = $state(0);
  let temp = $state(0);
  let maxTok = $state(9);
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>
  <p class="nw-prompt">{T.prompt}</p>

  <div class="ll-controls">
    {#each T.tabs as name, i (name)}
      <button class="btn {tab === i ? 'btn--accent' : ''} je-mono" onclick={() => (tab = i)}
        >{name}</button
      >
    {/each}
  </div>

  {#if tab === 0}
    <div class="ll-controls">
      <span class="sb-label" style="flex:0 0 auto">{T.tempPick}</span>
      {#each T.tempLabels as label, i (label)}
        <button class="btn {temp === i ? 'btn--accent' : ''}" onclick={() => (temp = i)}
          >{label}</button
        >
      {/each}
    </div>
    <p class="ll-status">{T.tempAsk}</p>
    <div class="pk-replies">
      {#each T.tempSets[temp] as reply, i (i)}
        <div class="st-answer">{reply}</div>
      {/each}
    </div>
    <p class="ll-status st-read">{T.tempNotes[temp]}</p>
  {:else if tab === 1}
    <div class="ll-controls">
      <label class="sb-label" for="pk-max">{T.lenLabel}</label>
      <input id="pk-max" type="range" min="4" max={T.lenTokens.length} bind:value={maxTok} />
      <span class="je-mono">{maxTok}</span>
    </div>
    <div class="st-answer">
      {#each T.lenTokens.slice(0, maxTok) as tok, i (i)}<span class="pk-tok">{tok}</span
        >{/each}{#if maxTok < T.lenTokens.length}<span class="pk-cut">✂</span>{/if}
    </div>
    <p class="ll-status st-read">{maxTok < T.lenTokens.length ? T.lenCut : T.lenOk}</p>
  {/if}
</div>
