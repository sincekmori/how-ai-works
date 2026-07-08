<script lang="ts">
  // Pick a request, then step through how an agent uses a skill shelf: scan the
  // spines (names + one-line descriptions only), open just the matching skill,
  // and follow its steps. A meter at the end compares how much text was read vs
  // handing over every playbook every time. Illustrative; in-memory only.
  const { lang = "ja" }: { lang?: "en" | "ja" } = $props();

  interface Skill {
    id: string;
    name: string;
    desc: string;
    steps: string[];
    out: string;
  }
  interface Task {
    label: string;
    skill: string;
  }

  const T = {
    ja: {
      title: "スキルの棚から、合う 1 冊だけ",
      skills: [
        {
          id: "trip",
          name: "旅のしおり",
          desc: "家族旅行のしおりを、うちの形で作る",
          steps: [
            "表紙に行き先と日付を大きく書く",
            "1 日ごとに予定を表にまとめる",
            "最後のページに持ち物リストを付ける",
          ],
          out: "完成：しおり「北海道 2 泊 3 日」（表紙 → 日程表 → 持ち物リスト）",
        },
        {
          id: "news",
          name: "学級新聞",
          desc: "クラスの新聞を決まったレイアウトで作る",
          steps: [
            "いちばん上に新聞名と発行日を置く",
            "左に大きな記事、右に小さな記事 2 本",
            "下の帯にクラスからのお知らせ",
          ],
          out: "完成：学級新聞 7 月号（大記事 1 本＋小記事 2 本＋お知らせ）",
        },
        {
          id: "receipt",
          name: "レシート精算",
          desc: "レシートを表にまとめて合計を出す",
          steps: [
            "日付・店名・金額を 1 行ずつ表にする",
            "金額を合計して最後の行に書く",
            "食費や交通費などの内訳を添える",
          ],
          out: "完成：精算表（3 行＋合計 2,460 円＋内訳）",
        },
      ] as Skill[],
      tasks: [
        { label: "旅のしおりを作って", skill: "trip" },
        { label: "学級新聞を作って", skill: "news" },
        { label: "レシートを精算して", skill: "receipt" },
      ] as Task[],
      next: "次の一歩",
      reset: "最初から",
      shelfWay: "棚のやり方",
      allWay: "ぜんぶ渡す",
      chars: (n: number) => `約 ${n} 字`,
      idle: "まず、上の依頼を 1 つえらんでください。",
      scanned: (n: number) =>
        `依頼を受けて、棚の背表紙をながめます。読むのは 3 冊ぶんの背表紙、約 ${n} 字だけです。`,
      opened: (name: string, n: number) =>
        `「${name}」が合いそうなので、その 1 冊だけ開いて手順（約 ${n} 字）を読みました。ほかの手順書は棚のままです。`,
      done: (read: number, all: number) =>
        `手順どおりに完成！今回読んだのは合計約 ${read} 字。手順書を毎回ぜんぶ渡していたら約 ${all} 字でした。手順書が増えるほど、この差は開きます。`,
    },
    en: {
      title: "Just the right book off the skill shelf",
      skills: [
        {
          id: "trip",
          name: "Trip booklet",
          desc: "make our family trip booklet, our way",
          steps: [
            "Write the place and dates big on the cover",
            "Put each day's plan in a table",
            "Add a packing list on the last page",
          ],
          out: 'Done: booklet "Hokkaido, 3 days" (cover → day tables → packing list)',
        },
        {
          id: "news",
          name: "Class newsletter",
          desc: "lay out the class newsletter the usual way",
          steps: [
            "Paper name and date across the top",
            "One big story left, two small ones right",
            "A notices strip along the bottom",
          ],
          out: "Done: July newsletter (1 big story + 2 small + notices)",
        },
        {
          id: "receipt",
          name: "Receipt filing",
          desc: "turn receipts into a table with totals",
          steps: [
            "One row per receipt: date, shop, amount",
            "Total the amounts on the last row",
            "Group them (food, transport, …)",
          ],
          out: "Done: expense table (3 rows + total ¥2,460 + groups)",
        },
      ] as Skill[],
      tasks: [
        { label: "Make a trip booklet", skill: "trip" },
        { label: "Make the newsletter", skill: "news" },
        { label: "File these receipts", skill: "receipt" },
      ] as Task[],
      next: "Next step",
      reset: "Restart",
      shelfWay: "the shelf way",
      allWay: "hand over all",
      chars: (n: number) => `≈ ${n} chars`,
      idle: "First, pick a request above.",
      scanned: (n: number) =>
        `The request is in. The agent scans the shelf — just the spines (names and one-liners), about ${n} characters in all.`,
      opened: (name: string, n: number) =>
        `"${name}" looks right, so it opens that one book only and reads its steps (about ${n} characters). The rest stay on the shelf.`,
      done: (read: number, all: number) =>
        `Done, by following the steps. Total read this time: about ${read} characters. Handing over every playbook would have been about ${all}. The more playbooks you keep, the wider this gap grows.`,
    },
  }[lang];

  let taskIdx = $state<number | null>(null);
  let pos = $state(0);

  const current = $derived(taskIdx === null ? null : T.tasks[taskIdx]);
  const matched = $derived(current ? (T.skills.find((s) => s.id === current.skill) ?? null) : null);

  const spineChars = T.skills.reduce((sum, s) => sum + s.name.length + s.desc.length, 0);
  const allChars = T.skills.reduce((sum, s) => sum + s.steps.join("").length, 0) + spineChars;
  const openChars = $derived(matched ? matched.steps.join("").length : 0);
  const readChars = $derived(spineChars + openChars);

  function pick(i: number) {
    taskIdx = i;
    pos = 1;
  }
  function next() {
    if (taskIdx !== null && pos < 3) {
      pos += 1;
    }
  }
  function reset() {
    taskIdx = null;
    pos = 0;
  }

  const status = $derived.by(() => {
    if (pos === 0 || !matched) {
      return T.idle;
    }
    if (pos === 1) {
      return T.scanned(spineChars);
    }
    if (pos === 2) {
      return T.opened(matched.name, openChars);
    }
    return T.done(readChars, allChars);
  });
