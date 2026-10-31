<script lang="ts">
  // Interactive BPE walkthrough (in-memory only; reload resets).
  // Part 1 finds the most frequent adjacent pair across the words and merges
  // it — the real algorithm, one click at a time. The rows are the chapter
  // figure's short text, cut at the punctuation (ja) or at the spaces (en), so
  // every count shown can be checked by eye. The demo stops once no pair occurs
  // twice (a real tokenizer stops at its target vocabulary size); when several
  // pairs tie, the one seen first wins, and the demo says so. Part 2 replays
  // the rules learned so far, in order, on a
  // word outside the list, so the reader sees what BPE leaves behind (an
  // ordered rule list) and what a character outside the starting pieces looks
  // like.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Pair {
    a: string;
    b: string;
    count: number;
  }

  interface Best extends Pair {
    ties: number;
  }

  interface Applied {
    rule: number;
    a: string;
    b: string;
    toks: string[];
  }

  const T = {
    ja: {
      corpus: [
        "東京に住む",
        "東京駅から京都へ行った",
        "京都は古い町だ",
        "東京都には島もある",
        "東京は人が多い",
      ],
      title: "BPE を 1 ステップずつ体験する",
      next: "次のステップ →",
      reset: "最初から",
      stepLabel: (n: number) => `くっつけた回数: ${n}`,
      focus: (a: string, b: string, c: number) =>
        `一番多いペアは <b>${a}</b> ＋ <b>${b}</b> → <b>${a + b}</b>（${c} 回）。「次のステップ」でこれをくっつけます。`,
      tie: " 同じ回数のペアが他にもありますが、先に出てきたものを選びます。",
      done: "2 回以上出てくるペアがなくなったので、このデモはここで終わりです。本物は、一覧表が望みの大きさになるまで続けます。",
      rulesTitle: "覚えた結合ルール（この順に適用される）",
      rule: (a: string, b: string) => `${a} ＋ ${b} → `,
      tryTitle: "覚えたルールで、新しい語を区切ってみる",
      tryWords: ["東京都", "京都市", "大阪"],
      tryIntro: (n: number) =>
        n === 0
          ? "まだルールを 1 つも覚えていないので、1 文字ずつのままです。上の「次のステップ」を押してから、戻ってきてください。"
          : `覚えている ${n} 個のルールを、1 番から順に当てはめます。`,
      start: "最初は 1 文字ずつ：",
      applied: (i: number, a: string, b: string) =>
        `ルール ${i}（${a} ＋ ${b} → ${a + b}）が当てはまった：`,
      noneApplied: "当てはまるルールはありませんでした。",
      result: (n: number) => `結果：${n} 部品`,
      unknown: (chars: string[]) =>
        `${chars.map((c) => `「${c}」`).join("")}は最初の部品（上の文章に出てきた文字）にありません。どのルールも当てはまらず、モデルはここを読めません。`,
    },
    en: {
      corpus: ["the", "cat", "sat", "on", "the", "mat"],
      title: "Try BPE one step at a time",
      next: "Next step →",
      reset: "Restart",
      stepLabel: (n: number) => `Merges so far: ${n}`,
      focus: (a: string, b: string, c: number) =>
        `The most frequent pair is <b>${a}</b> + <b>${b}</b> → <b>${a + b}</b> (${c} times). Press "Next step" to merge it.`,
      tie: " Other pairs tie at this count; the one that appears first wins.",
      done: "No pair occurs twice any more, so the demo stops here. A real tokenizer keeps going until the list reaches the size it wants.",
      rulesTitle: "Merge rules learned (applied in this order)",
      rule: (a: string, b: string) => `${a} + ${b} → `,
      tryTitle: "Use the learned rules on a new word",
      tryWords: ["that", "math", "dog"],
      tryIntro: (n: number) =>
        n === 0
          ? 'No rule has been learned yet, so the word stays one letter per piece. Press "Next step" above, then come back.'
          : n === 1
            ? "Applying the one rule learned so far."
            : `Applying the ${n} rules learned so far, in order from rule 1.`,
      start: "Start, one letter per piece:",
      applied: (i: number, a: string, b: string) => `rule ${i} (${a} + ${b} → ${a + b}) applied:`,
      noneApplied: "No rule applied.",
      result: (n: number) => `Result: ${n} ${n === 1 ? "piece" : "pieces"}`,
      unknown: (chars: string[]) =>
        `${chars.map((c) => `"${c}"`).join(", ")} ${chars.length === 1 ? "is" : "are"} not among the starting pieces (the letters in the words above). No rule can apply there, and the model cannot read it.`,
    },
  }[lang];

  const { corpus } = T;
  const split = (w: string) => [...w];

  // Glue every occurrence of the pair (a, b) in one word's token list.
  function mergePair(toks: string[], a: string, b: string): string[] {
    const out: string[] = [];
    for (let i = 0; i < toks.length; i += 1) {
      if (toks[i] === a && toks[i + 1] === b) {
        out.push(a + b);
        i += 1;
      } else {
        out.push(toks[i]);
      }
    }
    return out;
  }

  let segments = $state<string[][]>(corpus.map((w) => split(w)));
  let merges = $state<[string, string][]>([]);

  // The most frequent adjacent pair across the words (null once no pair occurs
  // twice). Tokens grow to several characters after a merge, so a pair
  // cannot be recovered by splitting a joined string: the key only has to be
  // unambiguous, and the pair itself travels in the value. Ties go to the pair
  // seen first, as in the reference implementation.
  const best = $derived.by(() => {
    const counts = new Map<string, Pair>();
    for (const toks of segments) {
      for (let i = 0; i < toks.length - 1; i += 1) {
        const a = toks[i];
        const b = toks[i + 1];
        const key = JSON.stringify([a, b]);
        const pair = counts.get(key) ?? { a, b, count: 0 };
        pair.count += 1;
        counts.set(key, pair);
      }
    }
    let top: Pair | null = null;
    for (const pair of counts.values()) {
      if (!top || pair.count > top.count) {
        top = pair;
      }
    }
    if (!top || top.count < 2) {
      return null;
    }
    let ties = 0;
    for (const pair of counts.values()) {
      if (pair.count === top.count) {
        ties += 1;
      }
    }
    const result: Best = { a: top.a, b: top.b, count: top.count, ties };
    return result;
  });

  function step() {
    const pair = best;
    if (!pair) {
      return;
    }
    segments = segments.map((toks) => mergePair(toks, pair.a, pair.b));
    merges = [...merges, [pair.a, pair.b]];
  }

  function reset() {
    segments = corpus.map((w) => split(w));
    merges = [];
  }

  function hot(wi: number, ti: number): boolean {
    const pair = best;
    if (!pair) {
      return false;
    }
    const toks = segments[wi];
    return (
      (toks[ti] === pair.a && toks[ti + 1] === pair.b) ||
      (toks[ti] === pair.b && toks[ti - 1] === pair.a)
    );
  }

  // Part 2: replay the learned rules, in order, on a word outside the list.
  // The starting pieces are the characters of the list; a character outside
  // that set can never be merged (no rule mentions it), which is the "unknown
  // character" problem the chapter then solves with bytes.
  const known = new Set(corpus.flatMap((w) => split(w)));
  const isUnknown = (t: string) => split(t).length === 1 && !known.has(t);

  let tryWord = $state<string>(T.tryWords[0]);
  const tryChars = $derived(split(tryWord));

  const trace = $derived.by(() => {
    let toks = split(tryWord);
    const applied: Applied[] = [];
    merges.forEach(([a, b], i) => {
      const next = mergePair(toks, a, b);
      if (next.length < toks.length) {
        toks = next;
        applied.push({ rule: i + 1, a, b, toks });
      }
    });
    return { toks, applied, unknown: [...new Set(toks.filter((t) => isUnknown(t)))] };
  });
