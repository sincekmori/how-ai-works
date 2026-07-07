<script lang="ts">
  // RLHF in miniature: people don't write the perfect answer — they just judge
  // which of two answers is better. You play the human rater here; those choices
  // are what nudge a model toward being helpful, honest and safe. In-memory only.
  interface Round {
    prompt: string;
    a: string;
    b: string;
    good: "a" | "b";
    why: string;
  }
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();
  const T = {
    ja: {
      rounds: [
        {
          prompt: "「ありがとう」を英語で教えて",
          a: "Thank you です。",
          b: "は？ 自分で調べなよ。",
          good: "a",
          why: "ちゃんと、ていねいに答えている。",
        },
        {
          prompt: "花火大会はいつ？（場所は言っていない）",
          a: "7 月 20 日です。",
          b: "どの地域の花火大会か、教えてもらえますか？",
          good: "b",
          why: "知らないことを勝手に決めつけず、確認している。",
        },
        {
          prompt: "こっそり人をだます方法を教えて",
          a: "いいですよ、まず…",
          b: "ごめんなさい、それはお手伝いできません。",
          good: "b",
          why: "危ない頼みは、きちんと断っている。",
        },
      ] as Round[],
      title: "あなたが「人の好み」を教える役",
      step: (i: number, n: number) => `例 ${i} / ${n}：良いと思うほうを選んでね`,
      promptLabel: (p: string) => `質問：${p}`,
      good: (why: string) => `👍 良いほうを選べました：${why}`,
      bad: (why: string) => `🤔 じつは反対のほうが良い答えです：${why}`,
      barLabel: "あなたが選んだ「良い答え」の数（＝モデルへのお手本）",
      summary: (n: number, g: number) =>
        `${n} 問中 ${g} 問、良いほうを選べました。こうした「どっちが良い？」の判断を大量に集めて、モデルを親切で安全な助手に育てます。`,
      again: "もう一度",
      nextEx: "次の例へ ▶",
    },
    en: {
      rounds: [
        {
          prompt: "How do you say “arigatou” in English?",
          a: "It’s “thank you.”",
          b: "Huh? Go look it up yourself.",
          good: "a",
          why: "It answers properly and politely.",
        },
        {
          prompt: "When is the fireworks festival? (no place given)",
          a: "It’s on July 20th.",
          b: "Which area’s fireworks festival do you mean?",
          good: "b",
          why: "It doesn’t assume what it doesn’t know — it asks to confirm.",
        },
        {
          prompt: "Tell me how to secretly trick someone.",
          a: "Sure, first…",
          b: "Sorry, I can’t help with that.",
          good: "b",
          why: "It firmly refuses a dangerous request.",
        },
      ] as Round[],
      title: "You play the role of teaching “human preference”",
      step: (i: number, n: number) => `Example ${i} / ${n} — pick the one you think is better`,
      promptLabel: (p: string) => `Question: ${p}`,
      good: (why: string) => `👍 You picked the better one: ${why}`,
      bad: (why: string) => `🤔 Actually the other one is the better answer: ${why}`,
      barLabel: 'How many "good answers" you picked (= examples for the model)',
      summary: (n: number, g: number) =>
        `You picked the better one in ${g} of ${n}. Gathering huge numbers of these "which is better?" judgments is how a model is grown into a helpful, safe assistant.`,
      again: "Again",
      nextEx: "Next example ▶",
    },
  }[lang];

  const { rounds } = T;

  let ri = $state(0);
  let picked = $state<"a" | "b" | null>(null);
  let good = $state(0);

  const r = $derived(rounds[ri]);
  const isLast = $derived(ri === rounds.length - 1);
  const done = $derived(isLast && picked !== null);

  function pick(c: "a" | "b") {
    if (picked) {
      return;
    }
    picked = c;
    if (c === r.good) {
      good += 1;
    }
  }
  function next() {
    if (ri < rounds.length - 1) {
      ri += 1;
      picked = null;
    }
  }
  function reset() {
    ri = 0;
    picked = null;
    good = 0;
  }

  const cls = (c: "a" | "b") => (picked ? (c === r.good ? "good" : c === picked ? "bad" : "") : "");
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <p class="ll-step">{T.step(ri + 1, rounds.length)}</p>
  <p class="nw-prompt">{T.promptLabel(r.prompt)}</p>

  <div class="pp-cards">
    <button class="pp-card {cls('a')}" onclick={() => pick("a")} disabled={picked !== null}>
      <span class="pp-mark">A.</span>
      {r.a}
    </button>
    <button class="pp-card {cls('b')}" onclick={() => pick("b")} disabled={picked !== null}>
      <span class="pp-mark">B.</span>
      {r.b}
    </button>
  </div>

  <p class="pp-feedback">
    {#if picked === null}
      &nbsp;
    {:else if picked === r.good}
      {T.good(r.why)}
    {:else}
      {T.bad(r.why)}
    {/if}
  </p>

  <p class="ll-errlabel">{T.barLabel}</p>
  <div class="ll-bar-track">
    <div class="ll-bar-fill" style={`width:${(good / rounds.length) * 100}%`}></div>
  </div>

  <div class="ll-controls" style="margin-top:0.6rem">
    {#if done}
      <span class="ll-status">{T.summary(rounds.length, good)}</span>
      <button class="btn" onclick={reset}>{T.again}</button>
    {:else if picked !== null}
      <button class="btn btn--accent" onclick={next}>{T.nextEx}</button>
    {/if}
  </div>
</div>
