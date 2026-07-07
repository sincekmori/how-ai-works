<script lang="ts">
  // A miniature chat screen — the entry point of Part II. The replies are
  // canned lines (no real model is called), so the demo works offline; its job
  // is to make "that screen everyone pictures" concrete before we look at what
  // the send button does behind the scenes. In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface QA {
    q: string;
    a: string;
  }
  interface Msg {
    who: "user" | "ai";
    text: string;
  }

  const T = {
    ja: {
      title: "「あの画面」を、さわってみる",
      name: "AI アシスタント",
      send: "送信",
      swap: "別の質問にする",
      note: "この返事はデモ用の決まり文句で、本物のモデルは呼んでいません。でも画面の作りは本物の会話画面と同じです。この送信ボタンの裏で何が起きているかが、この章の主役です。",
      qas: [
        {
          q: "東京の明日の天気は？",
          a: "東京は明日晴れて、28 度くらいまで上がるでしょう。おでかけ日和ですよ。",
        },
        {
          q: "AI はなぜ言葉を話せるの？",
          a: "たくさんの文章から「次に来やすい言葉」を学んでいて、それを 1 語ずつつなげて文を作っているからです。",
        },
        {
          q: "朝ごはんのおすすめは？",
          a: "しっかり食べたい朝なら、ごはんと味噌汁と卵焼きの定番はいかがでしょう。",
        },
      ] as QA[],
    },
    en: {
      title: 'Try "that screen" yourself',
      name: "AI Assistant",
      send: "Send",
      swap: "Pick another question",
      note: "The replies here are canned lines for the demo — no real model is being called. But the screen is built like a real chat screen. What happens behind that send button is what this chapter is about.",
      qas: [
        {
          q: "What's tomorrow's weather in Tokyo?",
          a: "Tokyo will be sunny tomorrow, going up to around 28°C. A great day to be out!",
        },
        {
          q: "Why can an AI talk at all?",
          a: "It has learned, from mountains of text, which word tends to come next — and it builds a sentence by picking one word at a time.",
        },
        {
          q: "What should I have for breakfast?",
          a: "If you want a solid start, you can't go wrong with eggs, toast, and some fruit.",
        },
      ] as QA[],
    },
  }[lang];

  let messages = $state<Msg[]>([]);
  let pending = $state(0);
  let busy = $state(false);
  let asked = $state(false);
  let box = $state<HTMLDivElement | null>(null);

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function scrollDown() {
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }

  function swap() {
    if (!busy) {
      pending = (pending + 1) % T.qas.length;
    }
  }

  async function send() {
    if (busy) {
      return;
    }
    busy = true;
    asked = true;
    const qa = T.qas[pending];
    pending = (pending + 1) % T.qas.length;
    messages = [...messages, { who: "user", text: qa.q }];
    scrollDown();
    await sleep(600);
    messages = [...messages, { who: "ai", text: "" }];
    const reply = messages.at(-1);
    for (const ch of qa.a) {
      // eslint-disable-next-line no-await-in-loop
      await sleep(28);
      if (reply) {
        reply.text += ch;
      }
      scrollDown();
    }
    busy = false;
  }
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="cs-frame">
    <div class="cs-head"><span class="cs-dot"></span>{T.name}</div>
    <div class="cs-body" bind:this={box}>
      {#each messages as m, i (i)}
        <div class="cs-msg {m.who}">
          {m.text}{#if m.who === "ai" && busy && i === messages.length - 1}<span class="cs-caret"
            ></span>{/if}
        </div>
      {/each}
    </div>
    <div class="cs-inputrow">
      <div class="cs-input">{T.qas[pending].q}</div>
      <button class="btn btn--accent" onclick={send} disabled={busy}>{T.send}</button>
    </div>
  </div>

  <div class="ll-controls" style="margin-top:0.6rem">
    <button class="btn" onclick={swap} disabled={busy}>{T.swap}</button>
  </div>

  {#if asked}
    <p class="ll-status">{T.note}</p>
  {/if}
</div>