</script>

<div class="widget">
  <p class="widget__title">{T.title}</p>

  <div class="ll-controls">
    {#each T.tasks as task, i (task.skill)}
      <button class="btn {taskIdx === i ? 'btn--accent' : ''}" onclick={() => pick(i)}
        >{task.label}</button
      >
    {/each}
  </div>
  <div class="ll-controls">
    <button class="btn btn--accent" onclick={next} disabled={taskIdx === null || pos >= 3}
      >{T.next}</button
    >
    <button class="btn" onclick={reset} disabled={taskIdx === null}>{T.reset}</button>
  </div>

  <div class="sk-shelf">
    {#each T.skills as s (s.id)}
      {@const open = pos >= 2 && matched?.id === s.id}
      <div
        class="sk-spine {pos === 1 ? 'is-scan' : ''} {open ? 'is-open' : ''} {pos >= 2 && !open
          ? 'is-idle'
          : ''}"
      >
        <span class="sk-name">{s.name}</span>
        <span class="sk-desc">{s.desc}</span>
        {#if open}
          <ul class="sk-steps">
            {#each s.steps as step (step)}
              <li>{step}</li>
            {/each}
          </ul>
        {/if}
      </div>
    {/each}
  </div>

  {#if pos >= 3 && matched}
    <div class="sk-out">{matched.out}</div>
    <div class="nw-row">
      <span class="nw-word">{T.shelfWay}</span>
      <div class="ll-bar-track">
        <div class="ll-bar-fill" style={`width:${(readChars / allChars) * 100}%`}></div>
      </div>
      <span class="nw-pct">{T.chars(readChars)}</span>
    </div>
    <div class="nw-row">
      <span class="nw-word">{T.allWay}</span>
      <div class="ll-bar-track">
        <div class="ll-bar-fill" style="width:100%; background:#ef4444"></div>
      </div>
      <span class="nw-pct">{T.chars(allChars)}</span>
    </div>
  {/if}

  <p class="ll-status">{status}</p>
</div>
