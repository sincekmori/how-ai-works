import { getCollection, type CollectionEntry } from "astro:content";
import { references } from "./references";
import { absoluteLocale } from "./urls";

export type Chapter = CollectionEntry<"chapters">;
export type Locale = "en" | "ja";
export const LOCALES: Locale[] = ["en", "ja"];
export const DEFAULT_LOCALE: Locale = "en";

/** The bare slug of a chapter (its id without the `en/` or `ja/` prefix). */
export function chapterSlug(entry: Chapter): string {
  return entry.id.replace(/^(?:en|ja)\//, "");
}

/**
 * Chapters for one locale, sorted by `order`. Drafts are excluded in production
 * builds but kept visible during `astro dev` so work in progress can be previewed.
 */
export async function getSortedChapters(lang: Locale): Promise<Chapter[]> {
  const all = await getCollection("chapters", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return all
    .filter((c) => c.id.startsWith(`${lang}/`))
    .toSorted((a, b) => a.data.order - b.data.order);
}

/** Previous / next chapter relative to a given bare slug (by sort order). */
export function neighbours(chapters: Chapter[], slug: string) {
  const i = chapters.findIndex((c) => chapterSlug(c) === slug);
  return {
    prev: i > 0 ? chapters[i - 1] : null,
    next: i !== -1 && i < chapters.length - 1 ? chapters[i + 1] : null,
  };
}

const ISLAND_NOTE: Record<Locale, string> = {
  en: "\n> (Interactive demo — try it on the site)\n",
  ja: "\n> （インタラクティブ・デモ：サイト上で操作できます）\n",
};
const FIGURE_PREFIX: Record<Locale, string> = { en: "🖼 Figure: ", ja: "🖼 図：" };
const FIGURE_FALLBACK: Record<Locale, string> = {
  en: "\n> (Figure — shown on the site)\n",
  ja: "\n> （図表：サイト上で表示されます）\n",
};
const REFS_HEADING: Record<Locale, string> = {
  en: "References & further reading",
  ja: "参考文献・さらに学ぶ",
};
const ATTRIBUTION: Record<Locale, (url: string) => string> = {
  en: (url) =>
    `From "How AI Works and How to Use It" by Shinsuke Mori — licensed CC BY 4.0. Source: ${url}`,
  ja: (url) => `「AI のしくみと使い方」（著: Shinsuke Mori）より — CC BY 4.0。出典: ${url}`,
};

// Figures are SVG components that can't render in a plain-text/LLM export, so we
// describe each one in words (the export's purpose is to be fed to an LLM).
const FIGURE_DESC: Record<Locale, Record<string, string>> = {
  ja: {
    TokenChips:
      "文をトークン（部品）に分ける例。よく使う短い語は 1 トークン、長い・珍しい語は部品の組み合わせで表す。",
    WordAspects:
      "単語を「側面ごとの数の並び」で表す表。猫と犬は並びが似ていて、虎は「動物っぽさ」だけ猫と近く、車は大きく違う。",
    ContextClues:
      "同じような文脈（周りの言葉）に現れる語は意味が近い、という考え方の図。猫・犬は同じ空所に入り、車は入らない。",
    WordAnalogy:
      "意味の関係を足し算引き算で表せる図。「男→女」と「王様→女王」の向きが同じで、王様−男+女≈女王。",
    Neuron: "ニューロン 1 個の図。入力に重みをかけて足し、スイッチ（活性化）を通して出力する。",
    NeuralNetFlow:
      "層を重ねたニューラルネットワークの図。入力→予測の順伝播と、まちがいを逆向きに配る誤差逆伝播。",
    VectorViews:
      "ベクトル (170, 60) を「数の並び」と「矢印」の 2 通りで描いた図（同じものの 2 つの見方）。",
    SimilarityArrows:
      "向きが近い 2 本の矢印（意味が近い）と、大きく開いた 2 本の矢印（意味が遠い）の対比。",
    DistanceTriangle:
      "「走る」(0.6, 0.6) と「歩く」(0.7, 0.15) を点として描いた図。2 点のあいだに横の差 0.1・縦の差 0.45 を 2 辺とする直角三角形がかくれていて、斜辺が距離。三平方の定理で 距離 ＝ √(0.1² ＋ 0.45²) ≒ 0.46 と計算できる。",
    LengthVsDirection:
      "「走る」(0.6,0.6) と「ダッシュする」(1.2,1.2) は同じ向きで長さ違いの矢印、「歩く」(0.7,0.15) は別の向き。左：点と点の距離で測ると、走るはダッシュするより歩くに近いという誤判定になる。右：矢印をぜんぶ長さ 1 にそろえると勢いが消え、走るとダッシュするが重なり、向き（＝意味のバランス）だけで比べられる。",
    ProbabilityBars: "次の単語の確率分布を表す棒グラフ（割合の合計は 100%）。",
    GradientDescent: "損失の谷（U 字カーブ）を、ボールが傾きの逆向きに一歩ずつ下っていく図。",
    OrderMatters:
      "同じ 5 単語「犬・が・猫・を・追いかけた」を並べかえた 2 文。「が」の前の語が入れかわると、追いかける側とされる側が逆になる。順番が意味を決めることを示す図。",
    RecurrenceChain:
      "昔の再帰モデルの読み方の図。文を一語ずつ読み、決まった大きさの「メモ（隠れ状態）」を更新しながら次の単語へ持ち越していく。",
    SequentialVsParallel:
      "上：再帰は前の単語が終わるまで次に進めず一列で順番に処理する（おそい）。下：すべての単語を同時に処理する理想（はやい）。両者を対比した図。",
    QueryKeyValue:
      "1 つの単語が同時に持つ 3 つの役割の図。クエリ（質問：何に注目したいか）、キー（見出し：自分を説明する看板）、バリュー（中身：選ばれたときに渡す情報）。",
    AttentionScores:
      "アテンションの 1 手順の例。「それ」のクエリと各単語のキーの合い具合を点数にし（ボール3・犬1・投げた0）、softmax で合計100%の割合（ボール84%・犬11%・投げた4%）に直す表。",
    TransformerBlock:
      "Transformer ブロック 1 つの構成図。①自己注意（横で情報を混ぜる）→②フィードフォワード（各単語が噛み砕く）の 2 段。各段の前後で残差接続（足し戻す）と層正規化（ならす）を行い、このブロックを N 層積み重ねる。",
    PositionTag:
      "各単語に位置タグ（位置エンコーディング）を足す図。アテンションは重みつきの足し算で順番が見えないため、「何番目か」を表す番号を各単語ベクトルに加えて語順を取り戻す。",
    SelfLabel:
      "自己教師ありの図。文章の次の単語を隠すと、その隠した単語そのものが正解になる。人が正解を用意しなくてよいので、世の中の文章をそのまま教材にできる。",
    SelfSupervisedExamples:
      "「次の単語を当てる」だけで多様な力が育つ例。富士山＝知識、7＝計算、行った＝文法、傘をさした＝常識。うまく当てようとするほど副産物としてこれらが身につく。",
    BaseVsAssistant:
      "素のベースモデルと調整後アシスタントの応答の対比。「明日の天気は？」に、素のモデルは質問の続きを書くだけ（✕）だが、調整後は地域を聞き返して役に立とうとする（✓）。",
    ThreeStages:
      "素のモデルを助手に育てる 3 ステップの図。①事前学習＝物知り、②お手本まね（SFT・指示チューニング）＝指示に従える、③好みで調整（RLHF）＝親切・安全。",
    AutoregLoop:
      "文章生成のくり返しの図。これまでの文→モデル→次の単語の確率→1語えらぶ→末尾に足す→また入力に戻す（自己回帰）。1 語ずつ左から右へ文が伸びる。",
    TemperatureEffect:
      "「空は＿」の次の単語の確率が temperature で変わる図。低温はとがった山（青いに集中＝無難）、高温はなだらか（広い・高いも選ばれ多様）。",
    ScalingCurve:
      "規模（大きさ・データ・計算）を横軸、損失を縦軸にした右下がりの曲線。最初は急に、だんだん効きにくく下がり、下限に近づく。規則的なので訓練前に賢さを予測できる（スケーリング則）。",
    ThreeIngredients:
      "賢さを伸ばす 3 つのレバー（モデルの大きさ・データの量・計算の量）の図。どれか 1 つだけでなく 3 つをバランスよく一緒に増やすのが大事。",
    Quantization:
      "つまみ（重み）を少ないビット数であらく丸める量子化の図。16/8/4 ビットでメモリが 100/50/25% と減る。精度を少し犠牲にしてメモリを節約し、小さなハードでも動かせる。",
    AttentionMemory:
      "素朴な注意は n×n の点数表を丸ごと保存（メモリ大）。FlashAttention は表を小さなブロックに分け順番に計算し、保存はブロック 1 つぶんだけ。答えは同じでメモリ減・高速化。",
    Multimodal:
      "画像・音声・文字をそれぞれエンコーダで同じ形のベクトル列に変換し、Transformer に流す図。どの入力も同じベクトルにそろえれば言語モデルの仕組みをそのまま使える。",
    ReasoningSteps:
      "一気に答えると不正解（✕）、問題→考え1→考え2→答えと順を追うと正解（✓）になる対比。思考の連鎖や、答えるときに計算をかけるテスト時計算で難問に強くなる。",
    AgentLoop:
      "エージェントのループ図。①考える→②道具を使う（検索・計算・コード）→③結果を見る→④次の手を決める、を終わりまで繰り返す。道具で単体モデルの限界を補う。",
    RequestResponse:
      "モデルを「ネット越しに呼べる窓口」として描いた図。あなたのプログラム（クライアント）がリクエストを送り、モデル（サーバー）がレスポンスを返す。返事を読むのが人なら自由な文で良いが、プログラムだと形が決まっていないと困る、という対比。",
    ToolCall:
      "ツール（関数呼び出し）の一周の図。モデルが「get_weather(東京) を呼んで」という構造化された依頼を出す→プログラムが実際にツールを実行→結果（28度）をモデルに戻す→モデルが最終的な返事を作る。",
    McpSocket:
      "左：モデルとツールを一つずつ手配線でつなぐと本数が M×N に増えて破綻。右：MCP という共通コンセントを挟むと、各モデル・各ツールは MCP にだけつなげばよく、線が M＋N で済む。USB-C のたとえ。",
  },
  en: {
    TokenChips:
      "Splitting a sentence into tokens (pieces): common short words are one token; long or rare words are built from sub-pieces.",
    WordAspects:
      "A word shown as a row of numbers (one per aspect). Cat and dog have similar rows; the tiger is near the cat only in animal-ness; the car is very different.",
    ContextClues:
      "The distributional idea: words that fit the same blanks (contexts) mean similar things. Cat and dog fit the same slots; car does not.",
    WordAnalogy:
      'Meaning relationships as vector arithmetic: "man→woman" and "king→queen" point the same way, so king − man + woman ≈ queen.',
    Neuron:
      "One neuron: multiply each input by a weight, add them up, then pass the sum through a switch (activation) to produce an output.",
    NeuralNetFlow:
      "A layered neural network: the forward pass (input → prediction) and backpropagation, which sends the error backward to fix the weights.",
    VectorViews:
      "The vector (170, 60) drawn two ways — as a list of numbers and as an arrow (two views of the same thing).",
    SimilarityArrows:
      "Two arrows pointing nearly the same way (similar meaning) versus two arrows far apart (distant meaning).",
    DistanceTriangle:
      '"run" (0.6, 0.6) and "walk" (0.7, 0.15) drawn as points. Hiding between them is a right triangle with legs 0.1 (across) and 0.45 (up); the hypotenuse is the distance, computed by the Pythagorean theorem: distance = √(0.1² + 0.45²) ≈ 0.46.',
    LengthVsDirection:
      '"run" (0.6,0.6) and "sprint" (1.2,1.2) as same-direction arrows of different lengths, with "walk" (0.7,0.15) pointing elsewhere. Left: the straight-line distance between points wrongly rules run closer to walk than to sprint. Right: scaling every arrow to length 1 removes the momentum — run and sprint overlap, and only direction (the balance of meaning) is compared.',
    ProbabilityBars:
      "A bar chart of the probabilities for the next word (the shares add up to 100%).",
    GradientDescent:
      "A loss valley (U-shaped curve) with a ball stepping downhill, against the slope, one small step at a time.",
    OrderMatters:
      'The same five words "dog / ga / cat / wo / chased" rearranged into two sentences. Swapping the word before "ga" flips who chases whom — order carries meaning.',
    RecurrenceChain:
      'How old recurrent models read: one word at a time, updating a fixed-size "memo" (hidden state) and carrying it to the next word.',
    SequentialVsParallel:
      "Top: recurrence must finish one word before the next, processing strictly in line (slow). Bottom: the ideal of processing all words at once (fast).",
    QueryKeyValue:
      "The three roles every word plays at once: Query (what am I looking for?), Key (the label advertising what I am), Value (the content handed over when chosen).",
    AttentionScores:
      "One attention step: score how well \"it\"'s query matches each word's key (ball 3, dog 1, threw 0), then softmax turns the scores into shares summing to 100% (ball 84%, dog 11%, threw 4%).",
    TransformerBlock:
      "One Transformer block: ① self-attention (mix info across words) → ② feed-forward (each word digests it). Each stage is wrapped by add-back (residual) + normalise, and the block is stacked N times.",
    PositionTag:
      'Adding a position tag (positional encoding) to each word. Attention is a weighted sum and is order-blind, so a "which position" number is added to each word vector to restore order.',
    SelfLabel:
      "Self-supervision: hide the next word and that hidden word is itself the answer. No human has to label anything, so any text becomes training data.",
    SelfSupervisedExamples:
      'Predicting the next word alone forces many skills: Mt. Fuji = knowledge, 7 = arithmetic, "went" = grammar, "opened the umbrella" = common sense — all picked up as a by-product.',
    BaseVsAssistant:
      'Base model vs aligned assistant on "What\'s the weather tomorrow?": the base model just continues the text (✗), while the tuned assistant asks for your area and tries to help (✓).',
    ThreeStages:
      "Three stages to raise a raw model into an assistant: ① pretraining = knowledgeable, ② imitating good answers (SFT / instruction tuning) = follows instructions, ③ preference tuning (RLHF) = helpful & safe.",
    AutoregLoop:
      "The generation loop: text-so-far → model → next-word probabilities → pick one → append → feed back in (autoregression). The sentence grows one word at a time, left to right.",
    TemperatureEffect:
      'How temperature reshapes the next-word probabilities for "The sky is ___": low temperature is a peaked hill (focuses on "blue", safe); high temperature is flat (also picks "wide", "high" — varied).',
    ScalingCurve:
      "Scale (size, data, compute) on the x-axis, loss on the y-axis: a curve that drops steeply at first, then flattens toward a floor. Because it is regular, the gain can be predicted before training (scaling laws).",
    ThreeIngredients:
      "The three levers for capability (model size, amount of data, amount of compute). The trick is to grow all three together and in balance, not just one.",
    Quantization:
      "Quantization stores each weight in fewer bits (coarser rounding). 16/8/4 bits use 100/50/25% of the memory — trade a little precision for big memory savings so models run on smaller hardware.",
    AttentionMemory:
      "Naive attention stores the whole n×n score table (large memory). FlashAttention computes it block by block, keeping only one block at a time — same answer, far less memory and faster.",
    Multimodal:
      "Images, audio and text are each turned by an encoder into the same kind of vector sequence and fed to the Transformer. Once everything is the same vectors, the language-model machinery is reused as-is.",
    ReasoningSteps:
      "Answering in one shot is wrong (✗); going problem → thought 1 → thought 2 → answer gets it right (✓). Chain-of-thought and spending more compute at answer time (test-time compute) help on hard problems.",
    AgentLoop:
      "The agent loop: ① think → ② use a tool (search, calculator, code) → ③ read the result → ④ decide the next move, repeated until done. Tools cover the limits of the model alone.",
    RequestResponse:
      'A model drawn as a "window you can call across the network": your program (the client) sends a request, the model (the server) returns a response. A person reading the reply is fine with free text, but a program needs a fixed shape.',
    ToolCall:
      "One turn of tool use (function calling): the model emits a structured request ('call get_weather(Tokyo)') → the program actually runs the tool → the result (28°C) is fed back to the model → the model writes the final reply.",
    McpSocket:
      "Left: wiring each model to each tool by hand makes the number of connections blow up to M×N. Right: putting an MCP hub in between means each model and each tool only connects to MCP, so it's M+N. A USB-C analogy.",
  },
};

/**
 * Convert a chapter's raw (MDX) body into clean Markdown for the llms.txt
 * exports and per-chapter `.md` endpoints. Self-contained build logic (no
 * community llms integration), mirroring the Pagefind-as-CLI choice.
 *
 * The export is the COMPLETE chapter text. Interactive islands are replaced with a
 * short pointer note, and static figures are described in words (in `lang`).
 */
export function toCleanMarkdown(entry: Chapter, lang: Locale): string {
  const { title, description } = entry.data;
  let body = entry.body ?? "";

  // Drop ESM import/export lines that appear at the top of MDX files.
  body = body.replaceAll(/^[ \t]*import\s.+$/gm, "");
  body = body.replaceAll(/^[ \t]*export\s.+$/gm, "");

  // Replace interactive island components (self-closing or paired) with a note.
  const islands =
    "(ChatPeek|ChatScreen|ParamKnobs|AspectMixer|SimilarityLab|ShareLottery|JsonEye|RegexTrap|StructuredToggle|ToolLoop|McpPlug|AgentTrace|SamplingPlayground|EmbeddingCloud|BpeDemo|LearningLoop|RecurrentReader|AttentionDemo|CausalMaskDemo|NextWordTrainer|PreferencePicker|ScalingBalance|KVCacheDemo|MoERouter|Tokenizer|CopyForLLM)";
  body = body.replaceAll(new RegExp(`<${islands}\\b[^>]*\\/>`, "g"), ISLAND_NOTE[lang]);
  body = body.replaceAll(
    new RegExp(`<${islands}\\b[^>]*>[\\s\\S]*?<\\/\\1>`, "g"),
    ISLAND_NOTE[lang],
  );

  // Describe each figure in words.
  const desc = FIGURE_DESC[lang];
  body = body.replaceAll(/<(?<name>[A-Z]\w*)\b[^>]*\/>/g, (_m, name: string) =>
    desc[name] ? `\n> ${FIGURE_PREFIX[lang]}${desc[name]}\n` : FIGURE_FALLBACK[lang],
  );

  // Tidy whitespace.
  body = body
    .replaceAll(/[ \t]+$/gm, "")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim();

  // Append the chapter's references so the exported Markdown (and thus the
  // "Ask AI" flow) carries verifiable sources.
  const refs = references[chapterSlug(entry)] ?? [];
  if (refs.length > 0) {
    const lines = refs.map((r) => {
      const meta = [r.by, r.year].filter(Boolean).join(", ");
      return `- [${r.title}](${r.url})${meta ? ` — ${meta}` : ""}`;
    });
    body += `\n\n## ${REFS_HEADING[lang]}\n\n${lines.join("\n")}`;
  }

  // Attribution footer so the CC BY 4.0 credit travels with copied/exported text.
  const url = absoluteLocale(lang, `${chapterSlug(entry)}/`);
  body += `\n\n---\n\n_${ATTRIBUTION[lang](url)}_`;

  return `# ${title}\n\n> ${description}\n\n${body}\n`;
}
