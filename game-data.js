window.BEING_DATA = (() => {
  const sources = [
    {
      id: "course-success",
      title: "The Science of Success: What Researchers Know that You Should Know",
      publisher: "Coursera / University of Michigan",
      url: "https://www.coursera.org/learn/success",
      note:
        "Public module descriptions reference defining success, growth mindset, core self-evaluations, expertise, grit, networks, and a heart-head-hands plan.",
      kind: "course",
    },
    {
      id: "course-behavior",
      title: "Creating Behavioral Change",
      publisher: "Coursera / Wesleyan University",
      url: "https://www.coursera.org/learn/behavioral-change",
      note:
        "Public module descriptions reference a course-long behavior change experiment, motivational interviewing, activation, conditioning, SMART goals, and relapse planning.",
      kind: "course",
    },
    {
      id: "course-wellbeing",
      title: "The Science of Well-Being",
      publisher: "Coursera / Yale University",
      url: "https://www.coursera.org/learn/the-science-of-well-being",
      note:
        "Public rewirements and readings reference gratitude, savoring, kindness, social connection, exercise, sleep, meditation, and a final rewirement challenge.",
      kind: "course",
    },
    {
      id: "course-michigan-online",
      title: "Michigan Online overview",
      publisher: "University of Michigan",
      url: "https://online.umich.edu/collections/back-to-work/experience/the-science-of-success-what-researchers-know-that-you-should-know/",
      note:
        "Overview confirms action planning, small wins, growth, and broader success definitions.",
      kind: "course",
    },
    {
      id: "course-yale-online",
      title: "Yale Online overview",
      publisher: "Yale University",
      url: "https://online.yale.edu/courses/science-well-being",
      note:
        "Overview confirms the course is challenge-based and focused on practices that increase well-being.",
      kind: "course",
    },
    {
      id: "course-yale-news",
      title: "How to gain a sense of well-being, free and online",
      publisher: "Yale News",
      url: "https://news.yale.edu/2021/04/14/how-gain-sense-well-being-free-and-online",
      note:
        "Public summary notes homework such as gratitude lists, connection, meditation, exercise, and sleep improvements.",
      kind: "course",
    },
    {
      id: "evidence-gamification",
      title: "Gamification interventions for health and well-being",
      publisher: "Systematic review / meta-analysis",
      url: "https://www.sciencedirect.com/org/science/article/pii/S1874944524001035",
      note:
        "Supports light-to-moderate gamification, especially when paired with meaningful behavior change design.",
      kind: "evidence",
    },
    {
      id: "evidence-sdt-1",
      title: "Self-determination theory interventions",
      publisher: "Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/32437175/",
      note:
        "Supports autonomy, competence, and relatedness as core motivational ingredients.",
      kind: "evidence",
    },
    {
      id: "evidence-sdt-2",
      title: "SDT techniques and motivation",
      publisher: "Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/30295176/",
      note:
        "Supports autonomy-supportive behavior-change techniques over pressure-heavy designs.",
      kind: "evidence",
    },
    {
      id: "evidence-tailor-1",
      title: "Computer-tailored interventions",
      publisher: "Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/20558196/",
      note: "Supports tailoring rather than one-size-fits-all behavior guidance.",
      kind: "evidence",
    },
    {
      id: "evidence-tailor-2",
      title: "Web-based tailored health behavior interventions",
      publisher: "Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/23750972/",
      note:
        "Supports digital tailoring and personalized routing over generic messaging.",
      kind: "evidence",
    },
    {
      id: "evidence-planning",
      title: "Implementation intentions and goal attainment",
      publisher: "Meta-analysis",
      url: "https://www.sciencedirect.com/science/article/abs/pii/S0065260106380021",
      note:
        "Supports action planning and clear next-step design for goal pursuit.",
      kind: "evidence",
    },
    {
      id: "evidence-feedback",
      title: "Self-monitoring with feedback",
      publisher: "Systematic review / meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/38178230/",
      note:
        "Supports monitoring plus feedback loops for sustained behavior change.",
      kind: "evidence",
    },
    {
      id: "evidence-positive",
      title: "Positive psychology interventions",
      publisher: "Meta-analysis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3599475/",
      note:
        "Supports gratitude, savoring, and strengths-based practices for well-being.",
      kind: "evidence",
    },
    {
      id: "evidence-gratitude",
      title: "Gratitude interventions and well-being",
      publisher: "Systematic review / meta-analysis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10393216/",
      note: "Supports gratitude practices as small but reliable well-being boosters.",
      kind: "evidence",
    },
    {
      id: "evidence-activation",
      title: "Behavioral activation",
      publisher: "Meta-analysis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2882847/",
      note:
        "Supports small action-first approaches when motivation is low or uneven.",
      kind: "evidence",
    },
    {
      id: "evidence-affirmation",
      title: "Self-affirmation and behavior change",
      publisher: "Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/25133846/",
      note:
        "Supports values and self-affirmation prompts that reduce defensiveness and support change.",
      kind: "evidence",
    },
    {
      id: "evidence-narrative",
      title: "Narrative game-based interventions",
      publisher: "Meta-analysis",
      url: "https://pubmed.ncbi.nlm.nih.gov/31829829/",
      note:
        "Supports light narrative framing when it stays grounded in concrete behavior content.",
      kind: "evidence",
    },
    {
      id: "evidence-who5",
      title: "WHO-5 Well-Being Index",
      publisher: "World Health Organization",
      url: "https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf",
      note:
        "Validated short well-being questionnaire used here as a self-guidance signal, not a diagnosis.",
      kind: "evidence",
    },
  ];

  const programs = {
    success: {
      id: "success",
      label: "Success",
      name: "The Science of Success",
      school: "University of Michigan",
      short: "Beliefs, expertise, and action",
    },
    behavior: {
      id: "behavior",
      label: "Behavior",
      name: "Creating Behavioral Change",
      school: "Wesleyan University",
      short: "Experiments, plans, and habit design",
    },
    wellbeing: {
      id: "wellbeing",
      label: "Well-Being",
      name: "The Science of Well-Being",
      school: "Yale University",
      short: "Rewirements for gratitude, connection, and recovery",
    },
  };

  const diagnosticOptions = [
    { value: 0, label: "At no time" },
    { value: 1, label: "Some of the time" },
    { value: 2, label: "Less than half the time" },
    { value: 3, label: "More than half the time" },
    { value: 4, label: "Most of the time" },
    { value: 5, label: "All of the time" },
  ];

  const diagnosticSurvey = [
    {
      id: "who5_cheerful",
      group: "WHO-5 core",
      prompt: "Over the last 2 weeks, I have felt cheerful and in good spirits.",
      help: "Validated WHO-5 item.",
    },
    {
      id: "who5_calm",
      group: "WHO-5 core",
      prompt: "Over the last 2 weeks, I have felt calm and relaxed.",
      help: "Validated WHO-5 item.",
    },
    {
      id: "who5_active",
      group: "WHO-5 core",
      prompt: "Over the last 2 weeks, I have felt active and vigorous.",
      help: "Validated WHO-5 item.",
    },
    {
      id: "who5_rested",
      group: "WHO-5 core",
      prompt: "Over the last 2 weeks, I woke up feeling fresh and rested.",
      help: "Validated WHO-5 item.",
    },
    {
      id: "who5_interest",
      group: "WHO-5 core",
      prompt: "Over the last 2 weeks, my daily life has been filled with things that interest me.",
      help: "Validated WHO-5 item.",
    },
    {
      id: "route_growth",
      group: "Routing signal",
      prompt: "I usually believe I can improve through effort, practice, and feedback.",
      help: "Lower scores point toward a success-focused ignition lane.",
    },
    {
      id: "route_plans",
      group: "Routing signal",
      prompt: "When motivation dips, I can still follow through on a small plan.",
      help: "Lower scores point toward a behavior-change lane.",
    },
    {
      id: "route_environment",
      group: "Routing signal",
      prompt: "My environment makes healthy actions easier rather than harder.",
      help: "Lower scores point toward environment design and behavior support.",
    },
    {
      id: "route_connection",
      group: "Routing signal",
      prompt: "I feel supported, connected, and able to reach out to people who matter.",
      help: "Lower scores point toward relationship and well-being quests.",
    },
    {
      id: "route_restoration",
      group: "Routing signal",
      prompt: "I am making enough space for sleep, movement, mindfulness, or gratitude to feel restored.",
      help: "Lower scores can trigger stabilization earlier.",
    },
  ];

  const chapters = [
    { id: "ignite", order: 1, title: "Ignite the Signal", summary: "Start with meaning, small wins, and belief shifts." },
    { id: "stabilize", order: 2, title: "Stabilize the System", summary: "Recover attention, energy, and environmental support." },
    { id: "momentum", order: 3, title: "Build Gentle Momentum", summary: "Turn intention into repeatable plans and cues." },
    { id: "identity", order: 4, title: "Shape Identity and Skill", summary: "Grow confidence, expertise, and self-trust." },
    { id: "meaning", order: 5, title: "Deepen Relationships and Meaning", summary: "Strengthen connection, kindness, and purpose." },
    { id: "sustain", order: 6, title: "Sustain and Re-route", summary: "Review, adapt, and keep the campaign humane." },
  ];

  const chains = [
    { id: "ignite-success", chapter: "ignite", lane: "success", order: 1, unlockRule: "origin", title: "Signal: Personal Mission", artifact: "Pulse Compass", badge: "Signal lit", memory: "Your archivist marks the first spark." },
    { id: "ignite-behavior", chapter: "ignite", lane: "behavior", order: 1, unlockRule: "origin", title: "Signal: Motion Protocol", artifact: "Starter Relay", badge: "Motion online", memory: "A tiny action proves the system can move." },
    { id: "ignite-wellbeing", chapter: "ignite", lane: "wellbeing", order: 1, unlockRule: "origin", title: "Signal: Brightness Protocol", artifact: "Gleam Capsule", badge: "Light recovered", memory: "The board records a warmer signal in the city noise." },
    { id: "stabilize-system", chapter: "stabilize", lane: "wellbeing", order: 2, unlockRule: "diagnostic-or-after-ignite", title: "Stability: Restore the Grid", artifact: "Quiet Cell", badge: "System steadied", memory: "You learn recovery is not retreat." },
    { id: "momentum-behavior", chapter: "momentum", lane: "behavior", order: 3, unlockRule: "after-stabilize", title: "Momentum: Repeatable Moves", artifact: "Loop Engine", badge: "Momentum held", memory: "The path becomes easier to re-enter." },
    { id: "identity-success", chapter: "identity", lane: "success", order: 4, unlockRule: "after-momentum", title: "Identity: Skill Forge", artifact: "Forge Key", badge: "Self-trust upgraded", memory: "Your future self feels less imaginary now." },
    { id: "meaning-relationships", chapter: "meaning", lane: "wellbeing", order: 5, unlockRule: "after-identity", title: "Meaning: Human Network", artifact: "Kindness Beacon", badge: "Meaning expanded", memory: "Connection becomes part of the map, not a side quest." },
    { id: "sustain-reroute", chapter: "sustain", lane: "behavior", order: 6, unlockRule: "after-meaning", title: "Sustain: Adaptive Campaign", artifact: "Route Prism", badge: "Reroute master", memory: "You stop asking for perfect progress and start building durable return." },
  ];

  const quests = [
    {
      id: "ignite-values-scan",
      chain: "ignite-success",
      chapter: "ignite",
      lane: "success",
      order: 1,
      duration: 10,
      focus: "Values",
      title: "Define Success on Three Levels",
      summary: "Name what success means in work, career, and life before the campaign tells you where to move.",
      why: "The Michigan course publicly begins by asking learners to define success across work, career, and life.",
      steps: [
        "Write one line for success at work, one for career, and one for wider life.",
        "Highlight the definition that feels most alive right now.",
        "Choose one behavior this week that fits that definition."
      ],
      prompts: [
        "What kind of success would still matter if no one applauded it?",
        "Which definition feels true rather than inherited?"
      ],
      evidenceTag: "Values and self-affirmation support behavior change and meaning.",
      sourceBasis: "Public Michigan course description.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "The board captures your first coordinates." },
      sources: ["course-success", "course-michigan-online", "evidence-affirmation"]
    },
    {
      id: "ignite-growth-reframe",
      chain: "ignite-success",
      chapter: "ignite",
      lane: "success",
      order: 2,
      duration: 10,
      focus: "Beliefs",
      title: "Growth Signal Reframe",
      summary: "Take one stuck story and rewrite it as a trainable skill path.",
      why: "The Michigan course publicly highlights growth mindset and talent-as-developed beliefs.",
      steps: [
        "Name one area where you feel behind.",
        "Rewrite the story with 'not yet' or 'I am learning to...'.",
        "Pick one tiny practice move for the next 48 hours."
      ],
      prompts: [
        "What changes when ability feels developable?",
        "What would practice look like if judgment stepped aside?"
      ],
      evidenceTag: "Belief shifts and self-efficacy support persistence.",
      sourceBasis: "Public Michigan module naming growth mindset.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "A rigid story starts to soften at the edges." },
      sources: ["course-success", "evidence-sdt-1"]
    },
    {
      id: "ignite-self-eval",
      chain: "ignite-success",
      chapter: "ignite",
      lane: "success",
      order: 3,
      duration: 12,
      focus: "Confidence",
      title: "Core Self-Evaluation Audit",
      summary: "Check your self-worth, control, steadiness, and confidence, then write one proof statement.",
      why: "Positive core self-evaluations are named directly in the public Michigan overview.",
      steps: [
        "Rate self-worth, self-efficacy, calm under pressure, and sense of influence from 1 to 5.",
        "Choose the lowest area and write a recent moment that shaped it.",
        "Write one grounded proof statement that supports a stronger view."
      ],
      prompts: [
        "Where do you underestimate your influence?",
        "What evidence says you handle difficulty better than your fear admits?"
      ],
      evidenceTag: "Self-reflection plus competence-supportive feedback can increase agency.",
      sourceBasis: "Public Michigan module concepts.",
      recoverySafe: true,
      rewardPayload: { xp: 35, artifact: "Pulse Compass", memory: "The companion archives evidence that you can grow." },
      sources: ["course-success", "evidence-sdt-2"]
    },
    {
      id: "ignite-gratitude-capsule",
      chain: "ignite-wellbeing",
      chapter: "ignite",
      lane: "wellbeing",
      order: 1,
      duration: 8,
      focus: "Gratitude",
      title: "Build a Gratitude Capsule",
      summary: "Collect three specific moments, people, or supports that improved your day this week.",
      why: "Yale's public materials and Yale News both reference gratitude practices and gratitude lists.",
      steps: [
        "List three specific things you are grateful for from the last 7 days.",
        "For each one, add why it mattered rather than naming it only.",
        "Choose one person or place from the list to appreciate more directly."
      ],
      prompts: [
        "What support almost went unnoticed?",
        "Which small good thing deserves a brighter spotlight?"
      ],
      evidenceTag: "Gratitude practices show small but reliable gains in well-being.",
      sourceBasis: "Public Yale rewirement themes and Yale News summary.",
      recoverySafe: true,
      rewardPayload: { xp: 28, artifact: null, memory: "A warm light appears in the archive." },
      sources: ["course-wellbeing", "course-yale-news", "evidence-positive", "evidence-gratitude"]
    },
    {
      id: "ignite-savoring-burst",
      chain: "ignite-wellbeing",
      chapter: "ignite",
      lane: "wellbeing",
      order: 2,
      duration: 10,
      focus: "Savoring",
      title: "Savor One Bright Moment",
      summary: "Stretch one good moment so your attention learns not to rush past it.",
      why: "Public Yale materials explicitly name savoring as a rewirement.",
      steps: [
        "Pick one pleasant moment from today or yesterday.",
        "Spend one minute recalling sensory details, context, and emotion.",
        "Write how you can create or notice a similar moment again this week."
      ],
      prompts: [
        "What did your body notice in that moment?",
        "What made it feel quietly alive rather than merely pleasant?"
      ],
      evidenceTag: "Positive psychology practices help increase attention to positive experience.",
      sourceBasis: "Public Yale rewirement naming savoring.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "The city hum slows enough for one bright frame." },
      sources: ["course-wellbeing", "evidence-positive"]
    },
    {
      id: "ignite-connection-reachout",
      chain: "ignite-wellbeing",
      chapter: "ignite",
      lane: "wellbeing",
      order: 3,
      duration: 12,
      focus: "Connection",
      title: "Send a Human Signal",
      summary: "Reach out with one real message of appreciation, care, or presence.",
      why: "Yale's course publicly emphasizes social connection and gratitude visits.",
      steps: [
        "Pick one person who matters and send a specific message.",
        "Name one thing you value about them or one memory you appreciate.",
        "Notice how reaching out changes your energy before and after."
      ],
      prompts: [
        "Who feels easier to message than your mind is pretending?",
        "What would make the message feel sincere instead of performative?"
      ],
      evidenceTag: "Connection practices support well-being and relatedness.",
      sourceBasis: "Public Yale course and Yale News references to social connection.",
      recoverySafe: true,
      rewardPayload: { xp: 35, artifact: "Gleam Capsule", memory: "The network glows brighter when you signal outward." },
      sources: ["course-wellbeing", "course-yale-news", "evidence-sdt-1"]
    },
    {
      id: "ignite-small-win",
      chain: "ignite-behavior",
      chapter: "ignite",
      lane: "behavior",
      order: 1,
      duration: 8,
      focus: "Activation",
      title: "Launch a Five-Minute Win",
      summary: "Pick one tiny action that counts as movement even on a low-energy day.",
      why: "Wesleyan's public materials highlight behavioral activation and course-long experiments.",
      steps: [
        "Choose one task you have been avoiding.",
        "Shrink it to a five-minute version you can start today.",
        "Do it now or schedule it with a real time and cue."
      ],
      prompts: [
        "What would count as a real but tiny win here?",
        "How can you lower the starting cost without lowering the meaning?"
      ],
      evidenceTag: "Behavioral activation supports action through small, concrete moves.",
      sourceBasis: "Public Wesleyan activity themes.",
      recoverySafe: true,
      rewardPayload: { xp: 28, artifact: null, memory: "The first relay clicks on." },
      sources: ["course-behavior", "evidence-activation"]
    },
    {
      id: "ignite-motivation-interview",
      chain: "ignite-behavior",
      chapter: "ignite",
      lane: "behavior",
      order: 2,
      duration: 12,
      focus: "Motivation",
      title: "Change Talk Interview",
      summary: "Interview yourself so your own reasons for change become clearer than resistance.",
      why: "Wesleyan's public module descriptions reference motivational interviewing.",
      steps: [
        "Write why this behavior matters, even a little.",
        "Write what makes change hard or costly.",
        "End with one sentence beginning 'Despite that, I still want this because...'."
      ],
      prompts: [
        "What matters enough to make effort worthwhile?",
        "What kind of future friction are you trying to spare yourself?"
      ],
      evidenceTag: "Autonomy-supportive motivation works better than pressure.",
      sourceBasis: "Public Wesleyan module naming motivational interviewing.",
      recoverySafe: true,
      rewardPayload: { xp: 32, artifact: null, memory: "Your own voice becomes part of the engine." },
      sources: ["course-behavior", "evidence-sdt-1", "evidence-sdt-2"]
    },
    {
      id: "ignite-implementation-seed",
      chain: "ignite-behavior",
      chapter: "ignite",
      lane: "behavior",
      order: 3,
      duration: 10,
      focus: "Planning",
      title: "Write the If-Then Seed",
      summary: "Turn a hoped-for action into an if-then plan your future self can actually use.",
      why: "Behavior change and action planning are core public themes of the Wesleyan course.",
      steps: [
        "Choose one repeated situation that can become your cue.",
        "Complete this sentence: If __ happens, then I will __.",
        "Place a visible reminder in the environment where the cue appears."
      ],
      prompts: [
        "Which cue already happens reliably?",
        "What version of the action is concrete enough to happen?"
      ],
      evidenceTag: "Implementation intentions reliably improve goal follow-through.",
      sourceBasis: "Public Wesleyan behavior planning themes.",
      recoverySafe: true,
      rewardPayload: { xp: 35, artifact: "Starter Relay", memory: "The system now knows what to do when the moment arrives." },
      sources: ["course-behavior", "evidence-planning"]
    },
    {
      id: "stabilize-restore-audit",
      chain: "stabilize-system",
      chapter: "stabilize",
      lane: "wellbeing",
      order: 1,
      duration: 10,
      focus: "Recovery",
      title: "Restore the System Audit",
      summary: "Check whether sleep, movement, calm, and emotional room are low enough to need a gentler path.",
      why: "Yale's public materials include sleep, meditation, exercise, and well-being rewirements.",
      steps: [
        "Rate sleep, movement, calm, nourishment, and social contact from 1 to 5.",
        "Choose the lowest signal and describe the friction around it.",
        "Pick one recovery move that feels compassionate rather than ambitious."
      ],
      prompts: [
        "What signal looks most depleted right now?",
        "Which recovery move feels possible without willpower theater?"
      ],
      evidenceTag: "Self-monitoring plus feedback supports adaptive rerouting.",
      sourceBasis: "Public Yale rewirement themes.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "The board recognizes depletion without turning it into blame." },
      sources: ["course-wellbeing", "evidence-feedback", "evidence-who5"]
    },
    {
      id: "stabilize-situation-support",
      chain: "stabilize-system",
      chapter: "stabilize",
      lane: "wellbeing",
      order: 2,
      duration: 12,
      focus: "Environment",
      title: "Situation Support Reset",
      summary: "Adjust your environment so the next good move is easier to begin and easier to re-enter.",
      why: "Yale's public materials name situation support, and Wesleyan highlights environment design.",
      steps: [
        "Pick one room, desk, bag, or digital surface that shapes your day.",
        "Remove one source of friction and add one visible support for the next quest.",
        "Write how this setup reduces the cost of restarting."
      ],
      prompts: [
        "What in your environment keeps stealing momentum?",
        "What one visible support would make tomorrow kinder?"
      ],
      evidenceTag: "Environment support and cues reduce reliance on motivation alone.",
      sourceBasis: "Public Yale and Wesleyan descriptions.",
      recoverySafe: true,
      rewardPayload: { xp: 34, artifact: null, memory: "The city gets quieter when the room starts helping." },
      sources: ["course-wellbeing", "course-behavior", "evidence-tailor-1"]
    },
    {
      id: "stabilize-calm-window",
      chain: "stabilize-system",
      chapter: "stabilize",
      lane: "wellbeing",
      order: 3,
      duration: 10,
      focus: "Calm",
      title: "Open a Calm Window",
      summary: "Create a short recovery ritual using breath, stillness, or a mindful pause.",
      why: "Public Yale materials include meditation and mindfulness-related rewirements.",
      steps: [
        "Set a two- to five-minute calm window today.",
        "During that time, focus on breath, body, or a single grounding phrase.",
        "Write what changed in your thoughts, tension, or speed."
      ],
      prompts: [
        "What would it feel like to lower your internal volume for two minutes?",
        "Which grounding phrase feels believable enough to use again?"
      ],
      evidenceTag: "Brief restoration practices can support self-regulation and recovery.",
      sourceBasis: "Public Yale meditation-related rewirement themes.",
      recoverySafe: true,
      rewardPayload: { xp: 35, artifact: "Quiet Cell", memory: "A quieter current runs beneath the neon now." },
      sources: ["course-wellbeing", "course-yale-news", "evidence-feedback"]
    },
    {
      id: "momentum-smart-goal",
      chain: "momentum-behavior",
      chapter: "momentum",
      lane: "behavior",
      order: 1,
      duration: 12,
      focus: "Planning",
      title: "Shape a SMART Movement Goal",
      summary: "Translate a vague wish into a goal you can actually observe this week.",
      why: "Public Wesleyan materials reference SMART goals and a behavior change experiment.",
      steps: [
        "Choose one behavior you want to increase, reduce, or maintain.",
        "Make it specific, measurable, realistic, and time-bounded for the next 7 days.",
        "Define what counts as success before the week begins."
      ],
      prompts: [
        "What version of the goal is clear enough to measure?",
        "What level of success is ambitious but humane?"
      ],
      evidenceTag: "Action planning works better when next steps are concrete.",
      sourceBasis: "Public Wesleyan module references to SMART goals.",
      recoverySafe: true,
      rewardPayload: { xp: 32, artifact: null, memory: "A vague hope becomes a visible route." },
      sources: ["course-behavior", "evidence-planning"]
    },
    {
      id: "momentum-trigger-design",
      chain: "momentum-behavior",
      chapter: "momentum",
      lane: "behavior",
      order: 2,
      duration: 10,
      focus: "Cue design",
      title: "Engineer a Better Trigger",
      summary: "Move one behavior closer to a cue you already trust.",
      why: "Wesleyan's public materials emphasize conditioning, activation, and environment support.",
      steps: [
        "Choose the behavior you want to repeat more often.",
        "Pair it with an existing cue such as coffee, commute, or shutdown time.",
        "Place a visible reminder at the cue location."
      ],
      prompts: [
        "Which cue is stable enough to borrow?",
        "How can your environment become the first reminder?"
      ],
      evidenceTag: "Cue-linked plans and environment design reduce friction.",
      sourceBasis: "Public Wesleyan themes of conditioning and activation.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "The route becomes easier to re-enter because it is waiting for you." },
      sources: ["course-behavior", "evidence-planning", "evidence-feedback"]
    },
    {
      id: "momentum-relapse-plan",
      chain: "momentum-behavior",
      chapter: "momentum",
      lane: "behavior",
      order: 3,
      duration: 12,
      focus: "Recovery planning",
      title: "Write the Recovery Protocol",
      summary: "Plan your return before the next disruption arrives.",
      why: "Public Wesleyan descriptions reference relapse prevention and maintenance.",
      steps: [
        "Name the three most likely things that could interrupt the behavior.",
        "For each one, write a return move that takes under ten minutes.",
        "Choose a phrase you will use instead of self-criticism when you restart."
      ],
      prompts: [
        "What usually knocks you off course?",
        "How would a compassionate system design the restart?"
      ],
      evidenceTag: "Feedback and recovery planning support durable self-regulation.",
      sourceBasis: "Public Wesleyan relapse-prevention themes.",
      recoverySafe: true,
      rewardPayload: { xp: 36, artifact: "Loop Engine", memory: "The map now includes a route home after disruption." },
      sources: ["course-behavior", "evidence-feedback", "evidence-sdt-2"]
    },
    {
      id: "identity-expertise-map",
      chain: "identity-success",
      chapter: "identity",
      lane: "success",
      order: 1,
      duration: 12,
      focus: "Skill",
      title: "Map Meaningful Expertise",
      summary: "Choose a skill area that matters to you and creates value beyond you.",
      why: "Michigan's public materials emphasize expertise as a path to success.",
      steps: [
        "Name one expertise area you want to deepen over the next season.",
        "Write why it matters to you and who it could help.",
        "Break it into two subskills you can practice this month."
      ],
      prompts: [
        "What kind of skill growth would make your future self proud?",
        "Who benefits when you get better at this?"
      ],
      evidenceTag: "Competence and meaningful growth support motivation.",
      sourceBasis: "Public Michigan expertise module description.",
      recoverySafe: true,
      rewardPayload: { xp: 33, artifact: null, memory: "Your work begins to resemble a path instead of a fog." },
      sources: ["course-success", "evidence-sdt-1"]
    },
    {
      id: "identity-grit-boundary",
      chain: "identity-success",
      chapter: "identity",
      lane: "success",
      order: 2,
      duration: 10,
      focus: "Persistence",
      title: "Grit With Boundaries",
      summary: "Separate healthy persistence from stubborn overextension.",
      why: "The public Michigan course references conscientiousness, grit, and longer-run success.",
      steps: [
        "Name one project worth sustained effort.",
        "List signs of healthy persistence and signs you are pushing past usefulness.",
        "Choose one boundary that protects long-term consistency."
      ],
      prompts: [
        "Where does persistence help you most?",
        "Where do you confuse depletion with discipline?"
      ],
      evidenceTag: "Long-term progress works better with recovery-aware persistence.",
      sourceBasis: "Public Michigan grit and conscientiousness themes.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "Strength begins to feel wiser, not harsher." },
      sources: ["course-success", "evidence-feedback"]
    },
    {
      id: "identity-heart-head-hands",
      chain: "identity-success",
      chapter: "identity",
      lane: "success",
      order: 3,
      duration: 14,
      focus: "Integration",
      title: "Heart, Head, Hands Plan",
      summary: "Design one next move that fits emotion, strategy, and action at the same time.",
      why: "Michigan publicly describes a heart-head-hands action plan.",
      steps: [
        "Heart: name why this matters emotionally.",
        "Head: write the smartest next move.",
        "Hands: define the first visible action and when it happens."
      ],
      prompts: [
        "What does your emotional energy want from this change?",
        "What is the smallest action that still respects the strategy?"
      ],
      evidenceTag: "Integrated planning supports intention and follow-through.",
      sourceBasis: "Public Michigan action-plan framing.",
      recoverySafe: true,
      rewardPayload: { xp: 40, artifact: "Forge Key", memory: "The future becomes easier to trust when feeling and action align." },
      sources: ["course-success", "course-michigan-online", "evidence-planning"]
    },
    {
      id: "meaning-kindness-mission",
      chain: "meaning-relationships",
      chapter: "meaning",
      lane: "wellbeing",
      order: 1,
      duration: 10,
      focus: "Kindness",
      title: "Run a Kindness Mission",
      summary: "Choose one concrete act of kindness that is small enough to do and real enough to matter.",
      why: "Public Yale materials include kindness and connection rewirements.",
      steps: [
        "Choose one person, place, or community you can help this week.",
        "Make the act concrete and time-bound.",
        "Afterward, write how the action affected you and the other side."
      ],
      prompts: [
        "What kindness move feels real instead of performative?",
        "How does helping change your own internal weather?"
      ],
      evidenceTag: "Positive actions and connection practices support well-being.",
      sourceBasis: "Public Yale rewirement themes.",
      recoverySafe: true,
      rewardPayload: { xp: 32, artifact: null, memory: "The city answers warmth with warmth." },
      sources: ["course-wellbeing", "evidence-positive", "evidence-sdt-1"]
    },
    {
      id: "meaning-network-map",
      chain: "meaning-relationships",
      chapter: "meaning",
      lane: "wellbeing",
      order: 2,
      duration: 12,
      focus: "Relationships",
      title: "Map Your Human Network",
      summary: "See the people who energize, steady, teach, or care for you, then choose one relationship to strengthen.",
      why: "Michigan publicly references brand and network, while Yale highlights connection and gratitude visits.",
      steps: [
        "List people in four roles: energizers, supporters, teachers, and people you want to know better.",
        "Circle one relationship to strengthen this week.",
        "Choose one simple action to invest in that relationship."
      ],
      prompts: [
        "Who steadies you when your motivation flickers?",
        "Which relationship deserves more intentional care?"
      ],
      evidenceTag: "Relatedness and social support are core motivational and well-being drivers.",
      sourceBasis: "Public Michigan and Yale course themes.",
      recoverySafe: true,
      rewardPayload: { xp: 35, artifact: null, memory: "The map widens beyond solitary effort." },
      sources: ["course-success", "course-wellbeing", "evidence-sdt-1"]
    },
    {
      id: "meaning-gratitude-visit",
      chain: "meaning-relationships",
      chapter: "meaning",
      lane: "wellbeing",
      order: 3,
      duration: 15,
      focus: "Appreciation",
      title: "Compose a Gratitude Visit",
      summary: "Write or deliver a fuller expression of gratitude to someone who has shaped your life.",
      why: "The public Yale course explicitly names the gratitude visit.",
      steps: [
        "Choose a person whose influence still matters to you.",
        "Write what they did, why it mattered, and what stayed with you.",
        "Deliver it directly if possible, or read it aloud privately."
      ],
      prompts: [
        "What gift from this person still lives in you?",
        "What do they deserve to hear in full sentences?"
      ],
      evidenceTag: "Gratitude interventions can increase well-being and meaning.",
      sourceBasis: "Public Yale rewirement naming the gratitude visit.",
      recoverySafe: true,
      rewardPayload: { xp: 40, artifact: "Kindness Beacon", memory: "One message echoes long after it is sent." },
      sources: ["course-wellbeing", "evidence-gratitude", "evidence-positive"]
    },
    {
      id: "sustain-review-scan",
      chain: "sustain-reroute",
      chapter: "sustain",
      lane: "behavior",
      order: 1,
      duration: 10,
      focus: "Review",
      title: "Read the Last Three Signals",
      summary: "Review recent scan history and completions to see where your campaign is actually moving.",
      why: "Self-monitoring with feedback is strongly supported in behavior-change evidence.",
      steps: [
        "Review your recent completions and scan summaries.",
        "Note one pattern that is helping and one that is draining you.",
        "Choose one adjustment for the next week."
      ],
      prompts: [
        "What progress pattern has become visible only with time?",
        "What needs a reroute rather than more force?"
      ],
      evidenceTag: "Self-monitoring plus feedback supports ongoing adaptation.",
      sourceBasis: "Evidence-grounded reflection layer for all three course paths.",
      recoverySafe: true,
      rewardPayload: { xp: 30, artifact: null, memory: "Patterns become legible when you stop rushing past them." },
      sources: ["evidence-feedback", "evidence-tailor-2"]
    },
    {
      id: "sustain-mystery-rewirement",
      chain: "sustain-reroute",
      chapter: "sustain",
      lane: "behavior",
      order: 2,
      duration: 12,
      focus: "Experiment",
      title: "Run a Mystery Rewirement",
      summary: "Choose one evidence-backed practice you have neglected and run it as a one-week experiment.",
      why: "Yale publicly names a mystery rewirement and final challenge structure.",
      steps: [
        "Choose one neglected practice: gratitude, movement, meditation, social reach-out, or small planning.",
        "Define what 'done' means for one week.",
        "At the end, rate whether to keep, adapt, or retire it."
      ],
      prompts: [
        "Which helpful practice keeps hovering at the edge of your life?",
        "What would make the experiment easier to judge honestly?"
      ],
      evidenceTag: "Experiment framing supports learning without shame.",
      sourceBasis: "Public Yale mystery rewirement plus evidence-based experimentation logic.",
      recoverySafe: true,
      rewardPayload: { xp: 34, artifact: null, memory: "Curiosity takes over where perfection used to stand." },
      sources: ["course-wellbeing", "course-behavior", "evidence-narrative"]
    },
    {
      id: "sustain-next-season",
      chain: "sustain-reroute",
      chapter: "sustain",
      lane: "behavior",
      order: 3,
      duration: 14,
      focus: "Adaptation",
      title: "Design the Next Season",
      summary: "Use what you learned to choose the next arc, intensity, and humane baseline for yourself.",
      why: "All three public courses ultimately point toward applying evidence to your own life going forward.",
      steps: [
        "Name one practice to keep, one to deepen, and one to pause.",
        "Choose your next focus lane based on your latest scan and lived experience.",
        "Write the one sentence that will guide your next season."
      ],
      prompts: [
        "What deserves to continue because it truly helped?",
        "What kind of pace would make your next season sustainable?"
      ],
      evidenceTag: "Tailored adaptation beats rigid one-size-fits-all progression.",
      sourceBasis: "Evidence-based synthesis layered over public course themes.",
      recoverySafe: true,
      rewardPayload: { xp: 42, artifact: "Route Prism", memory: "You stop asking for perfect momentum and start building return." },
      sources: ["evidence-tailor-1", "evidence-tailor-2", "evidence-feedback"]
    }
  ];

  const questTemplateMap = {
    "ignite-values-scan": {
      questTemplate: "triple_reflection",
      questFields: {
        firstLabel: "Success at work",
        secondLabel: "Success in career",
        thirdLabel: "Success in wider life",
        choiceLabel: "Which one feels most alive right now?",
        actionLabel: "One behavior this week that fits that definition"
      }
    },
    "success-define-success": {
      questTemplate: "triple_reflection",
      questFields: {
        firstLabel: "Success at work",
        secondLabel: "Success in career",
        thirdLabel: "Success in wider life",
        choiceLabel: "Which one feels most alive right now?",
        actionLabel: "One behavior this week that fits that definition"
      }
    },
    "success-myth-audit": {
      questTemplate: "belief_reframe",
      questFields: {
        sourceLabel: "Limiting or inherited belief",
        reframeLabel: "Evidence-friendly reframe",
        nextLabel: "One experiment to test the new belief"
      }
    },
    "ignite-growth-reframe": {
      questTemplate: "belief_reframe",
      questFields: {
        sourceLabel: "Stuck story",
        reframeLabel: "Growth-minded reframe",
        nextLabel: "Next practice move"
      }
    },
    "success-growth-reframe": {
      questTemplate: "belief_reframe",
      questFields: {
        sourceLabel: "Stuck story",
        reframeLabel: "Growth-minded reframe",
        nextLabel: "Next practice move"
      }
    },
    "ignite-self-eval": {
      questTemplate: "rating_audit",
      questFields: {
        ratings: ["Self-worth", "Confidence", "Emotional steadiness", "Sense of control"],
        weakestLabel: "Lowest area right now",
        actionLabel: "One proof statement or strengthening move"
      }
    },
    "success-core-self-evaluations": {
      questTemplate: "rating_audit",
      questFields: {
        ratings: ["Self-worth", "Confidence", "Emotional steadiness", "Sense of control"],
        weakestLabel: "Lowest area right now",
        actionLabel: "One proof statement or strengthening move"
      }
    },
    "ignite-small-win": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "Tiny win to attempt",
        cueLabel: "When / cue",
        fallbackLabel: "Fallback if the day gets hard",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "ignite-motivation-interview": {
      questTemplate: "review_template",
      questFields: {
        helpedLabel: "Why this change matters",
        hardLabel: "What makes it hard",
        changedLabel: "What you still want despite that",
        askLabel: "What support would help?"
      }
    },
    "ignite-implementation-seed": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "If-then plan",
        cueLabel: "Reliable cue",
        fallbackLabel: "Fallback version",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "stabilize-restore-audit": {
      questTemplate: "rating_audit",
      questFields: {
        ratings: ["Sleep", "Movement", "Calm", "Nourishment"],
        weakestLabel: "Lowest signal",
        actionLabel: "Most compassionate recovery move"
      }
    },
    "stabilize-situation-support": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "Supportive change to environment",
        cueLabel: "Where it will live",
        fallbackLabel: "Smallest version",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "stabilize-calm-window": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "Calm window ritual",
        cueLabel: "When it will happen",
        fallbackLabel: "Shortest version you can still do",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "momentum-smart-goal": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "SMART goal",
        cueLabel: "When / how you will track it",
        fallbackLabel: "Recovery version if you miss a day",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "momentum-trigger-design": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "Behavior to repeat",
        cueLabel: "Existing cue",
        fallbackLabel: "Smallest version",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "momentum-relapse-plan": {
      questTemplate: "planning_commitment",
      questFields: {
        planLabel: "Most likely interruption",
        cueLabel: "Recovery cue",
        fallbackLabel: "Fast return move",
        confidenceLabel: "How confident do you feel?"
      }
    },
    "ignite-gratitude-capsule": {
      questTemplate: "gratitude_connection",
      questFields: {
        targetLabel: "Person / moment / support",
        meaningLabel: "Why it mattered",
        actionLabel: "How you will honor or revisit it"
      }
    },
    "ignite-savoring-burst": {
      questTemplate: "gratitude_connection",
      questFields: {
        targetLabel: "Bright moment",
        meaningLabel: "What made it feel alive",
        actionLabel: "How to create or notice it again"
      }
    },
    "ignite-connection-reachout": {
      questTemplate: "gratitude_connection",
      questFields: {
        targetLabel: "Person to reach out to",
        meaningLabel: "What you want to say",
        actionLabel: "How / when you will send it"
      }
    },
    "meaning-kindness-mission": {
      questTemplate: "gratitude_connection",
      questFields: {
        targetLabel: "Kindness target",
        meaningLabel: "Why this matters",
        actionLabel: "Kindness action"
      }
    },
    "meaning-network-map": {
      questTemplate: "triple_reflection",
      questFields: {
        firstLabel: "Supporters",
        secondLabel: "Teachers",
        thirdLabel: "People to know better",
        choiceLabel: "Which relationship needs attention first?",
        actionLabel: "One action to strengthen it"
      }
    },
    "meaning-gratitude-visit": {
      questTemplate: "gratitude_connection",
      questFields: {
        targetLabel: "Person to thank",
        meaningLabel: "What they gave you",
        actionLabel: "How you will deliver the message"
      }
    }
  };

  const enrichedQuests = quests.map((quest) => ({
    ...quest,
    questTemplate: (questTemplateMap[quest.id] && questTemplateMap[quest.id].questTemplate) || "review_template",
    questFields: (questTemplateMap[quest.id] && questTemplateMap[quest.id].questFields) || {
      helpedLabel: "What stands out from this quest?",
      hardLabel: "What feels difficult or unclear?",
      changedLabel: "What might you try next?",
      askLabel: "What support would help?"
    }
  }));

  return {
    sources,
    programs,
    diagnosticOptions,
    diagnosticSurvey,
    chapters,
    chains,
    quests: enrichedQuests
  };
})();
