(function () {
  const DATA = window.BEING_DATA;
  const STORAGE_KEY = "being-command-board-state-v1";
  const SESSION_KEY = "being-command-board-session-v1";
  const views = ["play", "archive", "map", "progress", "sources"];
  const queryView = new URLSearchParams(window.location.search).get("view");

  const $ = (id) => document.getElementById(id);
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
    return `${routeText} ${intensityText}`;
  }

  function renderHero() {
    ensureCampaign();
    $("top-player-chip").innerHTML = `<strong>Level ${state.rewards.level} navigator</strong><span>${state.campaign.completedQuestIds.length} quests logged</span>`;
    $("hero-level").textContent = `Lv ${state.rewards.level}`;
    $("xp-caption").textContent = `${state.rewards.xp} XP banked`;
    $("xp-next").textContent = `Next level in ${120 - xpIntoLevel(state.rewards.xp)} XP`;
    $("xp-fill").style.width = `${(xpIntoLevel(state.rewards.xp) / 120) * 100}%`;
    $("hero-highlights").innerHTML = [
      `<span class="pill">Opening: ${chapterById[state.campaign.openingChapter].title}</span>`,
      `<span class="pill">Lane: ${DATA.programs[state.campaign.laneRecommendation].label}</span>`,
      `<span class="pill">Intensity: ${state.campaign.recommendedIntensity}</span>`
    ].join("");
  }

  function renderTopStats() {
    const latest = getLatestDiagnostic();
    const stats = [
      ["Active chain", currentChain().title],
      ["Current quest", currentQuest() ? currentQuest().title : "Campaign complete"],
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
          <button class="primary-button" type="button" data-open-quest="${quest.id}">Open current quest</button>
          <button class="secondary-button" type="button" data-complete-quest="${quest.id}">Complete quest</button>
        </div>
      </article>
    `;
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

    $("archive-summary").textContent = `${results.length} quests visible. The campaign stays linear, but the archive remains readable for transparency.`;
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
    $("campaign-progress").innerHTML = DATA.chapters.map((chapter) => {
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
    $("insight-stats").innerHTML = [
      ["Completed quests", state.campaign.completedQuestIds.length],
      ["Completed chains", state.campaign.completedChainIds.length],
      ["Badges", state.rewards.badges.length],
      ["Current lane", DATA.programs[state.campaign.laneRecommendation].label]
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
  }

  function renderSessionPrep(latest) {
    const current = currentQuest();
    const recentMemories = state.rewards.memories.slice(0, 2);
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
      }
    ];
    const signalItems = latest ? [
      {
        title: "Weekly scan result",
        detail: `The app routed me toward ${DATA.programs[latest.laneRecommendation].name} with ${latest.recommendedIntensity} intensity.`
      },
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
        title: "App-guided question",
        detail: latest && latest.stabilizationFlag
          ? "Should I prioritize stabilization and gentler pacing right now?"
          : `Does it make sense to keep focusing on ${DATA.programs[state.campaign.laneRecommendation].name} right now?`
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
    $("sources-list").innerHTML = DATA.sources.map((source) => `
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
    $("sheet-note").value = state.notes[quest.id] || "";
    $("sheet-note-status").textContent = state.notes[quest.id] ? "Note saved locally." : "Notes stay on this device.";
    $("sheet-source-mode").textContent = quest.sourceBasis;
    $("sheet-inference").textContent = quest.evidenceTag;
    $("sheet-sources").innerHTML = quest.sources.map((id) => {
      const source = sourcesById[id];
      return `<a class="linked-source" href="${source.url}" target="_blank" rel="noreferrer"><strong>${source.title}</strong><span>${source.publisher}</span></a>`;
    }).join("");
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

    $("close-sheet").addEventListener("click", closeSheet);
    $("sheet-backdrop").addEventListener("click", closeSheet);
    $("sheet-archive").addEventListener("click", () => {
      closeSheet();
      setView("archive");
    });
    $("sheet-next").addEventListener("click", () => nextQuestFrom($("sheet-next").dataset.nextQuest));
    $("sheet-complete").addEventListener("click", () => {
      completeQuest($("sheet-complete").dataset.completeQuest);
      closeSheet();
    });
    $("sheet-note").addEventListener("input", (event) => {
      if (session.activeQuestId) {
        state.notes[session.activeQuestId] = event.target.value;
        $("sheet-note-status").textContent = "Note saved locally.";
        saveState();
      }
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

    $("export-data").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "being-command-board-export.json";
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
  render();
})();
