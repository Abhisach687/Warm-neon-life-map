(function () {
  const DATA = window.BEING_DATA;
  const STORAGE_KEY = "being-command-board-state-v1";
  const SESSION_KEY = "being-command-board-session-v1";
  const views = ["play", "archive", "map", "progress", "sources"];
  const queryView = new URLSearchParams(window.location.search).get("view");

  const $ = (id) => document.getElementById(id);
  const levelTitles = ["Signal Scout", "Neon Walker", "Route Keeper", "Archive Builder", "Story Pilot", "Pattern Reader"];
  const byId = Object.fromEntries(DATA.quests.map((quest) => [quest.id, quest]));
  const chainById = Object.fromEntries(DATA.chains.map((chain) => [chain.id, chain]));
  const chapterById = Object.fromEntries(DATA.chapters.map((chapter) => [chapter.id, chapter]));
  const sourcesById = Object.fromEntries(DATA.sources.map((source) => [source.id, source]));

  const defaultState = () => ({
    theme: document.body.dataset.theme || "dark",
    view: "play",
    filters: {
      search: "",
      program: "all",
      status: "all"
    },
    sessionPrepNote: "",
    dailyLogs: [],
    weeklyReviews: [],
    questResponses: {},
    questEntries: {},
    reportState: null,
    notes: {},
    campaign: {
      openingChapter: "ignite",
      activeChapter: "ignite",
      activeChainId: null,
      currentQuestId: null,
      completedQuestIds: [],
      completedChainIds: [],
      unlockedChainIds: [],
      upcomingLockedChainIds: [],
      laneRecommendation: "success",
      recommendedIntensity: "steady",
      stabilizationFlag: false,
      initialized: false,
      timeline: []
    },
    diagnostics: [],
    rewards: {
      xp: 0,
      level: 1,
      longestStreak: 0,
      artifacts: [],
      memories: [],
      badges: []
    }
  });

  let state = loadState();
  let session = loadSession();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultState();
      }
      return mergeState(defaultState(), JSON.parse(raw));
    } catch {
      return defaultState();
    }
  }

  function loadSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : { activeQuestId: null, lastView: "play" };
    } catch {
      return { activeQuestId: null, lastView: "play" };
    }
  }

  function mergeState(base, incoming) {
    return {
      ...base,
      ...incoming,
      filters: { ...base.filters, ...(incoming.filters || {}) },
      sessionPrepNote: incoming.sessionPrepNote || base.sessionPrepNote,
      dailyLogs: incoming.dailyLogs || base.dailyLogs,
      weeklyReviews: incoming.weeklyReviews || base.weeklyReviews,
      questResponses: incoming.questResponses || base.questResponses,
      questEntries: incoming.questEntries || base.questEntries,
      reportState: incoming.reportState || base.reportState,
      notes: { ...base.notes, ...(incoming.notes || {}) },
      campaign: { ...base.campaign, ...(incoming.campaign || {}) },
      rewards: { ...base.rewards, ...(incoming.rewards || {}) }
    };
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveSession() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function isoToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function questStatus(questId) {
    if (state.campaign.completedQuestIds.includes(questId)) {
      return "complete";
    }
    if (state.campaign.currentQuestId === questId) {
      return "current";
    }
    const quest = byId[questId];
    if (state.campaign.unlockedChainIds.includes(quest.chain)) {
      return "unlocked";
    }
    return "locked";
  }

  function levelForXp(xp) {
    return Math.max(1, Math.floor(xp / 120) + 1);
  }

  function xpIntoLevel(xp) {
    return xp % 120;
  }

  function getLatestDiagnostic() {
    return state.diagnostics[state.diagnostics.length - 1] || null;
  }

  function getLatestDailyLog() {
    return state.dailyLogs[state.dailyLogs.length - 1] || null;
  }

  function getLatestWeeklyReview() {
    return state.weeklyReviews[state.weeklyReviews.length - 1] || null;
  }

  function averageOfLogs(key, count = 7) {
    const logs = state.dailyLogs.slice(-count).filter((item) => typeof item[key] === "number");
    if (!logs.length) {
      return null;
    }
    return logs.reduce((sum, item) => sum + item[key], 0) / logs.length;
  }

  function medicationSummary(count = 7) {
    const logs = state.dailyLogs.slice(-count);
    if (!logs.length) {
      return "No recent medication log yet.";
    }
    const yes = logs.filter((item) => item.medication === "yes").length;
    const partial = logs.filter((item) => item.medication === "partial").length;
    const no = logs.filter((item) => item.medication === "no").length;
    return `${yes} full, ${partial} partial, ${no} missed in the last ${logs.length} daily logs.`;
  }

  function sideEffectSummary(count = 7) {
    const logs = state.dailyLogs.slice(-count).filter((item) => item.sideEffects && item.sideEffects !== "none");
    if (!logs.length) {
      return "No recent side effects logged.";
    }
    const highest = logs.some((item) => item.sideEffects === "strong")
      ? "strong"
      : logs.some((item) => item.sideEffects === "moderate")
        ? "moderate"
        : "mild";
    return `Side effects were logged ${logs.length} time(s) recently, with the highest level marked as ${highest}.`;
  }

  function questHelpfulnessSummary() {
    const responses = Object.values(state.questResponses);
    if (!responses.length) {
      return null;
    }
    const helped = responses.filter((item) => item.helped === "yes").length;
    const notHelped = responses.filter((item) => item.helped === "no").length;
    const hard = responses.filter((item) => Number(item.difficulty || 0) >= 4).length;
    if (helped > notHelped) {
      return "Recent quest responses suggest structured action cards are helping more often than not.";
    }
    if (hard > helped) {
      return "Recent quest responses suggest the current quest style may feel demanding and may need gentler pacing.";
    }
    return "Recent quest responses are mixed, so the app should keep adapting rather than overcommitting.";
  }

  function questEntrySummary() {
    const entries = Object.values(state.questEntries);
    if (!entries.length) {
      return null;
    }
    const lowConfidence = entries.filter((item) => Number(item.confidence || 0) <= 2).length;
    const highDifficulty = entries.filter((item) => Number(item.difficulty || 0) >= 4).length;
    const helped = entries.filter((item) => item.helped === "yes").length;
    if (helped > highDifficulty) {
      return "Structured quest answers suggest the guided exercises are helping more than they are stalling you.";
    }
    if (highDifficulty > helped || lowConfidence > 1) {
      return "Structured quest answers suggest lower confidence or higher difficulty is building up, so gentler pacing may help.";
    }
    return "Quest answer patterns are still forming.";
  }

  function preferredSuccessDomain() {
    const valuesEntries = Object.values(state.questEntries).filter((item) => item.template === "triple_reflection" && item.priority);
    if (!valuesEntries.length) {
      return null;
    }
    const counts = {};
    valuesEntries.forEach((item) => {
      counts[item.priority] = (counts[item.priority] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  function routeRecommendationSummary() {
    const latest = getLatestDiagnostic();
    const moodAvg = averageOfLogs("mood");
    const energyAvg = averageOfLogs("energy");
    if (latest && latest.stabilizationFlag) {
      return "Recent signals suggest a stabilization-forward route is safer right now.";
    }
    if (moodAvg !== null && energyAvg !== null && moodAvg >= 3.5 && energyAvg >= 3.5) {
      return "Recent daily logs suggest you may be able to keep a steady or deeper pace.";
    }
    return "The app should keep a steady, supportive route and adjust using new logs.";
  }

  function getRecentDiagnostics(limit = 3) {
    return state.diagnostics.slice(-limit);
  }

  function getWho5TrendSummary() {
    const recent = getRecentDiagnostics(3);
    if (recent.length < 2) {
      return null;
    }
    const first = recent[0].who5Score;
    const last = recent[recent.length - 1].who5Score;
    const delta = last - first;
    if (recent.every((item) => item.who5Score < 44)) {
      return {
        label: "repeatedly low",
        detail: "The last few WHO-5 signals have stayed low, which may be worth discussing as an ongoing pattern."
      };
    }
    if (delta >= 8) {
      return {
        label: "improving",
        detail: `The WHO-5 trend has improved by about ${delta} points across recent scans.`
      };
    }
    if (delta <= -8) {
      return {
        label: "dropping",
        detail: `The WHO-5 trend has dropped by about ${Math.abs(delta)} points across recent scans.`
      };
    }
    return {
      label: "steady",
      detail: "The recent WHO-5 pattern looks fairly steady rather than sharply changing."
    };
  }

  function getCurrentStreak() {
    const days = Array.from(new Set(state.campaign.timeline.map((item) => item.date))).sort();
    if (!days.length) {
      return 0;
    }
    let streak = 0;
    let cursor = new Date();
    while (true) {
      const iso = cursor.toISOString().slice(0, 10);
      if (days.includes(iso)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
    return streak;
  }

  function chapterProgressPercent() {
    const activeChainId = state.campaign.activeChainId;
    if (!activeChainId) {
      return 100;
    }
    const questList = questsForChain(activeChainId);
    const done = questList.filter((quest) => state.campaign.completedQuestIds.includes(quest.id)).length;
    return ((done + 1) / Math.max(questList.length, 1)) * 100;
  }

  function buildReportState() {
    const latestDiagnostic = getLatestDiagnostic();
    const latestDaily = getLatestDailyLog();
    const latestWeekly = getLatestWeeklyReview();
    const trend = getWho5TrendSummary();
    const moodAvg = averageOfLogs("mood");
    const sleepAvg = averageOfLogs("sleep");
    const energyAvg = averageOfLogs("energy");
    const focusAvg = averageOfLogs("focus");
    const stressAvg = averageOfLogs("stress");
    const questSummary = questHelpfulnessSummary();
    const questEntryTrend = questEntrySummary();
    const preferredDomain = preferredSuccessDomain();

    return {
      updatedAt: isoToday(),
      overview: [
        ["WHO-5", latestDiagnostic ? `${latestDiagnostic.who5Score}/100` : "Not yet"],
        ["Mood avg", moodAvg !== null ? moodAvg.toFixed(1) : "No data"],
        ["Energy avg", energyAvg !== null ? energyAvg.toFixed(1) : "No data"],
        ["Best streak", `${state.rewards.longestStreak} days`]
      ],
      trends: [
        trend ? trend.detail : "Not enough WHO-5 data yet for a trend.",
        sleepAvg !== null && energyAvg !== null
          ? `Recent sleep and energy averages are ${sleepAvg.toFixed(1)} and ${energyAvg.toFixed(1)} out of 5.`
          : "Not enough daily sleep/energy logs yet.",
        stressAvg !== null && moodAvg !== null
          ? `Recent mood and stress averages are ${moodAvg.toFixed(1)} and ${stressAvg.toFixed(1)} out of 5.`
          : "Not enough mood/stress logs yet.",
        medicationSummary(),
        sideEffectSummary(),
        questSummary || "No quest response trend yet.",
        questEntryTrend || "No quest-answer trend yet."
      ],
      points: [
        routeRecommendationSummary(),
        preferredDomain ? `My repeated success priority seems to be ${preferredDomain}.` : "No clear repeated success priority yet.",
        latestWeekly && latestWeekly.topics ? `Topics I said matter this week: ${latestWeekly.topics}` : "No weekly topics entered yet.",
        latestWeekly && latestWeekly.ask ? `What I want to ask in session: ${latestWeekly.ask}` : "No session question entered yet.",
        latestDaily && latestDaily.safety !== "safe"
          ? `Recent safety check suggests I may need more support: ${latestDaily.safety}.`
          : "Recent safety check-ins do not show an urgent flag.",
        currentQuest()
          ? `Current guided action: ${currentQuest().title}.`
          : "Current campaign arc is complete.",
        latestDaily && latestDaily.note ? `Recent daily note: ${latestDaily.note}` : "No recent daily note saved."
      ]
    };
  }

  function buildCampaignPath(diag) {
    const lane = diag ? diag.laneRecommendation : "success";
    const opening = diag ? diag.recommendedOpening : "ignite";
    const primaryIgnite = `ignite-${lane}`;
    const path = [];

    if (opening === "stabilize") {
      path.push("stabilize-system");
      path.push(primaryIgnite);
    } else {
      path.push(primaryIgnite);
      path.push("stabilize-system");
    }

    ["momentum-behavior", "identity-success", "meaning-relationships", "sustain-reroute"].forEach((id) => {
      if (!path.includes(id)) {
        path.push(id);
      }
    });

    return path;
  }

  function initializeCampaign(diag) {
    const path = buildCampaignPath(diag);
    const firstChainId = path[0];
    const firstQuest = questsForChain(firstChainId)[0];
    state.campaign.initialized = true;
    state.campaign.openingChapter = diag ? diag.recommendedOpening : "ignite";
    state.campaign.activeChapter = chainById[firstChainId].chapter;
    state.campaign.activeChainId = firstChainId;
    state.campaign.currentQuestId = firstQuest.id;
    state.campaign.unlockedChainIds = [firstChainId];
    state.campaign.upcomingLockedChainIds = path.slice(1);
    state.campaign.laneRecommendation = diag ? diag.laneRecommendation : "success";
    state.campaign.recommendedIntensity = diag ? diag.recommendedIntensity : "steady";
    state.campaign.stabilizationFlag = diag ? diag.stabilizationFlag : false;
    state.campaign.timeline = state.campaign.timeline.length
      ? state.campaign.timeline
      : [{
          type: "campaign-start",
          date: isoToday(),
          title: openingTitle(diag),
          detail: "The command board sets your first guided chain."
        }];
  }

  function openingTitle(diag) {
    if (diag && diag.recommendedOpening === "stabilize") {
      return "Origin scan selected stabilization";
    }
    return "Origin scan selected ignition";
  }

  function questsForChain(chainId) {
    return DATA.quests
      .filter((quest) => quest.chain === chainId)
      .sort((a, b) => a.order - b.order);
  }

  function buildDiagnosticResult(entries, note) {
    const who5Ids = DATA.diagnosticSurvey
      .filter((item) => item.group === "WHO-5 core")
      .map((item) => item.id);
    const who5Raw = who5Ids.reduce((sum, id) => sum + Number(entries[id] || 0), 0);
    const who5Score = who5Raw * 4;
    const routeGrowth = Number(entries.route_growth || 0);
    const routePlans = Number(entries.route_plans || 0);
    const routeEnvironment = Number(entries.route_environment || 0);
    const routeConnection = Number(entries.route_connection || 0);
    const routeRestoration = Number(entries.route_restoration || 0);

    const laneScores = {
      success: (5 - routeGrowth) * 2 + (5 - Number(entries.who5_interest || 0)),
      behavior: (5 - routePlans) * 2 + (5 - routeEnvironment) * 2,
      wellbeing: (5 - routeConnection) * 1.5 + (5 - routeRestoration) * 2 + Math.max(0, (50 - who5Score) / 10)
    };

    const laneRecommendation = Object.entries(laneScores)
      .sort((a, b) => b[1] - a[1])[0][0];

    const stabilizationFlag = who5Score < 44 || routeRestoration <= 1 || (routeRestoration <= 2 && who5Score < 52);
    const recommendedOpening = stabilizationFlag ? "stabilize" : "ignite";
    let recommendedIntensity = "steady";
    if (who5Score < 36 || routePlans <= 1 || routeRestoration <= 1) {
      recommendedIntensity = "gentle";
    } else if (who5Score >= 64 && routePlans >= 3 && routeGrowth >= 3) {
      recommendedIntensity = "deeper";
    }

    return {
      date: isoToday(),
      note,
      entries,
      who5Score,
      laneRecommendation,
      recommendedOpening,
      recommendedIntensity,
      stabilizationFlag
    };
  }

  function ensureCampaign() {
    if (!state.campaign.initialized) {
      initializeCampaign(getLatestDiagnostic());
    }
  }

  function currentQuest() {
    ensureCampaign();
    return byId[state.campaign.currentQuestId];
  }

  function currentChain() {
    ensureCampaign();
    return chainById[state.campaign.activeChainId];
  }

  function currentPath() {
    ensureCampaign();
    return [state.campaign.activeChainId].concat(state.campaign.upcomingLockedChainIds);
  }

  function completeQuest(questId) {
    const quest = byId[questId];
    if (!quest || state.campaign.currentQuestId !== questId) {
      return;
    }
    if (!state.campaign.completedQuestIds.includes(questId)) {
      state.campaign.completedQuestIds.push(questId);
      state.rewards.xp += quest.rewardPayload.xp || 0;
      state.rewards.level = levelForXp(state.rewards.xp);
      state.rewards.longestStreak = Math.max(state.rewards.longestStreak, getCurrentStreak());
      if (quest.rewardPayload.memory) {
        state.rewards.memories.unshift({
          title: quest.title,
          text: quest.rewardPayload.memory,
          date: isoToday()
        });
      }
      state.campaign.timeline.unshift({
        type: "quest",
        date: isoToday(),
        title: quest.title,
        detail: `${quest.focus} quest completed in ${chapterById[quest.chapter].title}.`
      });
    }

    const chainQuests = questsForChain(quest.chain);
    const nextQuestInChain = chainQuests.find((item) => !state.campaign.completedQuestIds.includes(item.id));

    if (nextQuestInChain) {
      state.campaign.currentQuestId = nextQuestInChain.id;
      session.activeQuestId = nextQuestInChain.id;
      saveSession();
      unlockFromHistory();
      saveState();
      toast("Quest logged. The next step is ready.");
      render();
      return;
    }

    completeChain(quest.chain);
  }

  function completeChain(chainId) {
    if (!state.campaign.completedChainIds.includes(chainId)) {
      state.campaign.completedChainIds.push(chainId);
    }
    const chain = chainById[chainId];
    if (chain.artifact && !state.rewards.artifacts.some((item) => item.name === chain.artifact)) {
      state.rewards.artifacts.unshift({ name: chain.artifact, chain: chain.title, date: isoToday() });
    }
    if (chain.badge && !state.rewards.badges.includes(chain.badge)) {
      state.rewards.badges.unshift(chain.badge);
    }
    if (chain.memory) {
      state.rewards.memories.unshift({ title: chain.title, text: chain.memory, date: isoToday() });
    }
    state.campaign.timeline.unshift({
      type: "chain",
      date: isoToday(),
      title: `${chain.title} complete`,
      detail: `Artifact unlocked: ${chain.artifact}.`
    });

    const remaining = state.campaign.upcomingLockedChainIds.slice();
    const nextChainId = remaining.shift() || null;
    if (nextChainId) {
      state.campaign.activeChainId = nextChainId;
      state.campaign.activeChapter = chainById[nextChainId].chapter;
      state.campaign.currentQuestId = questsForChain(nextChainId)[0].id;
      state.campaign.unlockedChainIds.push(nextChainId);
      state.campaign.upcomingLockedChainIds = remaining;
    } else {
      state.campaign.currentQuestId = null;
      state.campaign.upcomingLockedChainIds = [];
    }
    session.activeQuestId = state.campaign.currentQuestId;
    saveSession();
    unlockFromHistory();
    saveState();
    toast(nextChainId ? "Chain complete. A new arc has unlocked." : "Campaign arc complete. You can now re-route.");
    render();
  }

  function unlockFromHistory() {
    if (state.campaign.activeChainId && !state.campaign.unlockedChainIds.includes(state.campaign.activeChainId)) {
      state.campaign.unlockedChainIds.push(state.campaign.activeChainId);
    }
  }

  function companionCopy() {
    const diag = getLatestDiagnostic();
    const quest = currentQuest();
    const chain = currentChain();
    const laneLabel = DATA.programs[state.campaign.laneRecommendation].name;
    const trend = getWho5TrendSummary();
    const intensityText = {
      gentle: "Keep the pace gentle. Recovery counts as progress here.",
      steady: "A steady rhythm is enough. You do not need dramatic momentum.",
      deeper: "Your recent signals can support a deeper stretch, but still one step at a time."
    }[state.campaign.recommendedIntensity];

    let routeText = `The board is currently routing you through ${chain.title}, shaped mostly by ${laneLabel}.`;
    if (diag) {
      routeText = `Your latest scan pointed most strongly toward ${laneLabel}, so the board recommends ${quest.title} as the next useful move.`;
    }
    if (state.campaign.stabilizationFlag) {
      routeText += " The system also noticed a restoration need, so it is protecting you from an overly intense route.";
    }
    if (trend) {
      routeText += ` Your recent well-being trend looks ${trend.label}.`;
    }
    return `${routeText} ${intensityText}`;
  }

  function renderHero() {
    ensureCampaign();
    const title = levelTitles[Math.min(state.rewards.level - 1, levelTitles.length - 1)];
    $("top-player-chip").innerHTML = `<strong>${title}</strong><span>Level ${state.rewards.level} | ${state.campaign.completedQuestIds.length} quests logged</span>`;
    $("hero-level").textContent = `Lv ${state.rewards.level}`;
    $("xp-caption").textContent = `${state.rewards.xp} XP banked`;
    $("xp-next").textContent = `Next level in ${120 - xpIntoLevel(state.rewards.xp)} XP`;
    $("xp-fill").style.width = `${(xpIntoLevel(state.rewards.xp) / 120) * 100}%`;
    $("hero-highlights").innerHTML = [
      `<span class="pill">Opening: ${chapterById[state.campaign.openingChapter].title}</span>`,
      `<span class="pill">Lane: ${DATA.programs[state.campaign.laneRecommendation].label}</span>`,
      `<span class="pill">Intensity: ${state.campaign.recommendedIntensity}</span>`,
      `<span class="pill">Streak: ${getCurrentStreak()} day${getCurrentStreak() === 1 ? "" : "s"}</span>`
    ].join("");
  }

  function renderTopStats() {
    const latest = getLatestDiagnostic();
    const stats = [
      ["Quest streak", `${getCurrentStreak()} days`],
      ["Next reward", currentChain().artifact],
      ["WHO-5 signal", latest ? `${latest.who5Score}/100` : "Not scanned yet"],
      ["Artifacts", String(state.rewards.artifacts.length)]
    ];
    $("top-stats").innerHTML = stats.map(([label, value]) => `
      <article class="stat-card">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </article>
    `).join("");
  }

  function renderCampaignState() {
    $("campaign-status-badge").textContent = state.campaign.stabilizationFlag ? "stabilize gently" : "guided route";
    $("chapter-progress-fill").style.width = `${Math.min(chapterProgressPercent(), 100)}%`;
    $("active-chapter-strip").innerHTML = DATA.chapters.map((chapter) => {
      const active = chapter.id === state.campaign.activeChapter;
      const done = state.campaign.completedChainIds.some((chainId) => chainById[chainId].chapter === chapter.id);
      return `<div class="chapter-chip ${active ? "is-active" : ""} ${done ? "is-complete" : ""}">
        <span>${chapter.order}</span>
        <strong>${chapter.title}</strong>
      </div>`;
    }).join("");

    const quest = currentQuest();
    if (!quest) {
      $("current-quest-card").innerHTML = `<article class="command-card"><p class="muted">The current campaign is complete. Run a fresh scan to begin the next season.</p></article>`;
      return;
    }

    $("current-quest-card").innerHTML = `
      <article class="command-card">
        <div class="command-card__header">
          <div class="stack-tight">
            <div class="pill-row">
              <span class="pill">${DATA.programs[quest.lane].school}</span>
              <span class="pill">${chapterById[quest.chapter].title}</span>
              <span class="pill">${quest.duration} min</span>
            </div>
            <h4>${quest.title}</h4>
          </div>
        </div>
        <div class="command-card__summary">
          <p>${quest.summary}</p>
          <p class="muted">${quest.why}</p>
        </div>
        <div class="command-card__meta">
          <span class="meta-pill">${quest.focus}</span>
          <span class="meta-pill">${quest.sourceBasis}</span>
          <span class="meta-pill">${quest.evidenceTag}</span>
        </div>
        <div class="command-card__actions">
          <button class="primary-button" type="button" data-open-quest="${quest.id}">Open quest workspace</button>
          <button class="secondary-button" type="button" data-open-quest="${quest.id}">Answer prompts inside app</button>
        </div>
      </article>
    `;
  }

  function renderMissionBrief() {
    const quest = currentQuest();
    const chain = currentChain();
    const latest = getLatestDiagnostic();
    const streak = getCurrentStreak();
    $("mission-urgency").textContent = latest ? `${state.campaign.recommendedIntensity} pace` : "origin scan";
    $("mission-brief").innerHTML = quest ? `
      <article class="mission-step mission-step--primary">
        <span class="eyebrow">Do this next</span>
        <h4>${quest.title}</h4>
        <p>${quest.summary}</p>
      </article>
      <article class="mission-step">
        <span class="eyebrow">Why now</span>
        <p>${latest
          ? `Your latest scan pointed toward ${DATA.programs[state.campaign.laneRecommendation].name}, so this quest is the cleanest next move.`
          : `This is the opening step in ${chain.title}, the first guided chain in your campaign.`}</p>
      </article>
      <article class="mission-step">
        <span class="eyebrow">Reward on deck</span>
        <p>Finish this chain to unlock <strong>${chain.artifact}</strong> and the <strong>${chain.badge}</strong> badge.</p>
      </article>
      <article class="mission-step">
        <span class="eyebrow">Momentum signal</span>
        <p>${streak > 0 ? `You have a ${streak}-day signal streak. Keep the route alive with one meaningful step.` : `Start a signal streak by finishing one quest today.`}</p>
      </article>
    ` : `<p class="muted">The current campaign arc is complete. Run a new scan to set the next season.</p>`;
  }

  function renderDiagnostic() {
    const latest = getLatestDiagnostic();
    $("diagnostic-status").textContent = latest ? `Last scan ${latest.date}` : "Origin scan needed";
    $("diagnostic-summary").textContent = latest
      ? `Lane recommended: ${DATA.programs[latest.laneRecommendation].name}. Opening: ${chapterById[latest.recommendedOpening].title}. Pace: ${latest.recommendedIntensity}.`
      : "Run the origin scan to choose the best opening chapter. Low restoration can move you into stabilization earlier.";
    $("diagnostic-snapshot").innerHTML = latest
      ? `
        <div class="stat-chip"><span>WHO-5</span><strong>${latest.who5Score}/100</strong></div>
        <div class="stat-chip"><span>Lane</span><strong>${DATA.programs[latest.laneRecommendation].label}</strong></div>
        <div class="stat-chip"><span>Opening</span><strong>${chapterById[latest.recommendedOpening].title}</strong></div>
        <div class="stat-chip"><span>Intensity</span><strong>${latest.recommendedIntensity}</strong></div>
      `
      : "";

    $("diagnostic-questions").innerHTML = DATA.diagnosticSurvey.map((item) => `
      <article class="diagnostic-card">
        <h4>${item.prompt}</h4>
        <p class="muted">${item.help}</p>
        <div class="likert-grid">
          ${DATA.diagnosticOptions.map((option) => `
            <label class="likert-option">
              <input type="radio" name="${item.id}" value="${option.value}" ${latest && String(latest.entries[item.id]) === String(option.value) ? "checked" : ""} />
              <span>${option.label}</span>
            </label>
          `).join("")}
        </div>
      </article>
    `).join("");
    $("diagnostic-note").value = latest ? latest.note || "" : "";
  }

  function renderCompanion() {
    $("companion-tone").textContent = state.campaign.recommendedIntensity;
    $("companion-panel").innerHTML = `
      <article class="companion-card">
        <p class="companion-copy">${companionCopy()}</p>
        <p class="muted">The archivist favors one clear step over ten noisy options. Your route stays linear, but the weekly scan can soften or rebalance what comes next.</p>
      </article>
    `;
  }

  function renderUpcoming() {
    $("upcoming-chain-preview").innerHTML = state.campaign.upcomingLockedChainIds.slice(0, 3).map((chainId) => {
      const chain = chainById[chainId];
      return `<article class="stack-card stack-card--locked">
        <div class="stack-tight">
          <span class="badge">Locked</span>
          <h4>${chain.title}</h4>
          <p class="muted">${chapterById[chain.chapter].summary}</p>
        </div>
      </article>`;
    }).join("") || `<p class="muted">No locked chains remain. The next season can be routed from your newest scan.</p>`;
  }

  function renderNodeMap() {
    const markup = currentPath().map((chainId, index) => {
      const chain = chainById[chainId];
      const classes = [
        "node-card",
        chainId === state.campaign.activeChainId ? "is-active" : "",
        state.campaign.completedChainIds.includes(chainId) ? "is-complete" : "",
        state.campaign.upcomingLockedChainIds.includes(chainId) ? "is-locked" : ""
      ].filter(Boolean).join(" ");
      return `<article class="${classes}">
        <span class="node-index">${index + 1}</span>
        <strong>${chain.title}</strong>
        <span>${chapterById[chain.chapter].title}</span>
      </article>`;
    }).join("");
    $("node-map-preview").innerHTML = markup;
    $("full-node-map").innerHTML = markup;
  }

  function renderTimeline() {
    const items = state.campaign.timeline.slice(0, 10);
    const html = items.map((item) => `
      <article class="timeline-item">
        <span class="timeline-date">${item.date}</span>
        <h4>${item.title}</h4>
        <p class="muted">${item.detail}</p>
      </article>
    `).join("");
    $("timeline-preview").innerHTML = html || `<p class="muted">Complete a quest to begin the visible story timeline.</p>`;
    $("full-timeline").innerHTML = html || `<p class="muted">No timeline events yet.</p>`;
  }

  function renderRewards() {
    const rewardCards = [];
    state.rewards.artifacts.slice(0, 3).forEach((artifact) => {
      rewardCards.push(`<article class="reward-card"><span class="eyebrow">Artifact</span><h4>${artifact.name}</h4><p class="muted">${artifact.chain}</p></article>`);
    });
    state.rewards.memories.slice(0, 3).forEach((memory) => {
      rewardCards.push(`<article class="reward-card"><span class="eyebrow">Memory</span><h4>${memory.title}</h4><p class="muted">${memory.text}</p></article>`);
    });
    $("reward-preview").innerHTML = rewardCards.join("") || `<p class="muted">Artifacts and memories unlock at chain milestones.</p>`;
  }

  function renderArchive() {
    const search = state.filters.search.trim().toLowerCase();
    $("search-input").value = state.filters.search;
    const current = currentQuest();
    const results = DATA.quests.filter((quest) => {
      const text = [
        quest.title,
        quest.summary,
        quest.focus,
        quest.lane,
        quest.chapter,
        DATA.programs[quest.lane].school,
        DATA.programs[quest.lane].name
      ].join(" ").toLowerCase();
      const programMatch = state.filters.program === "all" || quest.lane === state.filters.program;
      const statusMatch = state.filters.status === "all" || questStatus(quest.id) === state.filters.status;
      const searchMatch = !search || text.includes(search);
      return programMatch && statusMatch && searchMatch;
    });

    const unlockedCount = DATA.quests.filter((quest) => questStatus(quest.id) === "unlocked" || questStatus(quest.id) === "current").length;
    $("archive-summary").textContent = current
      ? `${results.length} quests visible. Right now the app wants you to focus on "${current.title}". ${unlockedCount} quests are currently open or current, and the rest stay visible for transparency.`
      : `${results.length} quests visible. The archive shows the whole system, but the campaign still recommends one step at a time.`;
    $("library-results").innerHTML = results.map((quest) => {
      const status = questStatus(quest.id);
      return `
        <article class="exercise-card archive-card archive-card--${status}">
          <div class="exercise-card__header">
            <div class="stack-tight">
              <span class="eyebrow">${DATA.programs[quest.lane].school}</span>
              <h4>${quest.title}</h4>
            </div>
          </div>
          <div class="exercise-card__summary">
            <p>${quest.summary}</p>
          </div>
          <div class="exercise-card__meta">
            <span class="meta-pill">${chapterById[quest.chapter].title}</span>
            <span class="meta-pill">${quest.focus}</span>
            <span class="meta-pill">${quest.duration} min</span>
            <span class="meta-pill archive-state-pill">${status}</span>
          </div>
          <div class="exercise-card__actions">
            <button class="secondary-button" type="button" data-open-quest="${quest.id}">Open</button>
            ${status === "current" ? `<button class="primary-button" type="button" data-complete-quest="${quest.id}">Complete</button>` : ""}
          </div>
        </article>
      `;
    }).join("");
  }

  function renderMapProgress() {
    const completedChapters = DATA.chapters.filter((chapter) =>
      DATA.chains
        .filter((chain) => chain.chapter === chapter.id)
        .every((chain) => state.campaign.completedChainIds.includes(chain.id))
    ).length;
    const nextChain = currentChain();
    $("campaign-progress").innerHTML = [
      `
      <article class="program-card">
        <span class="eyebrow">Route Health</span>
        <h3>Current campaign state</h3>
        <p class="muted">You are in ${chapterById[state.campaign.activeChapter].title}, with ${completedChapters}/${DATA.chapters.length} chapters fully completed.</p>
      </article>
      `,
      `
      <article class="program-card">
        <span class="eyebrow">Next Milestone</span>
        <h3>${nextChain.artifact}</h3>
        <p class="muted">Finish ${nextChain.title} to unlock the next artifact and keep the route moving.</p>
      </article>
      `
    ].join("") + DATA.chapters.map((chapter) => {
      const chapterChains = DATA.chains.filter((chain) => chain.chapter === chapter.id);
      const completed = chapterChains.filter((chain) => state.campaign.completedChainIds.includes(chain.id)).length;
      return `
        <article class="program-card">
          <span class="eyebrow">Chapter ${chapter.order}</span>
          <h3>${chapter.title}</h3>
          <p class="muted">${chapter.summary}</p>
          <div class="progress-track">
            <div class="progress-fill" style="width:${(completed / chapterChains.length) * 100}%"></div>
          </div>
          <p class="muted">${completed}/${chapterChains.length} chains complete</p>
        </article>
      `;
    }).join("");
  }

  function renderProgress() {
    const latest = getLatestDiagnostic();
    state.reportState = buildReportState();
    $("insight-stats").innerHTML = [
      ["Completed quests", state.campaign.completedQuestIds.length],
      ["Completed chains", state.campaign.completedChainIds.length],
      ["Badges", state.rewards.badges.length],
      ["Best streak", `${state.rewards.longestStreak} days`]
    ].map(([label, value]) => `
      <article class="stat-card">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </article>
    `).join("");

    const days = Array.from({ length: 28 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (27 - index));
      return date.toISOString().slice(0, 10);
    });
    const activeDates = new Set(state.campaign.timeline.map((item) => item.date));
    $("heatmap-caption").textContent = `${activeDates.size} active days recorded`;
    $("heatmap").innerHTML = days.map((date) => `<span class="heatmap-cell ${activeDates.has(date) ? "is-active" : ""}" title="${date}"></span>`).join("");

    const completedByLane = Object.keys(DATA.programs).map((lane) => {
      const total = DATA.quests.filter((quest) => quest.lane === lane).length;
      const done = DATA.quests.filter((quest) => quest.lane === lane && state.campaign.completedQuestIds.includes(quest.id)).length;
      return { lane, total, done };
    });
    $("program-bars").innerHTML = completedByLane.map((item) => `
      <article class="program-card">
        <h3>${DATA.programs[item.lane].name}</h3>
        <div class="progress-track">
          <div class="progress-fill" style="width:${(item.done / item.total) * 100}%"></div>
        </div>
        <p class="muted">${item.done}/${item.total} quests completed</p>
      </article>
    `).join("");

    $("diagnostic-history-caption").textContent = latest ? `Latest WHO-5: ${latest.who5Score}/100` : "No scans saved yet";
    $("diagnostic-history").innerHTML = state.diagnostics.slice().reverse().map((diag) => `
      <article class="history-card">
        <span class="badge">${diag.date}</span>
        <h4>${DATA.programs[diag.laneRecommendation].name}</h4>
        <p class="muted">Opening ${diag.recommendedOpening}, intensity ${diag.recommendedIntensity}, WHO-5 ${diag.who5Score}/100.</p>
      </article>
    `).join("") || `<p class="muted">Weekly scan history will appear here.</p>`;

    $("achievement-grid").innerHTML = [
      ...state.rewards.badges.map((badge) => `<article class="reward-card"><span class="eyebrow">Badge</span><h4>${badge}</h4></article>`),
      ...state.rewards.artifacts.map((artifact) => `<article class="reward-card"><span class="eyebrow">Artifact</span><h4>${artifact.name}</h4><p class="muted">${artifact.date}</p></article>`)
    ].join("") || `<p class="muted">Milestones appear here as you complete chains.</p>`;

    renderSessionPrep(latest);
    renderFormsAndReport();
    renderAnalyticsSection();
  }

  function renderSessionPrep(latest) {
    const current = currentQuest();
    const recentMemories = state.rewards.memories.slice(0, 2);
    const latestArtifact = state.rewards.artifacts[0] || null;
    const nextReward = currentChain();
    const trend = getWho5TrendSummary();
    const recentNotes = Object.entries(state.notes)
      .filter(([, value]) => value && value.trim())
      .slice(-2)
      .map(([questId, value]) => ({ quest: byId[questId], value }));
    const overview = [
      ["Latest WHO-5", latest ? `${latest.who5Score}/100` : "Not yet"],
      ["Current lane", DATA.programs[state.campaign.laneRecommendation].label],
      ["Completed quests", String(state.campaign.completedQuestIds.length)],
      ["Current intensity", state.campaign.recommendedIntensity]
    ];
    const focusItems = [
      {
        title: "Current guided quest",
        detail: current
          ? `I am currently working on "${current.title}" in ${chapterById[current.chapter].title}.`
          : "I have completed the current campaign arc and may need help choosing the next focus."
      },
      {
        title: "Current chapter",
        detail: chapterById[state.campaign.activeChapter].summary
      },
      {
        title: "Next unlocked reward",
        detail: current ? `If I finish this chain, I unlock ${nextReward.artifact} and the ${nextReward.badge} badge.` : "I may need a new reward target for the next season."
      }
    ];
    const signalItems = latest ? [
      {
        title: "Weekly scan result",
        detail: `The app routed me toward ${DATA.programs[latest.laneRecommendation].name} with ${latest.recommendedIntensity} intensity.`
      },
      ...(trend ? [{
        title: "WHO-5 trend",
        detail: trend.detail
      }] : []),
      {
        title: "Restoration signal",
        detail: latest.stabilizationFlag
          ? "The app noticed a stronger need for stabilization, recovery, or gentler pacing."
          : "The app did not flag a strong restoration warning in the latest scan."
      }
    ] : [
      {
        title: "No weekly scan yet",
        detail: "I have not saved a scan yet, so the app has less signal-level information."
      }
    ];
    const helpingItems = [
      {
        title: "Things that seem to help",
        detail: state.campaign.completedQuestIds.length
          ? `Structured quests, small next steps, and guided progression seem easier to follow than open-ended plans.`
          : "No clear helpful pattern yet because I have not completed enough quests."
      },
      {
        title: "Reward response",
        detail: latestArtifact
          ? `I recently unlocked ${latestArtifact.name}, which may be useful if external markers and visible progress help me stay engaged.`
          : `Visible rewards might matter for my motivation. The next chain reward is ${nextReward.artifact}.`
      },
      ...recentMemories.map((memory) => ({
        title: memory.title,
        detail: memory.text
      }))
    ];
    const hardItems = [
      {
        title: "Things that feel hard",
        detail: latest && latest.stabilizationFlag
          ? "The app keeps seeing signs that energy, restoration, or overall steadiness may need attention."
          : "No strong app-detected warning yet, but I may still want to discuss friction, consistency, or motivation."
      },
      {
        title: "Re-entry after pauses",
        detail: "The app is designed around rerouting and recovery instead of punishment, which may be useful if restarting has been difficult."
      }
    ];
    const changeItems = [
      {
        title: "Visible progress",
        detail: `I have completed ${state.campaign.completedQuestIds.length} quests, ${state.campaign.completedChainIds.length} chains, and unlocked ${state.rewards.badges.length} badges.`
      },
      {
        title: "Consistency signal",
        detail: `My current streak is ${getCurrentStreak()} days and my best streak is ${state.rewards.longestStreak} days.`
      },
      {
        title: "Next milestone",
        detail: current
          ? `If I finish the current chain, I unlock ${nextReward.artifact} and the ${nextReward.badge} badge.`
          : "I have reached the end of the current arc and may need a new milestone."
      },
      ...recentNotes.map((item) => ({
        title: `Recent note from ${item.quest.title}`,
        detail: item.value.trim().slice(0, 180)
      }))
    ];
    const topicItems = [
      {
        title: "Good topics to bring up",
        detail: "Changes in mood, energy, motivation, connection, consistency, and what made tasks easier or harder."
      },
      {
        title: "Medication / treatment question",
        detail: latest && latest.who5Score < 44
          ? "My well-being signal has been low recently. Is there anything I should pay closer attention to between sessions?"
          : "What signals should I watch between sessions so I can report changes more clearly?"
      },
      {
        title: "App-guided question",
        detail: latest && latest.stabilizationFlag
          ? "Should I prioritize stabilization and gentler pacing right now?"
          : `Does it make sense to keep focusing on ${DATA.programs[state.campaign.laneRecommendation].name} right now?`
      },
      {
        title: "Recent wins worth mentioning",
        detail: state.campaign.completedQuestIds.length
          ? `I have already followed through on ${state.campaign.completedQuestIds.length} guided step${state.campaign.completedQuestIds.length === 1 ? "" : "s"}, which may say something useful about what kind of structure helps me.`
          : "I have not built much follow-through yet, which may also be important to discuss."
      }
    ];

    $("session-prep-summary").textContent = latest
      ? "This page gathers your current focus, scan results, patterns, and notes into one cleaner session review."
      : "This page becomes more useful once scans and quest notes are saved, but you can already use it to collect talking points.";
    $("session-prep-overview").innerHTML = overview.map(([label, value]) => `
      <article class="stat-card">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </article>
    `).join("");
    renderSessionList("session-focus-list", focusItems);
    renderSessionList("session-signals-list", signalItems);
    renderSessionList("session-helping-list", helpingItems);
    renderSessionList("session-hard-list", hardItems);
    renderSessionList("session-changes-list", changeItems);
    renderSessionList("session-topics-list", topicItems);
    $("session-prep-note").value = state.sessionPrepNote || "";
    $("session-prep-status").textContent = state.sessionPrepNote
      ? "Personal session note saved locally."
      : "Saved locally on this device.";
  }

  function renderSessionList(targetId, items) {
    $(targetId).innerHTML = items.map((item) => `
      <article class="session-item">
        <h4>${item.title}</h4>
        <p class="muted">${item.detail}</p>
      </article>
    `).join("");
  }

  function renderQuestWorkspaceFields(quest, entry) {
    const fields = quest.questFields || {};
    if (quest.questTemplate === "triple_reflection") {
      return `
        <div class="quest-form-grid">
          <label class="text-field"><span>${fields.firstLabel}</span><textarea name="first" rows="3" placeholder="${fields.firstLabel}">${entry.first || ""}</textarea></label>
          <label class="text-field"><span>${fields.secondLabel}</span><textarea name="second" rows="3" placeholder="${fields.secondLabel}">${entry.second || ""}</textarea></label>
          <label class="text-field full-span"><span>${fields.thirdLabel}</span><textarea name="third" rows="3" placeholder="${fields.thirdLabel}">${entry.third || ""}</textarea></label>
          <label class="select-field"><span>${fields.choiceLabel}</span><select name="priority">
            <option value="first" ${entry.priority === "first" ? "selected" : ""}>First</option>
            <option value="second" ${entry.priority === "second" ? "selected" : ""}>Second</option>
            <option value="third" ${entry.priority === "third" ? "selected" : ""}>Third</option>
          </select></label>
          <label class="text-field full-span"><span>${fields.actionLabel}</span><textarea name="action" rows="3" placeholder="${fields.actionLabel}">${entry.action || ""}</textarea></label>
        </div>
      `;
    }
    if (quest.questTemplate === "belief_reframe") {
      return `
        <div class="quest-form-grid">
          <label class="text-field full-span"><span>${fields.sourceLabel}</span><textarea name="source" rows="3" placeholder="${fields.sourceLabel}">${entry.source || ""}</textarea></label>
          <label class="text-field full-span"><span>${fields.reframeLabel}</span><textarea name="reframe" rows="3" placeholder="${fields.reframeLabel}">${entry.reframe || ""}</textarea></label>
          <label class="text-field full-span"><span>${fields.nextLabel}</span><textarea name="next" rows="3" placeholder="${fields.nextLabel}">${entry.next || ""}</textarea></label>
        </div>
      `;
    }
    if (quest.questTemplate === "rating_audit") {
      const ratings = (fields.ratings || ["Area 1", "Area 2", "Area 3", "Area 4"]).map((label, index) => `
        <label class="range-field">
          <span>${label}</span>
          <input type="range" min="1" max="5" value="${entry[`rating${index}`] || 3}" name="rating${index}" />
          <output>${entry[`rating${index}`] || 3}</output>
        </label>
      `).join("");
      return `
        <div class="quest-form-grid">
          ${ratings}
          <label class="text-field full-span"><span>${fields.weakestLabel}</span><textarea name="weakest" rows="3" placeholder="${fields.weakestLabel}">${entry.weakest || ""}</textarea></label>
          <label class="text-field full-span"><span>${fields.actionLabel}</span><textarea name="action" rows="3" placeholder="${fields.actionLabel}">${entry.action || ""}</textarea></label>
        </div>
      `;
    }
    if (quest.questTemplate === "planning_commitment") {
      return `
        <div class="quest-form-grid">
          <label class="text-field full-span"><span>${fields.planLabel}</span><textarea name="plan" rows="3" placeholder="${fields.planLabel}">${entry.plan || ""}</textarea></label>
          <label class="text-field"><span>${fields.cueLabel}</span><textarea name="cue" rows="3" placeholder="${fields.cueLabel}">${entry.cue || ""}</textarea></label>
          <label class="text-field"><span>${fields.fallbackLabel}</span><textarea name="fallback" rows="3" placeholder="${fields.fallbackLabel}">${entry.fallback || ""}</textarea></label>
          <label class="select-field full-span"><span>${fields.confidenceLabel}</span><select name="planConfidence">
            <option value="1" ${String(entry.planConfidence) === "1" ? "selected" : ""}>Very low</option>
            <option value="2" ${String(entry.planConfidence) === "2" ? "selected" : ""}>Low</option>
            <option value="3" ${!entry.planConfidence || String(entry.planConfidence) === "3" ? "selected" : ""}>Medium</option>
            <option value="4" ${String(entry.planConfidence) === "4" ? "selected" : ""}>High</option>
            <option value="5" ${String(entry.planConfidence) === "5" ? "selected" : ""}>Very high</option>
          </select></label>
        </div>
      `;
    }
    if (quest.questTemplate === "gratitude_connection") {
      return `
        <div class="quest-form-grid">
          <label class="text-field full-span"><span>${fields.targetLabel}</span><textarea name="target" rows="3" placeholder="${fields.targetLabel}">${entry.target || ""}</textarea></label>
          <label class="text-field full-span"><span>${fields.meaningLabel}</span><textarea name="meaning" rows="3" placeholder="${fields.meaningLabel}">${entry.meaning || ""}</textarea></label>
          <label class="text-field full-span"><span>${fields.actionLabel}</span><textarea name="action" rows="3" placeholder="${fields.actionLabel}">${entry.action || ""}</textarea></label>
        </div>
      `;
    }
    return `
      <div class="quest-form-grid">
        <label class="text-field full-span"><span>${fields.helpedLabel}</span><textarea name="helpedText" rows="3" placeholder="${fields.helpedLabel}">${entry.helpedText || ""}</textarea></label>
        <label class="text-field full-span"><span>${fields.hardLabel}</span><textarea name="hardText" rows="3" placeholder="${fields.hardLabel}">${entry.hardText || ""}</textarea></label>
        <label class="text-field full-span"><span>${fields.changedLabel}</span><textarea name="changedText" rows="3" placeholder="${fields.changedLabel}">${entry.changedText || ""}</textarea></label>
        <label class="text-field full-span"><span>${fields.askLabel}</span><textarea name="askText" rows="3" placeholder="${fields.askLabel}">${entry.askText || ""}</textarea></label>
      </div>
    `;
  }

  function saveQuestWorkspace(questId, shouldComplete = false) {
    const quest = byId[questId];
    if (!quest) {
      return;
    }
    const data = new FormData($("sheet-workspace-form"));
    const entry = {
      template: quest.questTemplate,
      updatedAt: isoToday(),
      confidence: Number(data.get("confidence") || 3),
      difficulty: Number(data.get("difficulty") || 3),
      helped: String(data.get("helped") || "mixed"),
      reflection: String(data.get("reflection") || "")
    };
    for (const [key, value] of data.entries()) {
      if (!["confidence", "difficulty", "helped", "reflection"].includes(key)) {
        entry[key] = typeof value === "string" ? value : String(value);
      }
    }
    state.questEntries[questId] = entry;
    state.questResponses[questId] = {
      date: entry.updatedAt,
      confidence: entry.confidence,
      difficulty: entry.difficulty,
      benefit: Number(data.get("planConfidence") || data.get("confidence") || 3),
      helped: entry.helped,
      reflection: entry.reflection
    };
    $("sheet-note-status").textContent = "Quest answers saved locally.";
    saveState();
    if (shouldComplete) {
      completeQuest(questId);
      closeSheet();
      return;
    }
    render();
    openQuestSheet(questId);
    toast("Quest answers saved.");
  }

  function renderFormsAndReport() {
    const latestDaily = getLatestDailyLog();
    const latestWeekly = getLatestWeeklyReview();
    $("daily-log-status").textContent = latestDaily && latestDaily.date === isoToday() ? "logged today" : "not logged today";
    $("weekly-review-status").textContent = latestWeekly && latestWeekly.date === isoToday() ? "review saved today" : "not reviewed this week";
    $("report-status").textContent = state.reportState ? `updated ${state.reportState.updatedAt}` : "live report";
    $("report-overview").innerHTML = state.reportState.overview.map(([label, value]) => `
      <article class="stat-card">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </article>
    `).join("");
    renderSessionList("report-trends", state.reportState.trends.map((detail, index) => ({ title: `Trend ${index + 1}`, detail })));
    renderSessionList("report-points", state.reportState.points.map((detail, index) => ({ title: `Point ${index + 1}`, detail })));
    if (latestDaily) {
      $("daily-mood").value = latestDaily.mood;
      $("daily-stress").value = latestDaily.stress;
      $("daily-sleep").value = latestDaily.sleep;
      $("daily-energy").value = latestDaily.energy;
      $("daily-focus").value = latestDaily.focus;
      $("daily-medication").value = latestDaily.medication;
      $("daily-side-effects").value = latestDaily.sideEffects;
      $("daily-safety").value = latestDaily.safety;
      $("daily-note").value = latestDaily.note || "";
    }
    if (latestWeekly) {
      $("weekly-topics").value = latestWeekly.topics || "";
      $("weekly-helped").value = latestWeekly.helped || "";
      $("weekly-hard").value = latestWeekly.hard || "";
      $("weekly-changed").value = latestWeekly.changed || "";
      $("weekly-ask").value = latestWeekly.ask || "";
    }
    updateRangeOutputs();
  }

  function renderAnalyticsSection() {
    const moodAvg = averageOfLogs("mood");
    const sleepAvg = averageOfLogs("sleep");
    const energyAvg = averageOfLogs("energy");
    const focusAvg = averageOfLogs("focus");
    const stressAvg = averageOfLogs("stress");
    const questEntryTrend = questEntrySummary();
    const preferredDomain = preferredSuccessDomain();
    $("analytics-status").textContent = state.reportState ? `updated ${state.reportState.updatedAt}` : "live analytics";
    $("analytics-overview").innerHTML = [
      ["Mood avg", moodAvg !== null ? moodAvg.toFixed(1) : "No data"],
      ["Sleep avg", sleepAvg !== null ? sleepAvg.toFixed(1) : "No data"],
      ["Energy avg", energyAvg !== null ? energyAvg.toFixed(1) : "No data"],
      ["Quest entries", String(Object.keys(state.questEntries).length)]
    ].map(([label, value]) => `
      <article class="stat-card">
        <span class="stat-label">${label}</span>
        <strong class="stat-value">${value}</strong>
      </article>
    `).join("");
    renderSessionList("analytics-changes", [
      { title: "Well-being trend", detail: (getWho5TrendSummary() && getWho5TrendSummary().detail) || "Not enough WHO-5 scans yet for a reliable trend." },
      { title: "Mood / stress shift", detail: moodAvg !== null && stressAvg !== null ? `Mood averages ${moodAvg.toFixed(1)} and stress averages ${stressAvg.toFixed(1)} across recent daily logs.` : "Not enough mood/stress logs yet." },
      { title: "Sleep / energy shift", detail: sleepAvg !== null && energyAvg !== null ? `Sleep averages ${sleepAvg.toFixed(1)} and energy averages ${energyAvg.toFixed(1)} across recent daily logs.` : "Not enough sleep/energy logs yet." },
      { title: "Consistency", detail: `Current streak is ${getCurrentStreak()} days and best streak is ${state.rewards.longestStreak} days.` }
    ]);
    renderSessionList("analytics-insights", [
      { title: "Quest helpfulness", detail: questEntryTrend || "No structured quest-entry pattern yet." },
      { title: "Medication pattern", detail: medicationSummary() },
      { title: "Side-effect pattern", detail: sideEffectSummary() },
      { title: "Route guidance", detail: routeRecommendationSummary() },
      { title: "Preferred success domain", detail: preferredDomain ? `Repeated quest answers suggest the strongest focus is ${preferredDomain}.` : "No repeated success-domain pattern yet." },
      { title: "Focus change", detail: focusAvg !== null ? `Recent focus average is ${focusAvg.toFixed(1)} out of 5.` : "Not enough focus logs yet." }
    ]);
  }

  function renderSources() {
    const evidenceCount = DATA.sources.filter((source) => source.kind === "evidence").length;
    const courseCount = DATA.sources.filter((source) => source.kind === "course").length;
    $("source-summary").innerHTML = `
      <article class="stat-card">
        <span class="stat-label">Public sources</span>
        <strong class="stat-value">${DATA.sources.length}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Evidence reviews</span>
        <strong class="stat-value">${evidenceCount}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Course sources</span>
        <strong class="stat-value">${courseCount}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Priority rule</span>
        <strong class="stat-value">Meta first</strong>
      </article>
    `;
    const evidenceIntro = `
      <article class="source-card">
        <span class="badge">why this matters</span>
        <h3>How the app decides what to guide you toward</h3>
        <p class="muted">Meta-analyses and systematic reviews get priority for routing, pacing, self-monitoring, and gamification decisions. Public course pages ground the actual quest themes.</p>
      </article>
    `;
    $("sources-list").innerHTML = evidenceIntro + DATA.sources.map((source) => `
      <a class="source-card" href="${source.url}" target="_blank" rel="noreferrer">
        <span class="badge">${source.kind}</span>
        <h3>${source.title}</h3>
        <p>${source.publisher}</p>
        <p class="muted">${source.note}</p>
      </a>
    `).join("");
  }

  function openQuestSheet(questId) {
    const quest = byId[questId];
    if (!quest) {
      return;
    }
    const entry = state.questEntries[quest.id] || {};
    session.activeQuestId = questId;
    saveSession();
    $("sheet-program").textContent = `${DATA.programs[quest.lane].school} | ${chapterById[quest.chapter].title}`;
    $("sheet-title").textContent = quest.title;
    $("sheet-progress").textContent = `${quest.duration} min | ${quest.focus} | ${questStatus(quest.id)}`;
    $("sheet-meta").innerHTML = `
      <span class="meta-pill">${quest.sourceBasis}</span>
      <span class="meta-pill">${quest.evidenceTag}</span>
    `;
    $("sheet-summary").textContent = quest.summary;
    $("sheet-why").textContent = quest.why;
    $("sheet-steps").innerHTML = quest.steps.map((step) => `<li>${step}</li>`).join("");
    $("sheet-prompts").innerHTML = quest.prompts.map((prompt) => `<li>${prompt}</li>`).join("");
    $("sheet-workspace-fields").innerHTML = renderQuestWorkspaceFields(quest, entry);
    $("sheet-confidence").value = String(entry.confidence || 3);
    $("sheet-difficulty").value = String(entry.difficulty || 3);
    $("sheet-helped").value = entry.helped || "yes";
    $("sheet-note").value = entry.reflection || "";
    $("sheet-note-status").textContent = entry.updatedAt ? `Saved ${entry.updatedAt}` : "Answer the quest here.";
    $("sheet-source-mode").textContent = quest.sourceBasis;
    $("sheet-inference").textContent = quest.evidenceTag;
    $("sheet-sources").innerHTML = quest.sources.map((id) => {
      const source = sourcesById[id];
      return `<a class="linked-source" href="${source.url}" target="_blank" rel="noreferrer"><strong>${source.title}</strong><span>${source.publisher}</span></a>`;
    }).join("");
    $("sheet-workspace-form").dataset.questId = quest.id;
    $("sheet-complete").dataset.completeQuest = quest.id;
    $("sheet-next").dataset.nextQuest = quest.id;
    $("exercise-sheet").classList.add("open");
    $("exercise-sheet").setAttribute("aria-hidden", "false");
    $("sheet-backdrop").hidden = false;
  }

  function closeSheet() {
    $("exercise-sheet").classList.remove("open");
    $("exercise-sheet").setAttribute("aria-hidden", "true");
    $("sheet-backdrop").hidden = true;
  }

  function nextQuestFrom(questId) {
    if (state.campaign.currentQuestId === questId) {
      completeQuest(questId);
      return;
    }
    openQuestSheet(state.campaign.currentQuestId);
  }

  function setView(view) {
    state.view = view;
    document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
    document.querySelectorAll(".nav-button").forEach((button) => button.classList.toggle("active", button.dataset.viewTarget === view));
    session.lastView = view;
    saveSession();
    saveState();
  }

  function toast(message) {
    const node = $("toast");
    node.textContent = message;
    node.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      node.hidden = true;
    }, 2200);
  }

  function render() {
    document.body.dataset.theme = state.theme;
    $("theme-toggle").textContent = state.theme === "dark" ? "Dark" : "Light";
    renderHero();
    renderMissionBrief();
    renderTopStats();
    renderCampaignState();
    renderDiagnostic();
    renderCompanion();
    renderUpcoming();
    renderNodeMap();
    renderTimeline();
    renderRewards();
    renderArchive();
    renderMapProgress();
    renderProgress();
    renderSources();
    const initialView = views.includes(queryView) ? queryView : (state.view || session.lastView || "play");
    setView(initialView);
  }

  function readDiagnosticForm(form) {
    const data = new FormData(form);
    const entries = {};
    for (const item of DATA.diagnosticSurvey) {
      const value = data.get(item.id);
      if (value === null) {
        return null;
      }
      entries[item.id] = Number(value);
    }
    return {
      entries,
      note: String(data.get("note") || "")
    };
  }

  function serializeQuestResponse(form) {
    const data = new FormData(form);
    return {
      date: isoToday(),
      confidence: Number(data.get("confidence") || 3),
      difficulty: Number(data.get("difficulty") || 3),
      benefit: Number(data.get("benefit") || 3),
      helped: String(data.get("helped") || "mixed"),
      reflection: String(data.get("reflection") || "")
    };
  }

  function updateRangeOutputs() {
    [
      ["daily-mood", "daily-mood-output"],
      ["daily-stress", "daily-stress-output"],
      ["daily-sleep", "daily-sleep-output"],
      ["daily-energy", "daily-energy-output"],
      ["daily-focus", "daily-focus-output"]
    ].forEach(([inputId, outputId]) => {
      const input = $(inputId);
      const output = $(outputId);
      if (input && output) {
        output.textContent = input.value;
      }
    });
  }

  function bindEvents() {
    document.querySelectorAll(".nav-button").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.viewTarget));
    });

    $("theme-toggle").addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      saveState();
      render();
    });

    $("start-next").addEventListener("click", () => {
      ensureCampaign();
      openQuestSheet(state.campaign.currentQuestId);
    });

    $("resume-session").addEventListener("click", () => {
      ensureCampaign();
      openQuestSheet(session.activeQuestId || state.campaign.currentQuestId);
    });

    $("jump-diagnostic").addEventListener("click", () => {
      setView("play");
      $("weekly-diagnostic-card").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("diagnostic-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = readDiagnosticForm(event.currentTarget);
      if (!payload) {
        toast("Please answer every scan question before saving.");
        return;
      }
      const result = buildDiagnosticResult(payload.entries, payload.note);
      state.diagnostics.push(result);
      if (!state.campaign.initialized) {
        initializeCampaign(result);
      } else {
        const path = buildCampaignPath(result);
        const activeChainStillPresent = path.includes(state.campaign.activeChainId);
        if (!activeChainStillPresent && state.campaign.currentQuestId) {
          state.campaign.upcomingLockedChainIds = path.filter((id) => id !== state.campaign.activeChainId && !state.campaign.completedChainIds.includes(id));
        } else {
          state.campaign.upcomingLockedChainIds = path.filter((id) => id !== state.campaign.activeChainId && !state.campaign.completedChainIds.includes(id));
        }
        state.campaign.laneRecommendation = result.laneRecommendation;
        state.campaign.recommendedIntensity = result.recommendedIntensity;
        state.campaign.stabilizationFlag = result.stabilizationFlag;
        state.campaign.timeline.unshift({
          type: "diagnostic",
          date: result.date,
          title: "Weekly scan saved",
          detail: `Route favored ${DATA.programs[result.laneRecommendation].name} with ${result.recommendedIntensity} intensity.`
        });
      }
      saveState();
      render();
      toast("Scan saved. The board has updated your route.");
    });

    $("daily-log-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const entry = {
        date: isoToday(),
        mood: Number(data.get("mood") || 3),
        stress: Number(data.get("stress") || 3),
        sleep: Number(data.get("sleep") || 3),
        energy: Number(data.get("energy") || 3),
        focus: Number(data.get("focus") || 3),
        medication: String(data.get("medication") || "na"),
        sideEffects: String(data.get("sideEffects") || "none"),
        safety: String(data.get("safety") || "safe"),
        note: String(data.get("note") || "")
      };
      state.dailyLogs = state.dailyLogs.filter((item) => item.date !== entry.date).concat(entry);
      state.campaign.timeline.unshift({
        type: "daily-log",
        date: entry.date,
        title: "Daily log saved",
        detail: `Mood ${entry.mood}, energy ${entry.energy}, sleep ${entry.sleep}.`
      });
      saveState();
      render();
      toast("Daily log saved.");
    });

    $("weekly-review-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const entry = {
        date: isoToday(),
        topics: String(data.get("topics") || ""),
        helped: String(data.get("helped") || ""),
        hard: String(data.get("hard") || ""),
        changed: String(data.get("changed") || ""),
        ask: String(data.get("ask") || "")
      };
      state.weeklyReviews = state.weeklyReviews.filter((item) => item.date !== entry.date).concat(entry);
      state.campaign.timeline.unshift({
        type: "weekly-review",
        date: entry.date,
        title: "Weekly review saved",
        detail: "The app has more context for your next route and report."
      });
      saveState();
      render();
      toast("Weekly review saved.");
    });

    document.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-open-quest]");
      if (openButton) {
        openQuestSheet(openButton.dataset.openQuest);
      }
      const completeButton = event.target.closest("[data-complete-quest]");
      if (completeButton) {
        completeQuest(completeButton.dataset.completeQuest);
        if ($("exercise-sheet").classList.contains("open")) {
          closeSheet();
        }
      }
      const nextButton = event.target.closest("[data-next-quest]");
      if (nextButton) {
        nextQuestFrom(nextButton.dataset.nextQuest);
      }
      const programButton = event.target.closest("[data-filter-program]");
      if (programButton) {
        state.filters.program = programButton.dataset.filterProgram;
        saveState();
        buildFilters();
        renderArchive();
      }
      const statusButton = event.target.closest("[data-filter-status]");
      if (statusButton) {
        state.filters.status = statusButton.dataset.filterStatus;
        saveState();
        buildFilters();
        renderArchive();
      }
    });

    $("sheet-workspace-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const questId = event.currentTarget.dataset.questId;
      saveQuestWorkspace(questId, false);
    });

    $("close-sheet").addEventListener("click", closeSheet);
    $("sheet-backdrop").addEventListener("click", closeSheet);
    $("sheet-archive").addEventListener("click", () => {
      closeSheet();
      setView("archive");
    });
    $("sheet-next").addEventListener("click", () => nextQuestFrom($("sheet-next").dataset.nextQuest));
    $("sheet-complete").addEventListener("click", () => {
      saveQuestWorkspace($("sheet-complete").dataset.completeQuest, true);
    });
    $("sheet-note").addEventListener("input", (event) => {
      $("sheet-note-status").textContent = "Unsaved changes in workspace.";
    });

    $("search-input").addEventListener("input", (event) => {
      state.filters.search = event.target.value;
      saveState();
      renderArchive();
    });

    $("session-prep-note").addEventListener("input", (event) => {
      state.sessionPrepNote = event.target.value;
      $("session-prep-status").textContent = event.target.value.trim()
        ? "Personal session note saved locally."
        : "Saved locally on this device.";
      saveState();
    });

    [
      "daily-mood",
      "daily-stress",
      "daily-sleep",
      "daily-energy",
      "daily-focus"
    ].forEach((id) => {
      const input = $(id);
      if (input) {
        input.addEventListener("input", updateRangeOutputs);
      }
    });

    $("export-data").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "being-command-board-export.json";
      link.click();
      URL.revokeObjectURL(url);
    });

    $("export-report").addEventListener("click", () => {
      state.reportState = buildReportState();
      const lines = [
        "Warm Neon Life-Map Session Report",
        `Generated: ${state.reportState.updatedAt}`,
        "",
        "Overview:",
        ...state.reportState.overview.map(([label, value]) => `- ${label}: ${value}`),
        "",
        "Trend Summary:",
        ...state.reportState.trends.map((line) => `- ${line}`),
        "",
        "Session Talking Points:",
        ...state.reportState.points.map((line) => `- ${line}`),
        "",
        `Personal note: ${state.sessionPrepNote || "None"}`
      ];
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "being-session-report.txt";
      link.click();
      URL.revokeObjectURL(url);
    });

    $("clear-session").addEventListener("click", () => {
      session = { activeQuestId: state.campaign.currentQuestId, lastView: "play" };
      saveSession();
      toast("Session memory cleared. Long-term progress remains.");
    });

    $("reset-data").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      state = defaultState();
      session = { activeQuestId: null, lastView: "play" };
      render();
      toast("Progress reset. The board is ready for a fresh origin scan.");
    });
  }

  function buildFilters() {
    $("program-filters").innerHTML = [
      { id: "all", label: "All lanes" },
      ...Object.values(DATA.programs).map((program) => ({ id: program.id, label: program.label }))
    ].map((item) => `<button class="chip ${state.filters.program === item.id ? "active" : ""}" type="button" data-filter-program="${item.id}">${item.label}</button>`).join("");
    $("status-filters").innerHTML = [
      { id: "all", label: "All states" },
      { id: "current", label: "Current" },
      { id: "unlocked", label: "Unlocked" },
      { id: "complete", label: "Complete" },
      { id: "locked", label: "Locked" }
    ].map((item) => `<button class="chip ${state.filters.status === item.id ? "active" : ""}" type="button" data-filter-status="${item.id}">${item.label}</button>`).join("");
  }

  ensureCampaign();
  buildFilters();
  bindEvents();
  updateRangeOutputs();
  render();
})();
