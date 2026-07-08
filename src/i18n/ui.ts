import type { Locale } from "../lib/chapters";

// Central dictionary for site chrome and landing/llms copy. Figures and interactive
// islands carry their own per-locale strings (selected by a `lang` prop), so this
// file stays focused on the shell.
export interface Strings {
  htmlLang: string;
  ogLocale: string; // OpenGraph locale, e.g. "en_US" / "ja_JP"
  navCurriculum: string;
  navExport: string;
  openFull: string;
  openIndex: string;
  navToggle: string;
  githubRepo: string;
  prev: string;
  next: string;
  toc: string;
  references: string;
  metaDesc: string;
  homeLead: string;
  homePoints: string[];
  startReading: string;
  homeNeutral: string;
  disclaimer: string;
  reportIssue: string;
  homeExportHeading: string;
  homeExportBody: string;
  copyPage: string;
  llmsSummary: string;
  llmsIntro: string;
  llmsFullTitle: string;
  llmsFullDesc: string;
  llmsFullHeading: string;
  llmsFullBlurb: string;
}

const ui: Record<Locale, Strings> = {
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    navCurriculum: "Curriculum",
    navExport: "For LLMs",
    openFull: "Open /llms-full.txt",
    openIndex: "Open /llms.txt (index)",
    navToggle: "Toggle navigation",
    githubRepo: "View the source on GitHub",
    prev: "← Previous",
    next: "Next →",
    toc: "On this page",
    references: "References & further reading",
    metaDesc:
      "How large language models work inside, and how they are put to work in real apps — explained from zero background with figures and interactive demos.",
    homeLead:
      "Why can an AI talk at all? From zero background to the frontier, just by reading top to bottom.",
    homePoints: ['Starts from the "why?"', "24 short chapters", "Figures & hands-on demos"],
    startReading: "Start with Chapter 1 →",
    homeNeutral:
      "The explanations are vendor-neutral. We mention GPT, Llama, Claude, Gemini, Mistral and Qwen evenly as examples, but the concepts are explained in general terms.",
    disclaimer:
      'The content of this site has not been reviewed by domain experts. That is exactly why every chapter carries canonical references and an "Ask AI" button, so you can verify the material yourself — and why error reports and suggestions are so welcome.',
    reportIssue: "Report an error or suggest an improvement (GitHub Issues)",
    homeExportHeading: "Feed the whole site to an LLM",
    homeExportBody:
      "The entire site is bundled into one Markdown file, llms-full.txt. Copy it and paste it into your LLM to ask questions about anything here.",
    copyPage: "Copy this page",
    llmsSummary:
      "A learning site explaining how LLMs work, from zero background to the frontier, with figures and interactive demos.",
    llmsIntro:
      "Written from a vendor-neutral stance. Each chapter is a flat, beginner-first explanation that motivates the why before the what.",
    llmsFullTitle: "Full text of every chapter in one file (llms-full.txt)",
    llmsFullDesc: "The complete material: every chapter concatenated into a single file.",
    llmsFullHeading: " — full text for LLMs",
    llmsFullBlurb:
      "The whole site as one file: every chapter's text concatenated. Interactive demos are replaced with a short note and figures are described in words.",
  },
  ja: {
    htmlLang: "ja",
    ogLocale: "ja_JP",
    navCurriculum: "カリキュラム",
    navExport: "LLM 向けエクスポート",
    openFull: "/llms-full.txt を開く",
    openIndex: "/llms.txt（索引）を開く",
    navToggle: "ナビゲーションを開閉",
    githubRepo: "GitHub でソースを見る",
    prev: "← 前の章",
    next: "次の章 →",
    toc: "この章の目次",
    references: "参考文献・さらに学ぶ",
    metaDesc:
      "AI はなぜ話せるのか、そしてどう使うのか。LLM（大規模言語モデル）の内部のしくみから活用のしかたまで、予備知識ゼロから、図とインタラクティブなデモでやさしく学ぶ学習サイト。",
    homeLead:
      "AI はなぜ、言葉を話せるのか。予備知識ゼロから最先端まで、順番に読むだけで分かります。",
    homePoints: ["「なぜ？」から説明", "全 24 章の短い読みもの", "図と、さわれるデモつき"],
    startReading: "第 1 章から読みはじめる →",
    homeNeutral:
      "解説は特定のモデルや組織に偏りません。具体例として GPT・Llama・Claude・Gemini・Mistral・Qwen などを必要に応じてバランスよく挙げますが、概念は一般論として説明します。",
    disclaimer:
      "このサイトの内容は、専門家の査読（レビュー）を受けていません。だからこそ各章に検証用の参考文献と「AI に聞く」ボタンを用意しています。まちがいの報告や改善の提案も大歓迎です。",
    reportIssue: "まちがいを報告する・提案する（GitHub Issues）",
    homeExportHeading: "サイト全文を LLM に渡す",
    homeExportBody:
      "サイト全体を 1 つの Markdown にまとめた llms-full.txt を用意しています。コピーしてお使いの LLM に貼り付ければ、サイト全体について質問できます。",
    copyPage: "ページをコピー",
    llmsSummary:
      "LLM（大規模言語モデル）のしくみを、予備知識ゼロから最先端まで、図とインタラクティブなデモで学ぶ学習サイト。",
    llmsIntro:
      "解説は特定のモデルや組織に偏らない中立な立場で書かれています。各章は予備知識ゼロから読める、フラットでやさしい解説です。",
    llmsFullTitle: "全章を 1 ファイルに連結した完全版 (llms-full.txt)",
    llmsFullDesc: "全章の本文を結合した完全な素材",
    llmsFullHeading: " — 全章まとめ（LLM 用フルテキスト）",
    llmsFullBlurb:
      "サイト全章の本文を 1 つに連結した完全版です。インタラクティブなデモはテキストでは注記に、図は文章での説明に置き換えています。",
  },
};

export function t(lang: Locale): Strings {
  return ui[lang];
}
