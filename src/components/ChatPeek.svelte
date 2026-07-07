<script lang="ts">
  // The chat screen everyone has seen, with the lid open: the reply is built ONE
  // word at a time, and each step shows the hand-set candidate shares (no real
  // model behind it). This demo always picks the top candidate; sampling is a
  // later chapter's topic. In-memory only; reload resets.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Step {
    cands: [string, number][];
    note?: string;
  }

  const T = {
    ja: {
      title: "チャットのふたを開ける：返事は 1 語ずつ作られる",
      user: "日本でいちばん高い山は？",
      steps: [
        {
          cands: [
            ["いちばん", 62],
            ["富士山", 21],
            ["それ", 9],
            ["日本", 8],
          ],
          note: "最初の 1 語からすでに迷っています。どの候補で始めても、文としてはあり得るからです。",
        },
        {
          cands: [
            ["高い", 88],
            ["大きい", 6],
            ["有名な", 4],
            ["低い", 2],
          ],
        },
        {
          cands: [
            ["山", 96],
            ["もの", 2],
            ["ところ", 2],
          ],
        },
        {
          cands: [
            ["は", 85],
            ["が", 9],
            ["と", 4],
            ["、", 2],
          ],
        },
        {
          cands: [
            ["富士山", 93],
            ["エベレスト", 4],
            ["北岳", 2],
            ["山", 1],
          ],
          note: "エベレストにも少しだけ割合が残っています。でも「日本で」と聞かれているので、富士山が圧倒的 1 位です。",
        },
        {
          cands: [
            ["です", 90],
            ["だ", 5],
            ["でしょう", 3],
            ["。", 2],
          ],
        },
        {
          cands: [
            ["。", 97],
            ["！", 2],
            ["？", 1],
          ],
        },
      ] as Step[],
      candLabel: "モデルの頭の中（「次の 1 語」の候補と割合）",
      pickTag: " 1 位",
      step: "1 語すすめる",
      play: "自動で最後まで",
      reset: "最初から",
      idle: "モデルはいま、返事の最初の 1 語を選ぼうとしています。「1 語すすめる」を押すと、いちばん割合の大きい候補が書き足されます。",
      mid: (w: string) =>
        `「${w}」を書き足しました。下の表は、もう「その次の 1 語」の候補に入れかわっています。`,
      done: "返事が完成！ 画面に見えるのはふつうの文ですが、その裏では 1 語ごとに「割合くらべ」が行われていました。",
    },
    en: {
      title: "Opening up the chat: the reply is built one word at a time",
      user: "What is the tallest mountain in Japan?",
      steps: [
        {
          cands: [
            ["The", 58],
            ["It", 24],
            ["Mount Fuji", 12],
            ["Japan", 6],
          ],
          note: "It is hesitating from the very first word — several openings could work as a sentence.",
        },
        {
          cands: [
            ["tallest", 84],
            ["highest", 12],
            ["biggest", 3],
            ["best", 1],
          ],
        },
        {
          cands: [
            ["mountain", 95],
            ["peak", 3],
            ["one", 2],
          ],
        },
        {
          cands: [
            ["is", 88],
            ["in", 8],
            ["of", 3],
            ["was", 1],
          ],
        },
        {
          cands: [
            ["Mount Fuji", 91],
            ["Everest", 5],
            ["Mount Kita", 2],
            ["Tokyo", 2],
          ],
          note: 'Everest still gets a small share — but the question said "in Japan", so Mount Fuji is the clear favorite.',
        },
        {
          cands: [
            [".", 96],
            ["!", 2],
            [",", 2],
          ],
        },
      ] as Step[],
      candLabel: "Inside the model's head — candidates for the next word, with shares",
      pickTag: " top",
      step: "Add one word",
      play: "Auto-complete",
      reset: "Restart",
      idle: 'The model is about to choose the first word of its reply. Press "Add one word" and it writes down the candidate with the biggest share.',
      mid: (w: string) =>
        `Added "${w}". The table below has already switched to the candidates for the word after it.`,
      done: "The reply is finished! It looks like an ordinary sentence — but behind every single word there was a share contest.",
    },
  }[lang];

  const last = T.steps.length;

  let pos = $state(0);
  let running = $state(false);

  const sleep = (ms: number) =>
    new Promise((r) => {
      setTimeout(r, ms);
    });

  const picked = $derived(T.steps.slice(0, pos).map((s) => s.cands[0][0]));
  const joinEn = (ws: string[]) => ws.join(" ").replaceAll(/ (?<punct>[.,!?])/g, "$<punct>");
  const head = $derived(lang === "ja" ? picked.slice(0, -1).join("") : joinEn(picked.slice(0, -1)));
  const lastWord = $derived(pos > 0 ? (picked.at(-1) ?? "") : "");
  const sep = $derived(lang === "ja" || head === "" || /^[.,!?]/.test(lastWord) ? "" : " ");

  const doneAll = $derived(pos >= last);

  function step() {
    if (running || pos >= last) {
      return;
    }
    pos += 1;
  }

  async function play() {
    if (running) {
      return;
    }
    running = true;
    if (pos >= last) {
      pos = 0;
    }
    while (pos < last) {
      pos += 1;
      // eslint-disable-next-line no-await-in-loop -- sequential by design: paces the animation
      await sleep(900);
    }
    running = false;
  }

  function reset() {
    if (running) {
      return;
    }
    pos = 0;
  }

  const status = $derived(doneAll ? T.done : pos === 0 ? T.idle : T.mid(lastWord));
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="cp-chat">
    <div class="cp-msg user"><div class="cp-bubble">{T.user}</div></div>
    <div class="cp-msg ai">
      <div class="cp-bubble">
        {#if pos > 0}<span>{head}{sep}</span><span class="cp-last">{lastWord}</span
          >{/if}{#if !doneAll}<span class="cp-caret">▍</span>{/if}
      </div>
    </div>
  </div>

  <div class="ll-controls">
    <button class="btn btn--accent" onclick={step} disabled={running || doneAll}>{T.step}</button>
    <button class="btn" onclick={play} disabled={running}>{T.play}</button>
    <button class="btn" onclick={reset} disabled={running}>{T.reset}</button>
  </div>
  <p class="ll-status">{status}</p>

  {#if !doneAll}
    <p class="ll-errlabel">{T.candLabel}</p>
    {#each T.steps[pos].cands as [w, p], i (w)}
      <div class="nw-row {i === 0 ? 'correct' : ''}">
        <span class="nw-word"
          >{w}{#if i === 0}<span class="nw-tag">{T.pickTag}</span>{/if}</span
        >
        <div class="ll-bar-track"><div class="ll-bar-fill" style={`width:${p}%`}></div></div>
        <span class="nw-pct">{p}%</span>
      </div>
    {/each}
    {#if T.steps[pos].note}
      <p class="ll-status cp-note">{T.steps[pos].note}</p>
    {/if}
  {/if}
</div>
