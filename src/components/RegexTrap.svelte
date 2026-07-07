<script lang="ts">
  // Try to pull the temperature (28) out of three differently-worded
  // sentences with a regex. Every pattern you pick handles some sentences and
  // breaks on others — no single one gets all three. Motivates asking for JSON.
  // In-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Pat {
    label: string;
    re: string; // source of a RegExp, no flags
  }

  const T = {
    ja: {
      title: "正規表現で「気温 28」を取り出せる？",
      goal: "ねらい：どの文からも数値 28（気温）を取り出したい。",
      sentences: [
        "東京は明日、28度まで上がるでしょう。",
        "3日の東京は、28度まで上がるでしょう。",
        "明日の東京の気温は28度です。",
      ],
      patterns: [
        { label: "\\d+（最初の数字）", re: "\\d+" },
        { label: "\\d\\d度まで", re: "\\d\\d度まで" },
        { label: "気温は\\d\\d度", re: "気温は\\d\\d度" },
      ] as Pat[],
      pick: "正規表現をえらぶ：",
      none: "（一致なし）",
      got: (n: string) => `取り出した数値：${n}`,
      ok: "正解（28）",
      ng: "はずれ",
      ngNum: (n: string) => `はずれ（${n} を取ってしまった）`,
      tally: (n: number) => `3 文中 ${n} 文で正解。`,
      note: "どのパターンを選んでも、全部の文では正解できません。言い回しを 1 つ変えるたびに、正規表現をつぎ足すことになります。この終わりのないモグラたたきが、次の発想へつながります。",
    },
    en: {
      title: "Can a regex pull out the temperature, 28?",
      goal: "Goal: pull the number 28 (the temperature) out of every sentence.",
      sentences: [
        "Tokyo tomorrow: up to 28C.",
        "On the 3rd, Tokyo goes up to 28C.",
        "Tomorrow, Tokyo's temperature is 28C.",
      ],
      patterns: [
        { label: "\\d+ (first number)", re: "\\d+" },
        { label: "up to \\d\\dC", re: "up to \\d\\dC" },
        { label: "temperature is \\d\\dC", re: "temperature is \\d\\dC" },
      ] as Pat[],
      pick: "Pick a regex:",
      none: "(no match)",
      got: (n: string) => `pulled out: ${n}`,
      ok: "correct (28)",
      ng: "wrong",
      ngNum: (n: string) => `wrong (grabbed ${n})`,
      tally: (n: number) => `${n} of 3 sentences correct.`,
      note: "Whichever pattern you pick, none gets every sentence right. Each new phrasing means bolting on another regex. This endless whack-a-mole is what leads to the next idea.",
    },
  }[lang];

  let sel = $state(-1);

  interface Seg {
    text: string;
    hit: boolean;
  }
  interface Row {
    segs: Seg[];
    matched: boolean;
    num: string;
    correct: boolean;
  }

  function analyze(sentence: string, reSrc: string): Row {
    const re = new RegExp(reSrc);
    const m = re.exec(sentence);
    if (!m) {
      return { segs: [{ text: sentence, hit: false }], matched: false, num: "", correct: false };
    }
    const start = m.index;
    const end = start + m[0].length;
    const numMatch = /\d+/.exec(m[0]);
    const num = numMatch ? numMatch[0] : "";
    return {
      segs: [
        { text: sentence.slice(0, start), hit: false },
        { text: sentence.slice(start, end), hit: true },
        { text: sentence.slice(end), hit: false },
      ].filter((s) => s.text.length > 0),
      matched: true,
      num,
      correct: num === "28",
    };
  }

  const rows = $derived(sel === -1 ? [] : T.sentences.map((s) => analyze(s, T.patterns[sel].re)));
  const score = $derived(rows.filter((r) => r.correct).length);
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>
  <p class="ll-status">{T.goal}</p>

  <div class="ll-controls">
    <span class="sb-label" style="flex:0 0 auto">{T.pick}</span>
    {#each T.patterns as p, i (p.re)}
      <button class="btn {i === sel ? 'btn--accent' : ''} je-mono" onclick={() => (sel = i)}
        >{p.label}</button
      >
    {/each}
  </div>

  {#if sel >= 0}
    <div class="rx-list">
      {#each T.sentences as sentence, i (sentence)}
        <div class="rx-row">
          <span class="rx-sentence"
            >{#each rows[i].segs as seg (seg.text)}<span class={seg.hit ? "rx-hit" : ""}
                >{seg.text}</span
              >{/each}</span
          >
          <span class="rx-verdict {rows[i].correct ? 'ok' : 'ng'}"
            >{rows[i].matched ? (rows[i].correct ? T.ok : T.ngNum(rows[i].num)) : T.none}</span
          >
        </div>
      {/each}
    </div>
    <p class="ll-status st-read">{T.tally(score)}</p>
    <p class="ll-status">{T.note}</p>
  {/if}
</div>