</script>

<div class="widget bpe">
  <p class="widget__title">{T.title}</p>

  <div class="bpe__controls">
    <button class="btn btn--accent" onclick={step} disabled={!best}>{T.next}</button>
    <button class="btn" onclick={reset}>{T.reset}</button>
    <span class="bpe__step">{T.stepLabel(merges.length)}</span>
  </div>

  <p class="bpe__focus">
    {#if best}
      {@html T.focus(best.a, best.b, best.count) + (best.ties > 1 ? T.tie : "")}
    {:else}
      {T.done}
    {/if}
  </p>

  <ul class="bpe__words">
    {#each segments as toks, wi (wi)}
      <li>
        <span class="bpe__toks">
          {#each toks as t, ti (ti)}
            <span class="bpe__tok" class:hot={hot(wi, ti)}>{t}</span>
          {/each}
        </span>
      </li>
    {/each}
  </ul>

  {#if merges.length > 0}
    <p class="bpe__rules-title">{T.rulesTitle}</p>
    <ol class="bpe__rules">
      {#each merges as [a, b], i (i)}
        <li>{@html T.rule(a, b)}<b>{a + b}</b></li>
      {/each}
    </ol>
  {/if}

  <div class="bpe__try">
    <p class="bpe__rules-title">{T.tryTitle}</p>
    <div class="bpe__presets">
      {#each T.tryWords as w (w)}
        <button class="btn" class:btn--accent={w === tryWord} onclick={() => (tryWord = w)}>
          {w}
        </button>
      {/each}
    </div>
    <p class="bpe__focus">{T.tryIntro(merges.length)}</p>
    <ul class="bpe__trace">
      <li>
        <span>{T.start}</span>
        <span class="bpe__toks">
          {#each tryChars as t, i (i)}
            <span class="bpe__tok" class:bpe__tok--unk={isUnknown(t)}>{t}</span>
          {/each}
        </span>
      </li>
      {#each trace.applied as s (s.rule)}
        <li>
          <span>{T.applied(s.rule, s.a, s.b)}</span>
          <span class="bpe__toks">
            {#each s.toks as t, i (i)}
              <span class="bpe__tok" class:bpe__tok--unk={isUnknown(t)}>{t}</span>
            {/each}
          </span>
        </li>
      {/each}
      {#if merges.length > 0 && trace.applied.length === 0}
        <li><span>{T.noneApplied}</span></li>
      {/if}
    </ul>
    <p class="bpe__result">{T.result(trace.toks.length)}</p>
    {#if trace.unknown.length > 0}
      <p class="bpe__focus bpe__focus--last">{T.unknown(trace.unknown)}</p>
    {/if}
  </div>
</div>
