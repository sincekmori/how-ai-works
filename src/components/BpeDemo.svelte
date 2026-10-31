<script lang="ts">
  // Interactive BPE walkthrough (in-memory only; reload resets). Each step finds
  // the most frequent adjacent pair across the corpus and merges it — the real
  // algorithm, one click at a time. The corpus is illustrative and starts so the
  // first merge matches the chapter's example (ja: ね+こ → ねこ; en: l+o → lo).
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Word {
    word: string;
    freq: number;
  }

  interface Pair {
    a: string;
    b: string;
    count: number;
  }

  const T = {
    ja: {
      corpus: [
        { word: "ねこ", freq: 4 },
        { word: "こねこ", freq: 3 },
        { word: "ねむい", freq: 2 },
        { word: "こねる", freq: 2 },
      ] as Word[],
      title: "BPE を 1 ステップずつ体験する",
      next: "次のステップ →",
      reset: "最初から",
      stepLabel: (n: number) => `くっつけた回数: ${n}`,
      focus: (a: string, b: string, c: number) =>
        `一番多いペアは <b>${a}</b> ＋ <b>${b}</b> → <b>${a + b}</b>（${c} 回）。「次のステップ」でこれをくっつけます。`,
      done: "もうくっつけられるペアはありません（完了）。",
      rulesTitle: "覚えた結合ルール（この順に適用される）",
      rule: (a: string, b: string) => `${a} ＋ ${b} → `,
    },
    en: {
      corpus: [
        { word: "low", freq: 4 },
        { word: "slow", freq: 3 },
        { word: "lower", freq: 2 },
        { word: "lot", freq: 3 },
      ] as Word[],
      title: "Try BPE one step at a time",
      next: "Next step →",
      reset: "Restart",
      stepLabel: (n: number) => `Merges so far: ${n}`,
      focus: (a: string, b: string, c: number) =>
        `The most frequent pair is <b>${a}</b> + <b>${b}</b> → <b>${a + b}</b> (${c} times). Press "Next step" to merge it.`,
      done: "No more pairs left to merge (done).",
      rulesTitle: "Merge rules learned (applied in this order)",
      rule: (a: string, b: string) => `${a} + ${b} → `,
    },
  }[lang];

  const { corpus } = T;
  const split = (w: string) => [...w];

  let segments = $state<string[][]>(corpus.map((w) => split(w.word)));
  let merges = $state<[string, string][]>([]);

  // The most frequent adjacent pair across the corpus (null once nothing is left
  // to merge). Tokens grow to several characters after a merge, so a pair cannot
  // be recovered by splitting a joined string: the key only has to be
  // unambiguous, and the pair itself travels in the value. Ties go to the pair
  // seen first, as in the reference implementation.
  const best = $derived.by(() => {
    const counts = new Map<string, Pair>();
    segments.forEach((toks, wi) => {
      for (let i = 0; i < toks.length - 1; i += 1) {
        const a = toks[i];
        const b = toks[i + 1];
        const key = JSON.stringify([a, b]);
        const pair = counts.get(key) ?? { a, b, count: 0 };
        pair.count += corpus[wi].freq;
        counts.set(key, pair);
      }
    });
    let top: Pair | null = null;
    for (const pair of counts.values()) {
      if (!top || pair.count > top.count) {
        top = pair;
      }
    }
    return top;
  });

  function step() {
    const pair = best;
    if (!pair) {
      return;
    }
    segments = segments.map((toks) => {
      const out: string[] = [];
      for (let i = 0; i < toks.length; i += 1) {
        if (toks[i] === pair.a && toks[i + 1] === pair.b) {
          out.push(pair.a + pair.b);
          i += 1;
        } else {
          out.push(toks[i]);
        }
      }
      return out;
    });
    merges = [...merges, [pair.a, pair.b]];
  }

  function reset() {
    segments = corpus.map((w) => split(w.word));
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
      {@html T.focus(best.a, best.b, best.count)}
    {:else}
      {T.done}
    {/if}
  </p>

  <ul class="bpe__words">
    {#each segments as toks, wi (corpus[wi].word)}
      <li>
        <span class="bpe__freq">×{corpus[wi].freq}</span>
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
</div>
