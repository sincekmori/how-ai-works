// Per-chapter references — canonical primary sources (peer-reviewed papers and
// widely-cited books/explainers) so readers can verify the material themselves,
// independent of the author's expertise. Language-neutral (titles/URLs are the
// same in both locales); only the section heading is localised. Keyed by bare slug.

export interface Reference {
  title: string;
  by?: string;
  year?: number;
  url: string;
}

export const references: Record<string, Reference[]> = {
  "the-one-job": [
    {
      title: "What Is ChatGPT Doing … and Why Does It Work?",
      by: "Stephen Wolfram",
      year: 2023,
      url: "https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/",
    },
  ],
  vectors: [
    {
      title: "Essence of linear algebra (vectors)",
      by: "3Blue1Brown",
      url: "https://www.3blue1brown.com/topics/linear-algebra",
    },
    {
      title: "Deep Learning — Ch. 2 (linear algebra)",
      by: "Goodfellow, Bengio & Courville",
      year: 2016,
      url: "https://www.deeplearningbook.org/",
    },
  ],
  similarity: [
    {
      title: "Essence of linear algebra (dot products, cosine similarity)",
      by: "3Blue1Brown",
      url: "https://www.3blue1brown.com/topics/linear-algebra",
    },
    {
      title: "Speech and Language Processing — Ch. 6 (vector semantics, cosine)",
      by: "Jurafsky & Martin",
      year: 2025,
      url: "https://web.stanford.edu/~jurafsky/slp3/",
    },
  ],
  probability: [
    {
      title: "Deep Learning — Ch. 3 (probability)",
      by: "Goodfellow, Bengio & Courville",
      year: 2016,
      url: "https://www.deeplearningbook.org/",
    },
    {
      title: "Seeing Theory — a visual introduction to probability",
      by: "Brown University",
      url: "https://seeing-theory.brown.edu/",
    },
  ],
  tokenization: [
    {
      title: "Neural Machine Translation of Rare Words with Subword Units (BPE)",
      by: "Sennrich, Haddow & Birch",
      year: 2016,
      url: "https://arxiv.org/abs/1508.07909",
    },
    {
      title: "SentencePiece: A simple and language-independent subword tokenizer",
      by: "Kudo & Richardson",
      year: 2018,
      url: "https://arxiv.org/abs/1808.06226",
    },
    {
      title: "Summary of the tokenizers",
      by: "Hugging Face docs",
      url: "https://huggingface.co/docs/transformers/tokenizer_summary",
    },
  ],
  embeddings: [
    {
      title: "Efficient Estimation of Word Representations in Vector Space (word2vec)",
      by: "Mikolov et al.",
      year: 2013,
      url: "https://arxiv.org/abs/1301.3781",
    },
    {
      title: "Distributed Representations of Words and Phrases (analogies)",
      by: "Mikolov et al.",
      year: 2013,
      url: "https://arxiv.org/abs/1310.4546",
    },
    {
      title: "Speech and Language Processing — Ch. 6, Vector Semantics",
      by: "Jurafsky & Martin",
      url: "https://web.stanford.edu/~jurafsky/slp3/",
    },
  ],
  "neural-networks": [
    {
      title: "Neural networks & gradient descent (visual series)",
      by: "3Blue1Brown",
      url: "https://www.3blue1brown.com/topics/neural-networks",
    },
    {
      title: "Learning representations by back-propagating errors",
      by: "Rumelhart, Hinton & Williams",
      year: 1986,
      url: "https://www.nature.com/articles/323533a0",
    },
    {
      title: "Neural Networks and Deep Learning (online book)",
      by: "Michael Nielsen",
      url: "http://neuralnetworksanddeeplearning.com/",
    },
    {
      title: "Deep Learning — Ch. 6, Deep Feedforward Networks",
      by: "Goodfellow, Bengio & Courville",
      year: 2016,
      url: "https://www.deeplearningbook.org/",
    },
  ],
  "the-sequence-problem": [
    {
      title: "Long Short-Term Memory",
      by: "Hochreiter & Schmidhuber",
      year: 1997,
      url: "https://doi.org/10.1162/neco.1997.9.8.1735",
    },
    {
      title: "Learning Phrase Representations using RNN Encoder–Decoder (GRU)",
      by: "Cho et al.",
      year: 2014,
      url: "https://arxiv.org/abs/1406.1078",
    },
    {
      title: "Understanding LSTM Networks",
      by: "Christopher Olah",
      year: 2015,
      url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
    },
  ],
  attention: [
    {
      title: "Neural Machine Translation by Jointly Learning to Align and Translate",
      by: "Bahdanau, Cho & Bengio",
      year: 2014,
      url: "https://arxiv.org/abs/1409.0473",
    },
    {
      title: "Attention Is All You Need",
      by: "Vaswani et al.",
      year: 2017,
      url: "https://arxiv.org/abs/1706.03762",
    },
    {
      title: "The Illustrated Transformer",
      by: "Jay Alammar",
      url: "https://jalammar.github.io/illustrated-transformer/",
    },
  ],
  transformer: [
    {
      title: "Attention Is All You Need",
      by: "Vaswani et al.",
      year: 2017,
      url: "https://arxiv.org/abs/1706.03762",
    },
    {
      title: "RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)",
      by: "Su et al.",
      year: 2021,
      url: "https://arxiv.org/abs/2104.09864",
    },
    {
      title: "The Annotated Transformer",
      by: "Harvard NLP",
      url: "https://nlp.seas.harvard.edu/annotated-transformer/",
    },
  ],
  pretraining: [
    {
      title: "Language Models are Few-Shot Learners (GPT-3)",
      by: "Brown et al.",
      year: 2020,
      url: "https://arxiv.org/abs/2005.14165",
    },
    {
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      by: "Devlin et al.",
      year: 2018,
      url: "https://arxiv.org/abs/1810.04805",
    },
    {
      title: "Speech and Language Processing — Ch. on Language Models",
      by: "Jurafsky & Martin",
      url: "https://web.stanford.edu/~jurafsky/slp3/",
    },
  ],
  "fine-tuning": [
    {
      title: "Training language models to follow instructions with human feedback (InstructGPT)",
      by: "Ouyang et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2203.02155",
    },
    {
      title: "Deep reinforcement learning from human preferences",
      by: "Christiano et al.",
      year: 2017,
      url: "https://arxiv.org/abs/1706.03741",
    },
    {
      title: "Direct Preference Optimization (DPO)",
      by: "Rafailov et al.",
      year: 2023,
      url: "https://arxiv.org/abs/2305.18290",
    },
    {
      title: "LoRA: Low-Rank Adaptation of Large Language Models",
      by: "Hu et al.",
      year: 2021,
      url: "https://arxiv.org/abs/2106.09685",
    },
  ],
  "inference-sampling": [
    {
      title: "The Curious Case of Neural Text Degeneration (top-p / nucleus sampling)",
      by: "Holtzman et al.",
      year: 2019,
      url: "https://arxiv.org/abs/1904.09751",
    },
    {
      title: "Hierarchical Neural Story Generation (top-k sampling)",
      by: "Fan, Lewis & Dauphin",
      year: 2018,
      url: "https://arxiv.org/abs/1805.04833",
    },
    {
      title: "How to generate text with Transformers",
      by: "Hugging Face",
      url: "https://huggingface.co/blog/how-to-generate",
    },
  ],
  "scaling-laws": [
    {
      title: "Scaling Laws for Neural Language Models",
      by: "Kaplan et al.",
      year: 2020,
      url: "https://arxiv.org/abs/2001.08361",
    },
    {
      title: "Training Compute-Optimal Large Language Models (Chinchilla)",
      by: "Hoffmann et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2203.15556",
    },
    {
      title: "Emergent Abilities of Large Language Models",
      by: "Wei et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2206.07682",
    },
    {
      title: "Are Emergent Abilities of LLMs a Mirage? (a counterpoint)",
      by: "Schaeffer, Miranda & Koyejo",
      year: 2023,
      url: "https://arxiv.org/abs/2304.15004",
    },
  ],
  efficiency: [
    {
      title: "FlashAttention: Fast and Memory-Efficient Exact Attention",
      by: "Dao et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2205.14135",
    },
    {
      title: "GQA: Training Generalized Multi-Query Transformer Models",
      by: "Ainslie et al.",
      year: 2023,
      url: "https://arxiv.org/abs/2305.13245",
    },
    {
      title: "Fast Inference from Transformers via Speculative Decoding",
      by: "Leviathan, Kalman & Matias",
      year: 2023,
      url: "https://arxiv.org/abs/2211.17192",
    },
    {
      title: "LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale",
      by: "Dettmers et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2208.07339",
    },
  ],
  frontier: [
    {
      title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer",
      by: "Shazeer et al.",
      year: 2017,
      url: "https://arxiv.org/abs/1701.06538",
    },
    {
      title: "Chain-of-Thought Prompting Elicits Reasoning in LLMs",
      by: "Wei et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2201.11903",
    },
    {
      title: "ReAct: Synergizing Reasoning and Acting in Language Models",
      by: "Yao et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2210.03629",
    },
    {
      title: "Learning Transferable Visual Models From Natural Language Supervision (CLIP)",
      by: "Radford et al.",
      year: 2021,
      url: "https://arxiv.org/abs/2103.00020",
    },
  ],
  parameters: [
    {
      title: "The Curious Case of Neural Text Degeneration (sampling and its knobs)",
      by: "Holtzman et al.",
      year: 2019,
      url: "https://arxiv.org/abs/1904.09751",
    },
  ],
  "calling-the-model": [
    {
      title: "An overview of HTTP",
      by: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    },
    {
      title: "REST (glossary)",
      by: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
    },
  ],
  "extracting-data": [
    {
      title: "Regular expressions (guide)",
      by: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions",
    },
  ],
  json: [
    {
      title: "Introducing JSON",
      by: "json.org",
      url: "https://www.json.org/json-en.html",
    },
    {
      title: "The JSON Data Interchange Syntax (ECMA-404)",
      by: "Ecma International",
      year: 2017,
      url: "https://ecma-international.org/publications-and-standards/standards/ecma-404/",
    },
  ],
  "json-schema": [
    {
      title: "Efficient Guided Generation for Large Language Models",
      by: "Willard & Louf",
      year: 2023,
      url: "https://arxiv.org/abs/2307.09702",
    },
    {
      title: "JSON Schema — annotating and validating JSON",
      by: "json-schema.org",
      url: "https://json-schema.org/",
    },
  ],
  "tool-use": [
    {
      title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
      by: "Schick et al.",
      year: 2023,
      url: "https://arxiv.org/abs/2302.04761",
    },
    {
      title: "ReAct: Synergizing Reasoning and Acting in Language Models",
      by: "Yao et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2210.03629",
    },
  ],
  mcp: [
    {
      title: "Model Context Protocol — specification & introduction",
      by: "modelcontextprotocol.io",
      url: "https://modelcontextprotocol.io/",
    },
  ],
  agents: [
    {
      title: "ReAct: Synergizing Reasoning and Acting in Language Models",
      by: "Yao et al.",
      year: 2022,
      url: "https://arxiv.org/abs/2210.03629",
    },
    {
      title: "LLM Powered Autonomous Agents",
      by: "Lilian Weng",
      year: 2023,
      url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
    },
  ],
  "agent-skills": [
    {
      title: "Equipping agents for the real world with Agent Skills",
      by: "Anthropic",
      year: 2025,
      url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
    },
    {
      title: "Agent Skills — example skills and the folder format",
      by: "Anthropic (GitHub)",
      url: "https://github.com/anthropics/skills",
    },
  ],
};
