<script lang="ts">
  // The epilogue's journey map: every leg of the book as a row; open one to
  // recall what it taught. Native details/summary, so it needs no state at all.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Leg {
    title: string;
    recap: string;
  }

  const T = {
    ja: {
      title: "旅の地図：タップして思い出す",
      hint: "気になる区間を開くと、そこで学んだことを思い出せます。",
      partI: "第 I 部　LLM の内部のしくみ",
      partII: "第 II 部　LLM を活用するしくみ",
      legsI: [
        {
          title: "まずはここから",
          recap: "LLM の仕事はたった 1 つ。「ここまでの文章から、次の 1 語を当てる」こと。",
        },
        {
          title: "ぜんぶ「数」にする",
          recap:
            "文をトークンに分け、言葉をベクトルにし、内積で近さを、確率で迷いを扱えるようにした。",
        },
        {
          title: "機械はどう学ぶ？",
          recap:
            "まちがい（損失）を勾配でさかのぼって重みを少しずつ直す。その学習で「意味の地図」（埋め込み）が育つ。",
        },
        {
          title: "文章をどう読む？",
          recap:
            "一列読みの壁を、関係する言葉を直接見るアテンションで越え、Transformer として積み上げた。",
        },
        {
          title: "育てて、動かす",
          recap:
            "事前学習で物知りに、ファインチューニングで親切に。推論では確率から 1 語ずつ選んで文を伸ばす。",
        },
        {
          title: "大きく、速く、その先へ",
          recap:
            "大きくするほど予測どおり賢くなる（スケーリング則）。量子化などで速く軽くし、最前線へ。",
        },
      ] as Leg[],
      legsII: [
        {
          title: "モデルを呼ぶ",
          recap:
            "モデルはネット越しに呼べる窓口。temperature などのつまみで答え方が変わり、返事から情報を取り出す。",
        },
        {
          title: "決まった形で受け取る",
          recap:
            "JSON という機械にやさしい形と、型を約束させるスキーマで、プログラムが安心して読める返事に。",
        },
        {
          title: "道具を使う",
          recap:
            "ツールで検索や計算の「手」を持たせ、MCP という共通コンセントでつなぎ方をそろえた。",
        },
        {
          title: "自分で動く",
          recap:
            "考える→道具→結果→また考えるのループが何ステップもの仕事をこなし、スキルが「うちのやり方」を教える。",
        },
      ] as Leg[],
    },
    en: {
      title: "The journey map: tap to remember",
      hint: "Open any leg to recall what it taught.",
      partI: "Part I · How an LLM works inside",
      partII: "Part II · How LLMs are put to work",
      legsI: [
        {
          title: "Start here",
          recap: 'An LLM has exactly one job: "guess the next word from the text so far."',
        },
        {
          title: "Turning everything into numbers",
          recap:
            "Sentences became tokens, words became vectors, closeness became the dot product, hesitation became probability.",
        },
        {
          title: "How the machine learns",
          recap:
            "Trace the mistake (the loss) back with gradients and nudge the weights. That training grows the map of meaning (embeddings).",
        },
        {
          title: "How it reads a sentence",
          recap:
            "The one-word-at-a-time wall fell to attention — looking straight at the words that matter — stacked into the Transformer.",
        },
        {
          title: "Raising and running it",
          recap:
            "Pretraining makes it knowledgeable, fine-tuning makes it helpful; at inference it picks one word at a time from the probabilities.",
        },
        {
          title: "Bigger, faster, and beyond",
          recap:
            "Scale grows capability on a predictable curve (scaling laws); quantization and friends make it fast and light — on to the frontier.",
        },
      ] as Leg[],
      legsII: [
        {
          title: "Calling the model",
          recap:
            "The model is a window you call across the net; knobs like temperature change how it answers, and you pull data out of the reply.",
        },
        {
          title: "Getting a fixed shape back",
          recap:
            "JSON, the machine-friendly shape, plus a schema that pins the type — replies a program can trust.",
        },
        {
          title: "Using tools",
          recap:
            'Tools give it "hands" — search, math — and MCP, the shared socket, standardizes how they connect.',
        },
        {
          title: "Acting on its own",
          recap:
            "The think → tool → result → think-again loop carries multi-step jobs, and skills teach it your way of working.",
        },
      ] as Leg[],
    },
  }[lang];
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>
  <p class="ll-status">{T.hint}</p>

  <p class="jm-part">{T.partI}</p>
  <div class="sk-shelf">
    {#each T.legsI as leg (leg.title)}
      <details class="sk-spine jm-leg">
        <summary class="sk-name">{leg.title}</summary>
        <p class="jm-recap">{leg.recap}</p>
      </details>
    {/each}
  </div>

  <p class="jm-part">{T.partII}</p>
  <div class="sk-shelf">
    {#each T.legsII as leg (leg.title)}
      <details class="sk-spine jm-leg">
        <summary class="sk-name">{leg.title}</summary>
        <p class="jm-recap">{leg.recap}</p>
      </details>
    {/each}
  </div>
</div>
