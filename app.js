const STORAGE_KEY = "being-app-state-v1";
const SESSION_KEY = "being-app-session-v1";

const SOURCES = [
  {
    id: "src-success-coursera",
    title: "The Science of Success: What Researchers Know that You Should Know",
    publisher: "Coursera / University of Michigan",
    url: "https://www.coursera.org/learn/success",
    note:
      "Public module descriptions mention reflection on what success means, growth mindset, positive core self-evaluations, expertise, conscientiousness and grit, brand and network assessment, and a heart-head-hands action plan.",
  },
  {
    id: "src-behavior-coursera",
    title: "Creating Behavioral Change",
    publisher: "Coursera / Wesleyan University",
    url: "https://www.coursera.org/learn/behavioral-change",
    note:
      "Public module descriptions specify a course-long behavior change experiment and activities linked to conditioning, motivational interviewing, behavioral activation, SMART goals, relapse prevention, and environment design.",
  },
  {
    id: "src-wellbeing-coursera",
    title: "The Science of Well-Being",
    publisher: "Coursera / Yale University",
    url: "https://www.coursera.org/learn/the-science-of-well-being",
    note:
      "Public module descriptions and reading titles name rewirements around savoring, gratitude, kindness, social connection, exercise, sleep, meditation, gratitude visit, situation support, goal setting, mystery rewirement, and final reflection.",
  },
  {
    id: "src-yale-news",
    title: "How to gain a sense of well-being, free and online",
    publisher: "Yale News",
    url: "https://news.yale.edu/2021/04/14/how-gain-sense-well-being-free-and-online",
    note:
      "Yale News reports that the course homework includes nurturing social connections, compiling a gratitude list, meditation, improving sleep patterns, and developing exercise routines.",
  },
  {
    id: "src-who5",
    title: "The World Health Organization-Five Well-Being Index (WHO-5)",
    publisher: "World Health Organization",
    url: "https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf",
    note:
      "Official WHO documentation for the WHO-5 well-being index, a short validated questionnaire often used for well-being screening and monitoring.",
  },
];

const PROGRAMS = {
  success: {
    id: "success",
    name: "The Science of Success",
    school: "University of Michigan",
    summary: "Beliefs, expertise, relationships, and action plans",
  },
  behavior: {
    id: "behavior",
    name: "Creating Behavioral Change",
    school: "Wesleyan University",
    summary: "Behavior experiments, motivation, activation, and maintenance",
  },
  wellbeing: {
    id: "wellbeing",
    name: "The Science of Well-Being",
    school: "Yale University",
    summary: "Rewirements for gratitude, connection, sleep, movement, and mind",
  },
};

const DIAGNOSTIC_OPTIONS = [
  { value: 0, label: "At no time" },
  { value: 1, label: "Some of the time" },
  { value: 2, label: "Less than half" },
  { value: 3, label: "More than half" },
  { value: 4, label: "Most of the time" },
  { value: 5, label: "All of the time" },
];

const DIAGNOSTIC_SURVEY = [
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
    id: "route_plans",
    group: "Course routing",
    prompt: "When motivation drops, I can still stick to a small plan.",
    help: "Points toward Creating Behavioral Change when low.",
  },
  {
    id: "route_environment",
    group: "Course routing",
    prompt: "My environment makes good habits easier rather than harder.",
    help: "Points toward Creating Behavioral Change when low.",
  },
  {
    id: "route_growth",
    group: "Course routing",
    prompt: "I usually believe I can grow and improve with effort and practice.",
    help: "Points toward The Science of Success when low.",
  },
  {
    id: "route_connection",
    group: "Course routing",
    prompt: "I feel supported, connected, and able to reach out to people who matter.",
    help: "Points toward relationship and well-being work when low.",
  },
  {
    id: "route_restoration",
    group: "Course routing",
    prompt: "I am making enough space for sleep, movement, gratitude, or mindfulness to feel restored.",
    help: "Points toward The Science of Well-Being when low.",
  },
];

const EXERCISES = [
  {
    id: "success-define-success",
    program: "success",
    module: "Introduction",
    title: "Define Success on Three Levels",
    focus: "Reflection",
    duration: 10,
    cadence: "once",
    tags: ["values", "career", "life"],
    sourceMode: "Publicly named",
    summary:
      "Clarify what success means at work, in your career, and in your wider life.",
    why:
      "The public course page explicitly says learners are invited to think carefully about what success means in work, career, and a happy, healthy life.",
    steps: [
      "Write one sentence each for success at work, career success, and success in life.",
      "Circle the statement that matters most right now.",
      "Name one behavior you can do this week that would move you toward that definition.",
    ],
    prompts: [
      "What would meaningful work feel like this month?",
      "If your personal life felt healthier and happier, what would be different first?",
    ],
    inference:
      "This adapts the public reflection prompt into a short guided exercise rather than reproducing any course worksheet.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-myth-audit",
    program: "success",
    module: "Introduction",
    title: "Success Myths Audit",
    focus: "Beliefs",
    duration: 8,
    cadence: "once",
    tags: ["mindset", "myths", "reflection"],
    sourceMode: "Adapted from module description",
    summary:
      "Spot the ideas about talent, IQ, or fixed potential that may be quietly steering your choices.",
    why:
      "The course introduction highlights myths about success and the idea that talent is made, not born.",
    steps: [
      "List three success beliefs you absorbed from school, work, or family.",
      "Mark each belief as helpful, limiting, or unclear.",
      "Rewrite one limiting belief into a more evidence-friendly version.",
    ],
    prompts: [
      "Which belief keeps you playing too safe?",
      "What would you try if ability felt more developable than fixed?",
    ],
    inference:
      "The public page names the myths but not a precise worksheet, so this is an adapted myth-audit format.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-growth-reframe",
    program: "success",
    module: "The Power of Beliefs",
    title: "Growth Mindset Reframe",
    focus: "Mindset",
    duration: 10,
    cadence: "weekly",
    tags: ["growth mindset", "setback", "learning"],
    sourceMode: "Publicly named",
    summary:
      "Turn a current frustration into a learning experiment by using growth-minded language.",
    why:
      "Growth mindset is called out directly in the public module description.",
    steps: [
      "Name one area where you feel stuck or behind.",
      "Rewrite the story using the phrase 'I am learning to...' or 'not yet'.",
      "Pick one experiment you can run in the next 48 hours to practice rather than judge.",
    ],
    prompts: [
      "What skill would improve if you treated ability as trainable?",
      "What does progress look like before mastery appears?",
    ],
    inference:
      "The exercise follows the module's public emphasis on growth mindset without copying any hidden assignment text.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-core-self-evaluations",
    program: "success",
    module: "The Power of Beliefs",
    title: "Core Self-Evaluations Audit",
    focus: "Self-assessment",
    duration: 12,
    cadence: "monthly",
    tags: ["self-esteem", "efficacy", "agency"],
    sourceMode: "Publicly named",
    summary:
      "Rate your self-worth, confidence, emotional steadiness, and sense of control.",
    why:
      "Positive core self-evaluations are named directly in the public module overview.",
    steps: [
      "Rate self-worth, self-efficacy, emotional steadiness, and internal control from 1 to 5.",
      "Pick the lowest area and describe a recent moment that shaped it.",
      "Write one small proof statement that supports a stronger view of yourself.",
    ],
    prompts: [
      "Where do you underestimate your own influence?",
      "What evidence suggests you handle hard things better than you think?",
    ],
    inference:
      "This turns the named concept into a practical self-audit for daily use.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-expertise-map",
    program: "success",
    module: "The Power of Expertise",
    title: "Meaningful Expertise Map",
    focus: "Skill building",
    duration: 12,
    cadence: "once",
    tags: ["expertise", "purpose", "contribution"],
    sourceMode: "Publicly named",
    summary:
      "Choose an expertise area that matters to you and creates value for other people.",
    why:
      "The public page says learners explore expertise that is meaningful personally and contributes to others.",
    steps: [
      "Name one expertise area you want to deepen in the next six months.",
      "Write who benefits if you become better at it.",
      "Break the expertise into three subskills you could train separately.",
    ],
    prompts: [
      "Why does this expertise matter beyond achievement alone?",
      "Which part of the skill is currently the real bottleneck?",
    ],
    inference:
      "This is a structured version of the public expertise reflection described on the course page.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-deliberate-practice",
    program: "success",
    module: "The Power of Expertise",
    title: "Deliberate Practice Sprint",
    focus: "Practice design",
    duration: 15,
    cadence: "weekly",
    tags: ["practice", "feedback", "repetition"],
    sourceMode: "Adapted from module description",
    summary:
      "Design a short practice block around one narrow subskill instead of vague repetition.",
    why:
      "The module publicly discusses how expertise is built and how learners can apply those lessons themselves.",
    steps: [
      "Choose one subskill that is specific enough to improve in 20 minutes.",
      "Define what success for the sprint looks like.",
      "Run the sprint, then write one thing to keep and one thing to adjust.",
    ],
    prompts: [
      "What kind of feedback would make this practice sharper?",
      "How can you make the next repetition more precise than the last one?",
    ],
    inference:
      "The public page does not provide a full deliberate-practice worksheet, so this is an evidence-aligned adaptation.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-mental-model-builder",
    program: "success",
    module: "The Power of Expertise",
    title: "Chunk and Mental Model Builder",
    focus: "Learning",
    duration: 10,
    cadence: "weekly",
    tags: ["mental representations", "chunks", "memory"],
    sourceMode: "Adapted from module description",
    summary:
      "Organize a skill into chunks so your understanding becomes easier to retrieve and apply.",
    why:
      "The public module overview references mental representations and chunks as part of expertise development.",
    steps: [
      "Take a skill you are learning and divide it into three to five chunks.",
      "For each chunk, write the key pattern or rule you want to remember.",
      "Explain the full process back to yourself in simple language.",
    ],
    prompts: [
      "What pattern repeats across different examples of this skill?",
      "Which chunk still feels fuzzy or overloaded?",
    ],
    inference:
      "This exercise translates the public concepts of chunks and mental representations into a simple learning template.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-conscientiousness-audit",
    program: "success",
    module: "The Power of Persistence",
    title: "Conscientiousness Audit",
    focus: "Personality patterns",
    duration: 8,
    cadence: "monthly",
    tags: ["conscientiousness", "follow-through", "organization"],
    sourceMode: "Publicly named",
    summary:
      "Check how consistently you plan, follow through, and close loops.",
    why:
      "The public page says learners can assess their own conscientiousness and grit.",
    steps: [
      "Rate planning, reliability, organization, and completion from 1 to 5.",
      "Choose the lowest area and describe its most common friction point.",
      "Pick one system change that would make follow-through easier this week.",
    ],
    prompts: [
      "Where do you start strongly but finish weakly?",
      "What structural fix would help more than willpower alone?",
    ],
    inference:
      "This is a practical self-check built from the public module description.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-grit-plan",
    program: "success",
    module: "The Power of Persistence",
    title: "Grit and Delay Plan",
    focus: "Persistence",
    duration: 10,
    cadence: "weekly",
    tags: ["grit", "delay of gratification", "perseverance"],
    sourceMode: "Publicly named",
    summary:
      "Pick a worthwhile long game and protect it from short-term distractions.",
    why:
      "The public description ties persistence to grit and the ability to delay gratification.",
    steps: [
      "Name one longer-term aim that matters more than immediate comfort.",
      "List the short-term reward that usually pulls you off course.",
      "Write one replacement response for the next time that pull shows up.",
    ],
    prompts: [
      "What future benefit is worth a little discomfort now?",
      "What cue tells you the short-term temptation is arriving?",
    ],
    inference:
      "This adapts the public persistence themes into an implementation-oriented exercise.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-brand-lab",
    program: "success",
    module: "The Power of Relationships",
    title: "Brand and Energizer Lab",
    focus: "Relationships",
    duration: 12,
    cadence: "monthly",
    tags: ["brand", "relationships", "energy"],
    sourceMode: "Publicly named",
    summary:
      "Clarify how you want to show up and whether your behavior energizes other people.",
    why:
      "The public module description explicitly mentions thinking about your brand and learning to become an energizer.",
    steps: [
      "Write three words you want other people to associate with you.",
      "List one behavior that supports each word and one behavior that undercuts it.",
      "Choose one energizing habit to practice in your next important interaction.",
    ],
    prompts: [
      "What feeling do you most want people to have after interacting with you?",
      "Which of your habits drains energy even when your intention is good?",
    ],
    inference:
      "The exercise combines two named public themes from the relationship module into a single practical lab.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-network-map",
    program: "success",
    module: "The Power of Relationships",
    title: "Network Map and Scorecard",
    focus: "Social capital",
    duration: 15,
    cadence: "monthly",
    tags: ["network", "social capital", "relationships"],
    sourceMode: "Publicly named",
    summary:
      "Map your current network and assess it by size, structure, diversity, and strength.",
    why:
      "Those four criteria are listed explicitly on the public course page.",
    steps: [
      "Write the names of key people in your work, learning, and personal circles.",
      "Score the network on size, structure, diversity, and relationship strength from 1 to 5.",
      "Identify one connection to deepen and one gap to intentionally fill.",
    ],
    prompts: [
      "Where is your network too narrow or too same-same?",
      "Which relationship has more potential than you are currently using?",
    ],
    inference:
      "This uses the exact public criteria and turns them into a reusable scorecard.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-heart-head-hands",
    program: "success",
    module: "The Power of a Plan",
    title: "Heart, Head, Hands Plan",
    focus: "Action planning",
    duration: 15,
    cadence: "weekly",
    tags: ["planning", "values", "next steps"],
    sourceMode: "Publicly named",
    summary:
      "Create a plan anchored in what matters, what you will focus on, and what you will do next.",
    why:
      "The public page states that the action plan has three parts: heart, head, and hands.",
    steps: [
      "Heart: write what matters most to you in this season of life.",
      "Head: choose the one area you will focus on in the short term.",
      "Hands: list the concrete actions you will take this week.",
    ],
    prompts: [
      "What focus area would create the highest ripple effect if improved first?",
      "What is one action small enough to complete even on a low-energy day?",
    ],
    inference:
      "This is a direct adaptation of the action-plan structure named publicly by the course page.",
    sources: ["src-success-coursera"],
  },
  {
    id: "success-small-wins-reset",
    program: "success",
    module: "The Power of a Plan",
    title: "Small Wins Reset",
    focus: "Resilience",
    duration: 8,
    cadence: "weekly",
    tags: ["resilience", "self-compassion", "small wins"],
    sourceMode: "Publicly named",
    summary:
      "Recover from a setback by shrinking the next step and adding self-compassion.",
    why:
      "The public module description highlights small wins, resilience, and self-compassion after setbacks.",
    steps: [
      "Describe the setback in one sentence without blame language.",
      "Name the smallest useful next move you can take today.",
      "Write one self-compassion sentence you would say to a friend in the same spot.",
    ],
    prompts: [
      "What is the smallest move that still counts as momentum?",
      "How would you speak to yourself if shame was not invited into the conversation?",
    ],
    inference:
      "This practice keeps the public themes intact while using fresh wording and structure.",
    sources: ["src-success-coursera"],
  },
  {
    id: "behavior-target-baseline",
    program: "behavior",
    module: "Course-long experiment",
    title: "Choose a Target Behavior and Baseline",
    focus: "Experiment design",
    duration: 12,
    cadence: "once",
    tags: ["behavior", "baseline", "tracking"],
    sourceMode: "Publicly named",
    summary:
      "Pick one mental or physical health behavior to change and document where you are starting.",
    why:
      "The public course description says learners engage in a course-long behavior change experiment.",
    steps: [
      "Choose one specific behavior to increase, reduce, or stabilize.",
      "Write how often it happens now, where it happens, and what usually triggers it.",
      "Define the first measurable target for the next seven days.",
    ],
    prompts: [
      "What behavior is small enough to change yet meaningful enough to matter?",
      "How will you know a week from now whether anything shifted?",
    ],
    inference:
      "This creates a reusable baseline worksheet from the publicly described course-long experiment.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-abc-map",
    program: "behavior",
    module: "Conditioning",
    title: "Antecedent, Behavior, Consequence Map",
    focus: "Behavior analysis",
    duration: 10,
    cadence: "weekly",
    tags: ["conditioning", "abc", "cue"],
    sourceMode: "Adapted from module description",
    summary:
      "Map what comes before the behavior, the behavior itself, and what follows it.",
    why:
      "The conditioning module publicly signals a behaviorist foundation, which naturally maps to an ABC analysis.",
    steps: [
      "Write the trigger or context that usually comes before the behavior.",
      "Describe the behavior in visible, countable terms.",
      "List the short-term consequence that may be rewarding the pattern.",
    ],
    prompts: [
      "What payoff might be stronger than your stated intention?",
      "Which part of the sequence is easiest to change first?",
    ],
    inference:
      "The public page names the topic area but not this exact format, so the ABC map is an adaptation.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-reinforcement-redesign",
    program: "behavior",
    module: "Conditioning",
    title: "Reinforcement Redesign",
    focus: "Rewards",
    duration: 8,
    cadence: "weekly",
    tags: ["reward", "reinforcement", "habit"],
    sourceMode: "Adapted from module description",
    summary:
      "Add a fast reward to the behavior you want and weaken the reward around the one you do not.",
    why:
      "Conditioning and behavior change often hinge on what gets rewarded in the short term.",
    steps: [
      "Name the healthy behavior you want to reinforce.",
      "Pick a small immediate reward you can pair with it.",
      "Reduce the reward or convenience attached to the old behavior.",
    ],
    prompts: [
      "What reward is small, ethical, and actually motivating for you?",
      "Which unwanted behavior is secretly too easy or too comforting right now?",
    ],
    inference:
      "This exercise is an applied conditioning prompt inspired by the public module theme.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-cue-friction-scan",
    program: "behavior",
    module: "Conditioning",
    title: "Cue and Friction Scan",
    focus: "Environment",
    duration: 8,
    cadence: "weekly",
    tags: ["cues", "friction", "setup"],
    sourceMode: "Adapted from module description",
    summary:
      "Make the desired behavior easier to notice and easier to start.",
    why:
      "Even before the final environment module, behavioral change depends on cues and starting friction.",
    steps: [
      "List the visual, time, social, or emotional cues linked to your target behavior.",
      "Choose one cue to add for the desired behavior.",
      "Choose one friction point to remove so starting feels smaller.",
    ],
    prompts: [
      "What reminder would appear exactly when the behavior is easiest to do?",
      "What tiny barrier is still large enough to stop you?",
    ],
    inference:
      "This is an implementation-friendly version of the conditioning logic implied by the course page.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-decisional-balance",
    program: "behavior",
    module: "Motivational interviewing",
    title: "Decisional Balance",
    focus: "Motivation",
    duration: 12,
    cadence: "monthly",
    tags: ["motivation", "ambivalence", "MI"],
    sourceMode: "Publicly named",
    summary:
      "Lay out the pros and cons of changing and of staying the same.",
    why:
      "Motivational interviewing is named publicly in the course overview and decisional balance is a standard MI-aligned exercise.",
    steps: [
      "Create four columns: benefits of change, costs of change, benefits of staying the same, costs of staying the same.",
      "Fill each column honestly and without trying to sound impressive.",
      "Underline the reasons that feel most emotionally true, not just most logical.",
    ],
    prompts: [
      "What do you still get from the current behavior?",
      "Which cost of staying the same now feels too expensive to ignore?",
    ],
    inference:
      "This exercise is not quoted from the course, but it is a direct MI-consistent adaptation of the public module topic.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-rulers",
    program: "behavior",
    module: "Motivational interviewing",
    title: "Importance and Confidence Rulers",
    focus: "Motivation",
    duration: 6,
    cadence: "weekly",
    tags: ["confidence", "importance", "MI"],
    sourceMode: "Adapted from module description",
    summary:
      "Rate how important change feels and how confident you are that you can do it.",
    why:
      "Motivational interviewing frequently uses scaling questions to unlock change talk and practical planning.",
    steps: [
      "Rate importance from 1 to 10.",
      "Rate confidence from 1 to 10.",
      "For the lower score, answer: what would raise it by one point this week?",
    ],
    prompts: [
      "Why is the score not lower?",
      "What would make the next step feel more possible right now?",
    ],
    inference:
      "The public page names motivational interviewing, and this is a standard adaptation from that toolkit.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-change-talk",
    program: "behavior",
    module: "Motivational interviewing",
    title: "Change Talk Script",
    focus: "Commitment",
    duration: 8,
    cadence: "weekly",
    tags: ["change talk", "language", "commitment"],
    sourceMode: "Adapted from module description",
    summary:
      "Put your own reasons for change into language that sounds like you.",
    why:
      "Motivational interviewing centers the person's own reasons and readiness for change.",
    steps: [
      "Write one sentence for desire, ability, reasons, and need.",
      "Turn those lines into a short paragraph you can reread before a difficult moment.",
      "End with a commitment sentence for the next 24 hours.",
    ],
    prompts: [
      "Why does this change matter to you personally?",
      "What proof do you already have that change is possible?",
    ],
    inference:
      "This is a fresh exercise built from the public MI module theme.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-activation-brainstorm",
    program: "behavior",
    module: "Behavioral activation",
    title: "Activation Brainstorm",
    focus: "Mood and momentum",
    duration: 10,
    cadence: "weekly",
    tags: ["activation", "mood", "energy"],
    sourceMode: "Publicly named",
    summary:
      "Brainstorm actions that create pleasure, mastery, or connection even when motivation is low.",
    why:
      "Behavioral activation is named directly on the public course page.",
    steps: [
      "List five actions that bring pleasure, five that build mastery, and five that create connection.",
      "Star the three actions that are easiest to start on a rough day.",
      "Choose one action to schedule in the next 24 hours.",
    ],
    prompts: [
      "What action is tiny but reliably shifts your state?",
      "Which activities help even when you do not feel like doing them first?",
    ],
    inference:
      "This is an activation menu derived from the named public module topic.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-smart-goal",
    program: "behavior",
    module: "Behavioral activation to SMART goals",
    title: "Turn It into a SMART Behavior",
    focus: "Goal setting",
    duration: 10,
    cadence: "weekly",
    tags: ["SMART", "goal", "behavior"],
    sourceMode: "Publicly named",
    summary:
      "Convert a vague intention into a specific behavioral target.",
    why:
      "The public module description explicitly mentions moving from behavioral activation to SMART goals.",
    steps: [
      "Take one desired change and make it specific, measurable, achievable, relevant, and time-bound.",
      "Rewrite it as an observable behavior rather than a mood outcome.",
      "Check whether you could tell by Friday if you did it or not.",
    ],
    prompts: [
      "Is the goal small enough to be testable this week?",
      "What part of the goal is still too abstract?",
    ],
    inference:
      "This follows the publicly named SMART-goal thread directly.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-action-schedule",
    program: "behavior",
    module: "Behavioral activation to SMART goals",
    title: "Action Schedule and Trigger Plan",
    focus: "Planning",
    duration: 8,
    cadence: "weekly",
    tags: ["schedule", "trigger", "planning"],
    sourceMode: "Adapted from module description",
    summary:
      "Choose the exact time, place, and trigger for the behavior you want to repeat.",
    why:
      "Behavior change sticks better when the action is attached to a concrete context rather than good intentions.",
    steps: [
      "Write when, where, and after what cue the behavior will happen.",
      "Shrink the first version until it feels almost too easy.",
      "Add one backup option for the days the ideal plan falls apart.",
    ],
    prompts: [
      "What cue already happens reliably in your day?",
      "What backup version would still let you keep the streak alive?",
    ],
    inference:
      "The public page does not expose the exact planning worksheet, so this is an adapted trigger-plan format.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-relapse-plan",
    program: "behavior",
    module: "Relapse prevention",
    title: "Relapse Prevention Map",
    focus: "Maintenance",
    duration: 12,
    cadence: "monthly",
    tags: ["relapse", "prevention", "risk"],
    sourceMode: "Publicly named",
    summary:
      "Anticipate the situations most likely to knock you off course and plan your response now.",
    why:
      "Relapse prevention is named directly in the public module listing.",
    steps: [
      "List the top three situations that tend to derail your behavior change.",
      "Write the earliest warning sign for each one.",
      "Create a specific response script for each risk moment.",
    ],
    prompts: [
      "What pattern tends to show up before you slide, not after?",
      "Who or what could help you recover faster next time?",
    ],
    inference:
      "This is a reusable planning format built from the publicly named relapse-prevention module.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-environment-redesign",
    program: "behavior",
    module: "Environment and motivations",
    title: "Environment Redesign",
    focus: "Choice architecture",
    duration: 10,
    cadence: "monthly",
    tags: ["environment", "choice architecture", "motivation"],
    sourceMode: "Publicly named",
    summary:
      "Change the default environment so the better choice needs less effort.",
    why:
      "The final public module references environment and motivations, including Dan Ariely.",
    steps: [
      "Choose one place where the current setup nudges the wrong behavior.",
      "Change one default, one visible cue, and one convenience factor.",
      "Review the new setup after two days and keep only what actually helped.",
    ],
    prompts: [
      "What in your environment is currently deciding for you?",
      "How can the best option become the easiest option?",
    ],
    inference:
      "This converts the public environment-and-motivation theme into a direct redesign exercise.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "behavior-maintenance-review",
    program: "behavior",
    module: "Re-evaluating gains",
    title: "Maintenance Review",
    focus: "Reflection",
    duration: 8,
    cadence: "monthly",
    tags: ["review", "progress", "maintenance"],
    sourceMode: "Publicly named",
    summary:
      "Review what changed, what still feels fragile, and what support the new behavior needs.",
    why:
      "The public course page mentions re-evaluating gains after the behavior change experiment.",
    steps: [
      "Write what improved, even if the shift was small.",
      "Name what still feels unstable or inconsistent.",
      "Choose one support to keep using for another week.",
    ],
    prompts: [
      "What gain are you most likely to overlook if you only think in all-or-nothing terms?",
      "What support matters enough to keep after the initial motivation fades?",
    ],
    inference:
      "This adapts the public re-evaluation theme into a concise monthly review.",
    sources: ["src-behavior-coursera"],
  },
  {
    id: "wellbeing-baseline-strengths",
    program: "wellbeing",
    module: "Introduction",
    title: "Happiness Baseline and Strengths Snapshot",
    focus: "Self-awareness",
    duration: 10,
    cadence: "monthly",
    tags: ["baseline", "strengths", "well-being"],
    sourceMode: "Publicly named",
    summary:
      "Capture your current well-being and the personal strengths you can lean on.",
    why:
      "The public introduction includes a reading called 'Measure Your Happiness and Discover Your Strengths'.",
    steps: [
      "Rate your current overall well-being from 1 to 10.",
      "Write three strengths you are most ready to use this week.",
      "Choose one strength that could support a rewirement challenge.",
    ],
    prompts: [
      "What strength do you use too rarely when you are stressed?",
      "What would feeling one point better actually look like in behavior?",
    ],
    inference:
      "This is a direct adaptation of the public baseline-and-strengths framing.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-savoring",
    program: "wellbeing",
    module: "Misconceptions About Happiness",
    title: "Savoring Pause",
    focus: "Attention",
    duration: 5,
    cadence: "daily",
    tags: ["savoring", "attention", "present moment"],
    sourceMode: "Publicly named",
    summary:
      "Slow down and deliberately stay with one good experience for a little longer.",
    why:
      "A public course reading is explicitly titled 'Savoring & Gratitude'.",
    steps: [
      "Choose one pleasant moment from today, even if it was small.",
      "Replay the sights, sounds, feelings, and details for 20 to 30 seconds.",
      "Write what made the moment good and how you could notice it more often.",
    ],
    prompts: [
      "Which tiny moment would usually disappear if you did not pause for it?",
      "What detail became richer when you gave it more attention?",
    ],
    inference:
      "This uses the public savoring theme and turns it into a short daily practice.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-gratitude-list",
    program: "wellbeing",
    module: "Misconceptions About Happiness",
    title: "Gratitude List",
    focus: "Appreciation",
    duration: 6,
    cadence: "daily",
    tags: ["gratitude", "journal", "rewirement"],
    sourceMode: "Publicly named",
    summary:
      "List what you appreciate today in concrete, specific language.",
    why:
      "Gratitude is named publicly in course readings, and Yale News says homework includes compiling a gratitude list.",
    steps: [
      "Write three things you feel grateful for today.",
      "Add one sentence explaining why each item matters.",
      "Choose one item to mention directly to the person involved, if relevant.",
    ],
    prompts: [
      "What are you grateful for that you normally speed past?",
      "Which gratitude item points to a relationship worth strengthening?",
    ],
    inference:
      "This is a straightforward gratitude-list adaptation grounded in public course descriptions.",
    sources: ["src-wellbeing-coursera", "src-yale-news"],
  },
  {
    id: "wellbeing-kindness-burst",
    program: "wellbeing",
    module: "Why Our Expectations are so Bad",
    title: "Kindness Burst",
    focus: "Prosocial behavior",
    duration: 10,
    cadence: "weekly",
    tags: ["kindness", "giving", "rewirement"],
    sourceMode: "Publicly named",
    summary:
      "Plan and complete a small act of kindness with intention rather than accident.",
    why:
      "The public course page includes a reading called 'Kindness & Social Connection'.",
    steps: [
      "Choose one small generous act you can do in the next 24 hours.",
      "Make it specific enough to count as done.",
      "Afterward, note how the act affected you and the other person.",
    ],
    prompts: [
      "What kind act is easy to delay but meaningful once done?",
      "How can you make the act personal rather than generic?",
    ],
    inference:
      "This follows the publicly named kindness rewirement theme.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-connection-reachout",
    program: "wellbeing",
    module: "Why Our Expectations are so Bad",
    title: "Connection Reach-Out",
    focus: "Relationships",
    duration: 8,
    cadence: "weekly",
    tags: ["social connection", "relationships", "rewirement"],
    sourceMode: "Publicly named",
    summary:
      "Strengthen one social tie with a higher-quality interaction.",
    why:
      "The public course materials and Yale News both refer to nurturing social connections.",
    steps: [
      "Choose one person you want to connect with more intentionally.",
      "Send a message or make a plan that goes beyond surface logistics.",
      "After the interaction, record how connected you felt before and after.",
    ],
    prompts: [
      "Who would be glad to hear from you if you stopped overthinking it?",
      "What question would open a more real conversation?",
    ],
    inference:
      "This is a practical connection exercise based on the public rewirement theme.",
    sources: ["src-wellbeing-coursera", "src-yale-news"],
  },
  {
    id: "wellbeing-sleep-reset",
    program: "wellbeing",
    module: "How Can We Overcome Our Biases",
    title: "Sleep Reset",
    focus: "Health practice",
    duration: 8,
    cadence: "daily",
    tags: ["sleep", "routine", "rewirement"],
    sourceMode: "Publicly named",
    summary:
      "Pick one realistic change that improves your sleep rhythm or sleep quality.",
    why:
      "The public course page includes a reading called 'Exercise & Sleep', and Yale News mentions improving sleep patterns.",
    steps: [
      "Choose one sleep-supportive behavior to test this week.",
      "Define when it will happen and what might get in the way.",
      "Track whether you did it for the next three nights.",
    ],
    prompts: [
      "What evening habit most predictably harms tomorrow's energy?",
      "What sleep change feels realistic instead of performative?",
    ],
    inference:
      "This is an applied sleep practice adapted from the public reading topics.",
    sources: ["src-wellbeing-coursera", "src-yale-news"],
  },
  {
    id: "wellbeing-move-minimum",
    program: "wellbeing",
    module: "How Can We Overcome Our Biases",
    title: "Movement Minimum",
    focus: "Health practice",
    duration: 8,
    cadence: "daily",
    tags: ["exercise", "movement", "rewirement"],
    sourceMode: "Publicly named",
    summary:
      "Set a daily minimum amount of movement that is easy to keep alive.",
    why:
      "Exercise is named in the public course reading list and Yale News summary of the homework.",
    steps: [
      "Choose a movement target small enough to complete almost every day.",
      "Attach it to a time or cue.",
      "Record how your energy feels after you complete it.",
    ],
    prompts: [
      "What amount of movement is honest for your real life this week?",
      "How can you reduce the all-or-nothing thinking around exercise?",
    ],
    inference:
      "This turns the public exercise theme into a repeatable movement practice.",
    sources: ["src-wellbeing-coursera", "src-yale-news"],
  },
  {
    id: "wellbeing-meditation-minute",
    program: "wellbeing",
    module: "Stuff that Really Makes Us Happy",
    title: "Meditation Minute Ladder",
    focus: "Mindfulness",
    duration: 6,
    cadence: "daily",
    tags: ["meditation", "mindfulness", "attention"],
    sourceMode: "Publicly named",
    summary:
      "Practice a short mindfulness session and build duration only after consistency appears.",
    why:
      "A public course reading is titled 'Meditation & Gratitude Visit', and Yale News mentions meditation as homework.",
    steps: [
      "Sit or stand still and place attention on breathing for one minute.",
      "When the mind wanders, gently note it and return.",
      "If the practice feels stable for three days, add one more minute.",
    ],
    prompts: [
      "What happens when you stop trying to meditate perfectly?",
      "How short can the practice be and still count today?",
    ],
    inference:
      "This is a simple meditation ladder adapted from the public rewirement topics.",
    sources: ["src-wellbeing-coursera", "src-yale-news"],
  },
  {
    id: "wellbeing-gratitude-visit",
    program: "wellbeing",
    module: "Stuff that Really Makes Us Happy",
    title: "Gratitude Visit Draft",
    focus: "Relationships",
    duration: 15,
    cadence: "once",
    tags: ["gratitude visit", "letter", "connection"],
    sourceMode: "Publicly named",
    summary:
      "Write what you appreciate about someone and, if appropriate, share it with them.",
    why:
      "The public course reading explicitly names a gratitude visit.",
    steps: [
      "Choose one person you are deeply grateful for.",
      "Write a short note explaining what they did and why it mattered.",
      "If it feels right, read or send the note and record what the experience was like.",
    ],
    prompts: [
      "What have you long appreciated but rarely said out loud?",
      "How did writing the message affect your own state before it was even delivered?",
    ],
    inference:
      "This keeps the public gratitude-visit idea intact while using fresh wording and structure.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-time-affluence",
    program: "wellbeing",
    module: "Stuff that Really Makes Us Happy",
    title: "Time Affluence Audit",
    focus: "Attention and schedule",
    duration: 10,
    cadence: "weekly",
    tags: ["time affluence", "schedule", "well-being"],
    sourceMode: "Publicly named",
    summary:
      "Examine where your time feels abundant versus fractured and overloaded.",
    why:
      "Time affluence is explicitly listed in the public module overview.",
    steps: [
      "Look at the next three days and mark the moments that feel rushed or fragmented.",
      "Choose one commitment to shrink, move, or protect.",
      "Create one 20-minute block for something restorative or meaningful.",
    ],
    prompts: [
      "Where are you spending time in ways that feel busy but not nourishing?",
      "What would make your next two days feel less scattered?",
    ],
    inference:
      "This is a practical translation of the public time-affluence topic.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-situation-support",
    program: "wellbeing",
    module: "Putting Strategies into Practice",
    title: "Situation Support Redesign",
    focus: "Environment",
    duration: 10,
    cadence: "weekly",
    tags: ["situation support", "environment", "habit design"],
    sourceMode: "Publicly named",
    summary:
      "Make your surroundings and defaults support the well-being habit you want.",
    why:
      "Situation support is explicitly named in the public final module.",
    steps: [
      "Choose one well-being habit that depends too much on motivation right now.",
      "Change the environment so the habit is easier to start and harder to forget.",
      "Review whether the redesign helped after two attempts.",
    ],
    prompts: [
      "What would make the healthy choice feel automatic instead of admirable?",
      "What reminder or setup could remove the need for a pep talk?",
    ],
    inference:
      "This is a direct practice adaptation of the publicly named situation-support concept.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-woop",
    program: "wellbeing",
    module: "Putting Strategies into Practice",
    title: "Goal Setting with Wish, Outcome, Obstacle, Plan",
    focus: "Goal setting",
    duration: 12,
    cadence: "weekly",
    tags: ["goal setting", "obstacle", "plan"],
    sourceMode: "Adapted from module description",
    summary:
      "Set a realistic well-being goal by naming the wish, desired outcome, likely obstacle, and response plan.",
    why:
      "The public final module includes goal setting and an interview with Gabriele Oettingen, whose work is strongly associated with this structure.",
    steps: [
      "Wish: write the well-being change you want.",
      "Outcome: describe the best result if it works.",
      "Obstacle and Plan: name the most likely obstacle and write an if-then response.",
    ],
    prompts: [
      "What inner obstacle shows up most reliably here?",
      "What if-then plan would make the next wobble less costly?",
    ],
    inference:
      "The public page names goal setting and the Oettingen interview but not the exact exercise, so this is an informed adaptation.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-mystery-rewirement",
    program: "wellbeing",
    module: "Putting Strategies into Practice",
    title: "Mystery Rewirement Picker",
    focus: "Variety",
    duration: 8,
    cadence: "weekly",
    tags: ["mystery rewirement", "variety", "practice"],
    sourceMode: "Publicly named",
    summary:
      "Choose one rewirement at random to prevent overthinking and keep practice fresh.",
    why:
      "The public final module contains a reading titled 'Mystery Rewirement'.",
    steps: [
      "Pick one of these categories at random: gratitude, savoring, kindness, connection, movement, sleep, or meditation.",
      "Do a five-minute version of the selected practice today.",
      "Record how the random choice changed your willingness to begin.",
    ],
    prompts: [
      "Did reducing choice make action easier?",
      "Which rewirement did you resist most, and what might that mean?",
    ],
    inference:
      "The public page names the mystery rewirement but not its exact mechanics, so this is a lightweight adaptation.",
    sources: ["src-wellbeing-coursera"],
  },
  {
    id: "wellbeing-final-reflection",
    program: "wellbeing",
    module: "Putting Strategies into Practice",
    title: "Final Rewirement Reflection",
    focus: "Integration",
    duration: 12,
    cadence: "monthly",
    tags: ["reflection", "rewirement", "integration"],
    sourceMode: "Publicly named",
    summary:
      "Reflect on which well-being practices actually changed your days, not just your intentions.",
    why:
      "The public course page includes both a final rewirement challenge and a reflection assignment.",
    steps: [
      "Name the three practices you actually used most.",
      "Write what changed in mood, behavior, or relationships because of them.",
      "Choose one practice to carry forward for the next month.",
    ],
    prompts: [
      "Which change felt subtle but meaningful over time?",
      "What practice deserves a permanent place in your week?",
    ],
    inference:
      "This mirrors the public final reflection theme while using original prompts and language.",
    sources: ["src-wellbeing-coursera"],
  },
];

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "planned", label: "Planned" },
  { id: "favorites", label: "Favorites" },
  { id: "done", label: "Done" },
];

const sourceById = Object.fromEntries(SOURCES.map((source) => [source.id, source]));
const exerciseById = Object.fromEntries(EXERCISES.map((exercise) => [exercise.id, exercise]));

let state = loadState();
let session = loadSession();

bootstrapSession();
bindEvents();
renderAll();

function loadState() {
  const fallback = {
    version: 1,
    theme: "dark",
    exerciseState: {},
    completionLog: [],
    checkins: {},
    diagnostics: {},
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalSessions: 0,
    },
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      exerciseState: parsed.exerciseState || {},
      completionLog: Array.isArray(parsed.completionLog) ? parsed.completionLog : [],
      checkins: parsed.checkins || {},
      diagnostics: parsed.diagnostics || {},
      meta: {
        ...fallback.meta,
        ...(parsed.meta || {}),
      },
    };
  } catch (error) {
    return fallback;
  }
}

function loadSession() {
  const fallback = {
    version: 1,
    activeView: "today",
    activeProgram: "all",
    activeStatus: "all",
    query: "",
    selectedExerciseId: null,
    todayQueue: [],
    sessionId: null,
    startedAt: null,
    completedThisSession: 0,
  };

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return fallback;
    }
    return {
      ...fallback,
      ...JSON.parse(raw),
    };
  } catch (error) {
    return fallback;
  }
}

function bootstrapSession() {
  if (!session.sessionId) {
    session.sessionId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `session-${Date.now()}`;
    session.startedAt = new Date().toISOString();
    session.completedThisSession = 0;
    state.meta.totalSessions += 1;
    saveState();
  }

  if (!Array.isArray(session.todayQueue) || !session.todayQueue.length) {
    session.todayQueue = buildTodayQueue();
  }

  if (!["today", "library", "journey", "insights", "sources"].includes(session.activeView)) {
    session.activeView = "today";
  }

  saveSession();
}

function saveState() {
  state.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getExerciseRecord(id) {
  if (!state.exerciseState[id]) {
    state.exerciseState[id] = {
      note: "",
      completedCount: 0,
      lastCompleted: null,
      favorite: false,
      planned: false,
    };
  }

  return state.exerciseState[id];
}

function bindEvents() {
  document.addEventListener("click", handleClick);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (event) => {
    session.query = event.target.value.trim();
    saveSession();
    renderLibrary();
  });

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    renderTheme();
    toast(`Theme switched to ${state.theme}.`);
  });

  const noteField = document.getElementById("sheet-note");
  noteField.addEventListener("input", () => {
    const selectedId = session.selectedExerciseId;
    if (!selectedId) {
      return;
    }
    const record = getExerciseRecord(selectedId);
    record.note = noteField.value;
    saveState();
    document.getElementById("sheet-note-status").textContent = "Saved";
  });

  const checkinForm = document.getElementById("checkin-form");
  checkinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(checkinForm);
    state.checkins[todayKey()] = {
      mood: Number(data.get("mood")),
      energy: Number(data.get("energy")),
      focus: Number(data.get("focus")),
      connection: Number(data.get("connection")),
      note: String(data.get("note") || ""),
      savedAt: new Date().toISOString(),
    };
    saveState();
    renderToday();
    renderInsights();
    toast("Daily check-in saved.");
  });

  const diagnosticForm = document.getElementById("diagnostic-form");
  diagnosticForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(diagnosticForm);
    const key = getWeekKey();
    const responses = {};

    for (const item of DIAGNOSTIC_SURVEY) {
      const value = Number(data.get(item.id));
      if (!Number.isFinite(value)) {
        toast("Please answer every checkpoint question.");
        return;
      }
      responses[item.id] = value;
    }

    const scored = scoreDiagnostic(responses);
    state.diagnostics[key] = {
      weekKey: key,
      responses,
      who5Score: scored.who5Score,
      laneScores: scored.laneScores,
      recommendedLane: scored.recommendedLane,
      note: String(data.get("note") || ""),
      savedAt: new Date().toISOString(),
    };
    saveState();
    renderToday();
    renderInsights();
    toast("Weekly checkpoint saved.");
  });

  ["mood", "energy", "focus", "connection"].forEach((name) => {
    const input = document.getElementById(`checkin-${name}`);
    const output = document.getElementById(`${name}-output`);
    input.addEventListener("input", () => {
      output.textContent = input.value;
    });
  });
}

function handleClick(event) {
  const target = event.target;
  const actionButton = target.closest("[data-action]");
  const viewButton = target.closest("[data-view-target]");

  if (viewButton) {
    session.activeView = viewButton.dataset.viewTarget;
    saveSession();
    renderViews();
    return;
  }

  if (actionButton) {
    const { action, exerciseId } = actionButton.dataset;

    if (action === "open") {
      openSheet(exerciseId);
      return;
    }

    if (action === "plan") {
      togglePlanned(exerciseId);
      return;
    }

    if (action === "favorite") {
      toggleFavorite(exerciseId);
      return;
    }

    if (action === "complete") {
      markComplete(exerciseId);
      return;
    }

    if (action === "program-filter") {
      session.activeProgram = exerciseId;
      saveSession();
      renderLibrary();
      return;
    }

    if (action === "status-filter") {
      session.activeStatus = exerciseId;
      saveSession();
      renderLibrary();
      return;
    }
  }

  const clickedId = target.id;

  if (clickedId === "close-sheet" || clickedId === "sheet-backdrop") {
    closeSheet();
    return;
  }

  if (clickedId === "start-next") {
    const nextId = session.todayQueue[0] || getNextBestExerciseId();
    if (nextId) {
      openSheet(nextId);
    } else {
      toast("No exercise found yet.");
    }
    return;
  }

  if (clickedId === "resume-session") {
    if (session.selectedExerciseId) {
      openSheet(session.selectedExerciseId);
    } else {
      const nextId = session.todayQueue[0] || getNextBestExerciseId();
      if (nextId) {
        openSheet(nextId);
      }
    }
    return;
  }

  if (clickedId === "refresh-queue") {
    session.todayQueue = buildTodayQueue(true);
    saveSession();
    renderToday();
    toast("Session queue refreshed.");
    return;
  }

  if (clickedId === "jump-diagnostic") {
    session.activeView = "today";
    saveSession();
    renderViews();
    document
      .getElementById("weekly-diagnostic-card")
      .scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (clickedId === "sheet-plan") {
    togglePlanned(session.selectedExerciseId);
    return;
  }

  if (clickedId === "sheet-favorite") {
    toggleFavorite(session.selectedExerciseId);
    return;
  }

  if (clickedId === "sheet-complete") {
    markComplete(session.selectedExerciseId);
    return;
  }

  if (clickedId === "sheet-next") {
    const nextId = getNextQueueExerciseId(session.selectedExerciseId) || getNextBestExerciseId();
    if (nextId) {
      openSheet(nextId);
    }
    return;
  }

  if (clickedId === "export-data") {
    exportData();
    return;
  }

  if (clickedId === "clear-session") {
    clearSessionMemory();
    return;
  }

  if (clickedId === "reset-data") {
    resetAllData();
  }
}

function renderAll() {
  renderTheme();
  renderViews();
  renderDiagnosticQuestions();
  renderProgramFilters();
  renderStatusFilters();
  renderToday();
  renderLibrary();
  renderJourney();
  renderInsights();
  renderSources();
  renderSheet();
}

function renderTheme() {
  document.body.dataset.theme = state.theme;
  document.getElementById("theme-toggle").textContent =
    state.theme === "dark" ? "Dark" : "Light";
}

function renderViews() {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === `view-${session.activeView}`);
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewTarget === session.activeView);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProgramFilters() {
  const container = document.getElementById("program-filters");
  const items = [
    `<button class="chip ${session.activeProgram === "all" ? "active" : ""}" data-action="program-filter" data-exercise-id="all" type="button">All programs</button>`,
  ];

  Object.values(PROGRAMS).forEach((program) => {
    items.push(
      `<button class="chip ${session.activeProgram === program.id ? "active" : ""}" data-action="program-filter" data-exercise-id="${program.id}" type="button">${program.name}</button>`
    );
  });

  container.innerHTML = items.join("");
}

function renderStatusFilters() {
  const container = document.getElementById("status-filters");
  container.innerHTML = STATUS_FILTERS.map(
    (filter) =>
      `<button class="chip ${session.activeStatus === filter.id ? "active" : ""}" data-action="status-filter" data-exercise-id="${filter.id}" type="button">${filter.label}</button>`
  ).join("");
}

function renderToday() {
  renderHeroProgress();
  renderTopStats();
  renderSessionSummary();
  renderDiagnostic();
  renderMilestones();
  renderProgramDeck();
  renderTodayQueue();
  renderPersistentPlan();
  renderCheckin();
}

function renderHeroProgress() {
  const xp = getXPStats();
  const startedPrograms = Object.values(PROGRAMS).filter(
    (program) =>
      EXERCISES.some(
        (exercise) =>
          exercise.program === program.id && getExerciseRecord(exercise.id).completedCount > 0
      )
  ).length;
  const milestoneCount = getMilestones().filter((milestone) => milestone.unlocked).length;
  const diagnostic = getCurrentWeekDiagnostic();
  const topPlayerChip = document.getElementById("top-player-chip");
  const heroLevel = document.getElementById("hero-level");
  const heroHighlights = document.getElementById("hero-highlights");
  const xpFill = document.getElementById("xp-fill");

  topPlayerChip.innerHTML = `<strong>Level ${xp.level}</strong><span>${xp.total} XP banked</span>`;
  heroLevel.innerHTML = `<strong>${xp.level}</strong><span>${getLevelTitle(xp.level)}</span>`;
  document.getElementById("xp-caption").textContent = `${xp.total} XP banked`;
  document.getElementById("xp-next").textContent = `${xp.toNext} XP to level ${xp.level + 1}`;
  xpFill.style.width = `${xp.progressPercent}%`;
  heroHighlights.innerHTML = [
    `<span class="pill">${state.completionLog.length} quests banked</span>`,
    `<span class="pill">${startedPrograms}/3 course paths started</span>`,
    `<span class="pill">${milestoneCount} milestones unlocked</span>`,
    `<span class="pill">${diagnostic ? "Checkpoint complete" : "Checkpoint due"}</span>`,
  ].join("");
}

function renderTopStats() {
  const completedUnique = EXERCISES.filter(
    (exercise) => getExerciseRecord(exercise.id).completedCount > 0
  ).length;
  const weekActivity = getCurrentWeekActivityCount();
  const streak = getStreak();
  const diagnostic = getCurrentWeekDiagnostic();
  const xp = getXPStats();

  document.getElementById("top-stats").innerHTML = [
    statCard(String(xp.level), "Current level"),
    statCard(String(streak), "Gentle streak in active days"),
    statCard(`${completedUnique}/${EXERCISES.length}`, "Unique quests explored"),
    statCard(String(weekActivity), diagnostic ? "Actions logged this week" : "Actions logged, checkpoint due"),
  ].join("");
}

function renderSessionSummary() {
  const selectedTitle = session.selectedExerciseId
    ? exerciseById[session.selectedExerciseId]?.title
    : "No exercise open yet";
  const dueText = getCurrentWeekDiagnostic() ? "Checkpoint saved" : "Weekly checkpoint is due";
  document.getElementById(
    "session-summary"
  ).textContent = `Queue: ${session.todayQueue.length} quests. Resume: ${selectedTitle}. Cleared this session: ${session.completedThisSession}. ${dueText}.`;
}

function renderDiagnosticQuestions() {
  const container = document.getElementById("diagnostic-questions");
  container.innerHTML = DIAGNOSTIC_SURVEY.map((item, index) => {
    const options = DIAGNOSTIC_OPTIONS.map(
      (option) => `
        <label class="likert-option">
          <input type="radio" name="${item.id}" value="${option.value}" />
          <span>${option.label}</span>
        </label>
      `
    ).join("");

    return `
      <section class="survey-question">
        <p class="eyebrow">${item.group} ${index < 5 ? "Item" : "Route"}</p>
        <h4>${item.prompt}</h4>
        <p class="muted">${item.help}</p>
        <div class="likert-grid">${options}</div>
      </section>
    `;
  }).join("");
}

function renderDiagnostic() {
  const current = getCurrentWeekDiagnostic();
  const latest = current || getLatestDiagnostic();
  const status = document.getElementById("diagnostic-status");
  const summary = document.getElementById("diagnostic-summary");
  const snapshot = document.getElementById("diagnostic-snapshot");

  status.textContent = current ? "Completed this week" : "Due this week";
  summary.textContent = current
    ? `Saved ${formatShortDate(current.savedAt)}. Focus next on ${PROGRAMS[current.recommendedLane].name}: ${getLaneFocusCopy(current.recommendedLane)}`
    : "Take this once each week to complete a short validated well-being check and route yourself toward the course lane that needs the most attention.";

  snapshot.innerHTML = latest
    ? [
        inlineStat(latest.who5Score, "WHO-5"),
        inlineStat(latest.laneScores.success, "Success"),
        inlineStat(latest.laneScores.behavior, "Behavior"),
        inlineStat(latest.laneScores.wellbeing, "Well-Being"),
      ].join("")
    : [
        inlineStat("-", "WHO-5"),
        inlineStat("-", "Success"),
        inlineStat("-", "Behavior"),
        inlineStat("-", "Well-Being"),
      ].join("");

  const responses = (current && current.responses) || {};
  for (const item of DIAGNOSTIC_SURVEY) {
    const value = Number.isFinite(responses[item.id]) ? responses[item.id] : null;
    document
      .querySelectorAll(`input[name="${item.id}"]`)
      .forEach((input) => {
        input.checked = String(value) === input.value;
      });
  }
  document.getElementById("diagnostic-note").value = current?.note || "";
}

function renderMilestones() {
  const milestones = getMilestones();
  const unlocked = milestones.filter((milestone) => milestone.unlocked).length;
  document.getElementById("milestone-caption").textContent = `${unlocked} unlocked`;
  document.getElementById("milestone-grid").innerHTML = milestones
    .slice(0, 4)
    .map((milestone) => renderMilestoneCard(milestone))
    .join("");
  document.getElementById("achievement-grid").innerHTML = milestones
    .map((milestone) => renderMilestoneCard(milestone))
    .join("");
}

function renderProgramDeck() {
  const deck = Object.values(PROGRAMS)
    .map((program) => getRecommendedExerciseForProgram(program.id))
    .filter(Boolean);

  document.getElementById("program-deck").innerHTML = deck
    .map((exercise) => {
      const record = getExerciseRecord(exercise.id);
      return `
        <article class="lane-card">
          <p class="eyebrow">${PROGRAMS[exercise.program].school}</p>
          <h3>${exercise.title}</h3>
          <p class="muted">${exercise.summary}</p>
          <div class="meta-row">
            <span class="pill">${exercise.module}</span>
            <span class="pill">${exercise.duration} min</span>
            <span class="pill">${record.completedCount ? `${record.completedCount} clears` : "Fresh quest"}</span>
          </div>
          <div class="hero-actions">
            <button class="mini-button" data-action="open" data-exercise-id="${exercise.id}" type="button">Open quest</button>
            <button class="mini-button" data-action="plan" data-exercise-id="${exercise.id}" type="button">${record.planned ? "Planned" : "Save to plan"}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTodayQueue() {
  const container = document.getElementById("today-queue");
  const queue = session.todayQueue.map((id) => exerciseById[id]).filter(Boolean);

  if (!queue.length) {
    container.innerHTML = emptyState("No queue yet", "Refresh the queue to get a new suggested mix.");
    return;
  }

  container.innerHTML = queue
    .map((exercise) => {
      const record = getExerciseRecord(exercise.id);
      return `
        <article class="queue-item">
          <div class="queue-header">
            <div>
              <div class="pill-row">
                <span class="pill">${PROGRAMS[exercise.program].school}</span>
                <span class="pill">${exercise.duration} min</span>
                <span class="pill">${exercise.module}</span>
              </div>
              <h4>${exercise.title}</h4>
            </div>
            <span class="badge">${exercise.focus}</span>
          </div>
          <p>${exercise.summary}</p>
          <div class="exercise-actions">
            <button class="mini-button" data-action="open" data-exercise-id="${exercise.id}" type="button">Open</button>
            <button class="mini-button" data-action="plan" data-exercise-id="${exercise.id}" type="button">${record.planned ? "Remove from plan" : "Save to plan"}</button>
            <button class="mini-button" data-action="complete" data-exercise-id="${exercise.id}" type="button">${record.completedCount ? "Complete again" : "Mark complete"}</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPersistentPlan() {
  const container = document.getElementById("persistent-plan");
  const planned = EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).planned);
  document.getElementById("plan-count").textContent = `${planned.length} planned`;

  if (!planned.length) {
    container.innerHTML = emptyState(
      "No planned practices yet",
      "Open any exercise and save it to your plan."
    );
    return;
  }

  container.innerHTML = planned
    .map((exercise) => {
      const record = getExerciseRecord(exercise.id);
      return `
        <article class="plan-item">
          <div class="queue-header">
            <div>
              <h4>${exercise.title}</h4>
              <p>${PROGRAMS[exercise.program].name} | ${exercise.module}</p>
            </div>
            <span class="badge">${record.completedCount ? `${record.completedCount} done` : "Not started"}</span>
          </div>
          <div class="exercise-actions">
            <button class="mini-button" data-action="open" data-exercise-id="${exercise.id}" type="button">Open</button>
            <button class="mini-button" data-action="plan" data-exercise-id="${exercise.id}" type="button">Remove</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCheckin() {
  const today = state.checkins[todayKey()];
  document.getElementById("checkin-status").textContent = today
    ? `Saved ${formatShortDate(today.savedAt)}`
    : "Not saved yet";

  if (today) {
    setRangeValue("mood", today.mood);
    setRangeValue("energy", today.energy);
    setRangeValue("focus", today.focus);
    setRangeValue("connection", today.connection);
    document.getElementById("checkin-note").value = today.note || "";
  } else {
    setRangeValue("mood", 3);
    setRangeValue("energy", 3);
    setRangeValue("focus", 3);
    setRangeValue("connection", 3);
    document.getElementById("checkin-note").value = "";
  }
}

function setRangeValue(name, value) {
  const input = document.getElementById(`checkin-${name}`);
  const output = document.getElementById(`${name}-output`);
  input.value = value;
  output.textContent = value;
}

function renderLibrary() {
  renderProgramFilters();
  renderStatusFilters();
  document.getElementById("search-input").value = session.query || "";

  const exercises = getFilteredExercises();
  const container = document.getElementById("library-results");
  document.getElementById(
    "library-summary"
  ).textContent = `${exercises.length} of ${EXERCISES.length} quests visible. Filter by course, status, or search term.`;

  if (!exercises.length) {
    container.innerHTML = emptyState(
      "No matches",
      "Try a different search, program, or status filter."
    );
    return;
  }

  container.innerHTML = exercises.map((exercise) => renderExerciseCard(exercise)).join("");
}

function getFilteredExercises() {
  const query = (session.query || "").toLowerCase();

  return EXERCISES.filter((exercise) => {
    const record = getExerciseRecord(exercise.id);
    const matchesProgram =
      session.activeProgram === "all" || exercise.program === session.activeProgram;
    const matchesStatus =
      session.activeStatus === "all" ||
      (session.activeStatus === "new" && !record.completedCount) ||
      (session.activeStatus === "planned" && record.planned) ||
      (session.activeStatus === "favorites" && record.favorite) ||
      (session.activeStatus === "done" && record.completedCount > 0);
    const searchText = [
      exercise.title,
      exercise.focus,
      exercise.module,
      PROGRAMS[exercise.program].name,
      ...exercise.tags,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || searchText.includes(query);

    return matchesProgram && matchesStatus && matchesQuery;
  });
}

function renderExerciseCard(exercise) {
  const record = getExerciseRecord(exercise.id);
  return `
    <article class="exercise-card">
      <div class="exercise-card-top">
        <div class="exercise-card-header">
          <div>
            <div class="pill-row">
              <span class="pill">${PROGRAMS[exercise.program].school}</span>
              <span class="pill">${exercise.module}</span>
            </div>
            <h3>${exercise.title}</h3>
          </div>
          <span class="badge">${exercise.duration} min</span>
        </div>
        <p>${exercise.summary}</p>
      </div>
      <div class="exercise-card-meta">
        <div class="meta-row">
          <span class="pill">${exercise.focus}</span>
          <span class="pill">${exercise.cadence}</span>
          <span class="pill">${exercise.sourceMode}</span>
          <span class="pill">${record.completedCount ? `${record.completedCount} clears` : "Fresh quest"}</span>
        </div>
      </div>
      <div class="exercise-card-actions">
        <div class="exercise-actions">
          <button class="mini-button" data-action="open" data-exercise-id="${exercise.id}" type="button">Open</button>
          <button class="mini-button" data-action="plan" data-exercise-id="${exercise.id}" type="button">${record.planned ? "Planned" : "Plan"}</button>
          <button class="mini-button" data-action="favorite" data-exercise-id="${exercise.id}" type="button">${record.favorite ? "Favorited" : "Favorite"}</button>
          <button class="mini-button" data-action="complete" data-exercise-id="${exercise.id}" type="button">${record.completedCount ? `${record.completedCount} done` : "Complete"}</button>
        </div>
      </div>
    </article>
  `;
}

function renderJourney() {
  renderProgramProgress();
  renderJourneyGroups();
}

function renderProgramProgress() {
  const container = document.getElementById("program-progress");
  container.innerHTML = Object.values(PROGRAMS)
    .map((program) => {
      const total = EXERCISES.filter((exercise) => exercise.program === program.id).length;
      const done = EXERCISES.filter(
        (exercise) =>
          exercise.program === program.id && getExerciseRecord(exercise.id).completedCount > 0
      ).length;
      const percent = Math.round((done / total) * 100) || 0;

      return `
        <article class="program-card">
          <p class="eyebrow">${program.school}</p>
          <h3>${program.name}</h3>
          <p class="muted">${program.summary}</p>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${percent}%"></div>
          </div>
          <p class="muted">${done} of ${total} exercises completed at least once</p>
        </article>
      `;
    })
    .join("");
}

function renderJourneyGroups() {
  const container = document.getElementById("journey-groups");
  const completed = EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).completedCount > 0)
    .length;
  document.getElementById("journey-summary").textContent = `${completed}/${EXERCISES.length} touched`;

  container.innerHTML = Object.values(PROGRAMS)
    .map((program) => {
      const rows = EXERCISES.filter((exercise) => exercise.program === program.id)
        .map((exercise) => {
          const record = getExerciseRecord(exercise.id);
          return `
            <div class="journey-row">
              <div class="journey-row-top">
                <div>
                  <h4>${exercise.title}</h4>
                  <p class="muted">${exercise.module} | ${exercise.focus}</p>
                </div>
                <span class="badge">${record.completedCount ? `${record.completedCount} done` : "New"}</span>
              </div>
              <div class="exercise-actions">
                <button class="mini-button" data-action="open" data-exercise-id="${exercise.id}" type="button">Open</button>
                <button class="mini-button" data-action="plan" data-exercise-id="${exercise.id}" type="button">${record.planned ? "Planned" : "Plan"}</button>
                <button class="mini-button" data-action="complete" data-exercise-id="${exercise.id}" type="button">Complete</button>
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <section class="journey-group">
          <div class="journey-group-header">
            <p class="eyebrow">${program.school}</p>
            <h3>${program.name}</h3>
          </div>
          <div class="journey-group-body">${rows}</div>
        </section>
      `;
    })
    .join("");
}

function renderInsights() {
  renderInsightStats();
  renderHeatmap();
  renderProgramBars();
  renderDiagnosticHistory();
  renderMilestones();
}

function renderInsightStats() {
  const completionCount = state.completionLog.length;
  const uniqueDone = EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).completedCount > 0)
    .length;
  const diagnostics = Object.keys(state.diagnostics || {}).length;
  const xp = getXPStats();

  document.getElementById("insight-stats").innerHTML = [
    statCard(String(xp.total), "Total XP banked"),
    statCard(String(completionCount), "Total quest clears"),
    statCard(String(uniqueDone), "Unique quests explored"),
    statCard(String(diagnostics), "Weekly diagnostics saved"),
  ].join("");
}

function renderHeatmap() {
  const container = document.getElementById("heatmap");
  const days = [];
  for (let offset = 27; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = dateToKey(date);
    const count = getActivityCountForDate(key);
    days.push({ key, count });
  }

  container.innerHTML = days
    .map((day) => {
      const level =
        day.count >= 4 ? 4 : day.count >= 3 ? 3 : day.count >= 2 ? 2 : day.count >= 1 ? 1 : 0;
      return `<div class="heat-cell" data-level="${level}" title="${day.key}: ${day.count} completions"></div>`;
    })
    .join("");

  const activeDays = days.filter((day) => day.count > 0).length;
  document.getElementById("heatmap-caption").textContent = `${activeDays} active days`;
}

function renderDiagnosticHistory() {
  const container = document.getElementById("diagnostic-history");
  const entries = Object.values(state.diagnostics || {}).sort((left, right) =>
    right.weekKey.localeCompare(left.weekKey)
  );
  document.getElementById("diagnostic-history-caption").textContent = `${entries.length} saved`;

  if (!entries.length) {
    container.innerHTML = emptyState(
      "No weekly checkpoints yet",
      "Take your first weekly diagnostic from the Play screen."
    );
    return;
  }

  container.innerHTML = entries.slice(0, 6).map(renderDiagnosticHistoryCard).join("");
}

function renderProgramBars() {
  const container = document.getElementById("program-bars");
  container.innerHTML = Object.values(PROGRAMS)
    .map((program) => {
      const total = EXERCISES.filter((exercise) => exercise.program === program.id).length;
      const done = EXERCISES.filter(
        (exercise) =>
          exercise.program === program.id && getExerciseRecord(exercise.id).completedCount > 0
      ).length;
      const percent = Math.round((done / total) * 100) || 0;

      return `
        <div class="bar-item">
          <div class="bar-label">
            <span>${program.name}</span>
            <span>${percent}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderSources() {
  const direct = EXERCISES.filter((exercise) => exercise.sourceMode === "Publicly named").length;
  const adapted = EXERCISES.length - direct;

  document.getElementById("source-summary").innerHTML = [
    statCard(String(SOURCES.length), "Online sources used"),
    statCard(String(direct), "Exercises built from publicly named activities"),
    statCard(String(adapted), "Exercises adapted from module descriptions"),
    statCard("3", "Programs combined"),
  ].join("");

  document.getElementById("sources-list").innerHTML = SOURCES.map(
    (source) => `
      <article class="source-card">
        <div class="source-card-header">
          <div>
            <p class="eyebrow">${source.publisher}</p>
            <h3>${source.title}</h3>
          </div>
          <a class="mini-button" href="${source.url}" target="_blank" rel="noreferrer">Open source</a>
        </div>
        <p>${source.note}</p>
      </article>
    `
  ).join("");
}

function renderSheet() {
  const sheet = document.getElementById("exercise-sheet");
  const backdrop = document.getElementById("sheet-backdrop");
  const exercise = session.selectedExerciseId ? exerciseById[session.selectedExerciseId] : null;

  if (!exercise) {
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    return;
  }

  const record = getExerciseRecord(exercise.id);
  const queueIndex = session.todayQueue.indexOf(exercise.id);
  const queueText =
    queueIndex >= 0
      ? `Quest ${queueIndex + 1} of ${session.todayQueue.length} in your current queue`
      : `${record.completedCount ? `${record.completedCount} clears` : "Fresh quest"} in your library`;
  document.getElementById("sheet-program").textContent = `${PROGRAMS[exercise.program].name} | ${PROGRAMS[exercise.program].school}`;
  document.getElementById("sheet-title").textContent = exercise.title;
  document.getElementById("sheet-progress").textContent = queueText;
  document.getElementById("sheet-meta").innerHTML = [
    `<span class="pill">${exercise.module}</span>`,
    `<span class="pill">${exercise.focus}</span>`,
    `<span class="pill">${exercise.duration} min</span>`,
    `<span class="pill">${exercise.cadence}</span>`,
  ].join("");
  document.getElementById("sheet-summary").textContent = exercise.summary;
  document.getElementById("sheet-why").textContent = exercise.why;
  document.getElementById("sheet-steps").innerHTML = exercise.steps
    .map((step) => `<li>${step}</li>`)
    .join("");
  document.getElementById("sheet-prompts").innerHTML = exercise.prompts
    .map((prompt) => `<li>${prompt}</li>`)
    .join("");
  document.getElementById("sheet-note").value = record.note || "";
  document.getElementById("sheet-source-mode").textContent = exercise.sourceMode;
  document.getElementById("sheet-inference").textContent = exercise.inference;
  document.getElementById("sheet-note-status").textContent = "Saved automatically";
  document.getElementById("sheet-plan").textContent = record.planned ? "Remove from plan" : "Save to plan";
  document.getElementById("sheet-favorite").textContent = record.favorite ? "Unfavorite" : "Favorite";
  const nextId = getNextQueueExerciseId(exercise.id) || getNextBestExerciseId(exercise.id);
  document.getElementById("sheet-next").textContent = nextId ? "Next quest" : "No next quest";
  document.getElementById("sheet-next").disabled = !nextId;
  document.getElementById("sheet-complete").textContent =
    record.completedCount && exercise.cadence !== "once" ? "Mark complete again" : "Mark complete";
  document.getElementById("sheet-sources").innerHTML = exercise.sources
    .map((id) => {
      const source = sourceById[id];
      return `
        <a class="linked-source" href="${source.url}" target="_blank" rel="noreferrer">
          <strong>${source.title}</strong>
          <span>${source.publisher}</span>
        </a>
      `;
    })
    .join("");

  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
}

function openSheet(id) {
  if (!exerciseById[id]) {
    return;
  }
  session.selectedExerciseId = id;
  saveSession();
  renderSheet();
}

function closeSheet() {
  document.getElementById("exercise-sheet").classList.remove("open");
  document.getElementById("exercise-sheet").setAttribute("aria-hidden", "true");
  document.getElementById("sheet-backdrop").hidden = true;
}

function togglePlanned(id) {
  if (!id) {
    return;
  }
  const record = getExerciseRecord(id);
  record.planned = !record.planned;
  saveState();
  session.todayQueue = buildTodayQueue();
  saveSession();
  renderToday();
  renderLibrary();
  renderJourney();
  renderSheet();
  toast(record.planned ? "Saved to your persistent plan." : "Removed from your plan.");
}

function toggleFavorite(id) {
  if (!id) {
    return;
  }
  const record = getExerciseRecord(id);
  record.favorite = !record.favorite;
  saveState();
  session.todayQueue = buildTodayQueue();
  saveSession();
  renderTopStats();
  renderLibrary();
  renderSheet();
  toast(record.favorite ? "Added to favorites." : "Removed from favorites.");
}

function markComplete(id) {
  if (!id) {
    return;
  }

  const record = getExerciseRecord(id);
  const exercise = exerciseById[id];
  record.completedCount += 1;
  record.lastCompleted = new Date().toISOString();
  if (exercise.cadence === "once") {
    record.planned = false;
  }
  state.completionLog.push({
    exerciseId: id,
    date: todayKey(),
    at: new Date().toISOString(),
  });
  session.completedThisSession += 1;
  session.todayQueue = buildTodayQueue();
  saveState();
  saveSession();
  renderToday();
  renderLibrary();
  renderJourney();
  renderInsights();
  renderSheet();
  toast(`Quest banked: ${exercise.title}`);
}

function buildTodayQueue(forceFresh) {
  const queue = [];
  const add = (ids) => {
    ids.forEach((id) => {
      if (id && !queue.includes(id) && queue.length < 6) {
        queue.push(id);
      }
    });
  };

  if (!forceFresh && session.selectedExerciseId) {
    add([session.selectedExerciseId]);
  }

  add(
    EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).planned).map(
      (exercise) => exercise.id
    )
  );

  addRoundRobin(
    queue,
    EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).favorite)
      .sort((left, right) => {
        const leftCount = getExerciseRecord(left.id).completedCount;
        const rightCount = getExerciseRecord(right.id).completedCount;
        return leftCount - rightCount;
      })
      .map((exercise) => exercise.id)
  );

  addRoundRobin(
    queue,
    EXERCISES.filter((exercise) => !getExerciseRecord(exercise.id).completedCount).map(
      (exercise) => exercise.id
    )
  );

  addRoundRobin(
    queue,
    EXERCISES.filter((exercise) => exercise.cadence !== "once").map((exercise) => exercise.id)
  );

  return queue.slice(0, 6);
}

function getNextBestExerciseId(excludeId) {
  const incompletePlanned = EXERCISES.find(
    (exercise) =>
      exercise.id !== excludeId &&
      getExerciseRecord(exercise.id).planned &&
      getExerciseRecord(exercise.id).completedCount === 0
  );
  if (incompletePlanned) {
    return incompletePlanned.id;
  }

  const incompleteFavorite = EXERCISES.find(
    (exercise) =>
      exercise.id !== excludeId &&
      getExerciseRecord(exercise.id).favorite &&
      getExerciseRecord(exercise.id).completedCount === 0
  );
  if (incompleteFavorite) {
    return incompleteFavorite.id;
  }

  const brandNew = EXERCISES.find(
    (exercise) => exercise.id !== excludeId && getExerciseRecord(exercise.id).completedCount === 0
  );
  return brandNew ? brandNew.id : EXERCISES[0]?.id || null;
}

function computeAverageCheckin(key) {
  const values = Object.values(state.checkins)
    .map((checkin) => Number(checkin[key]))
    .filter((value) => Number.isFinite(value));
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getStreak() {
  const dates = unique(getActivityDateKeys()).sort();
  if (!dates.length) {
    return 0;
  }

  let streak = 0;
  let cursor = new Date();
  const dateSet = new Set(dates);

  if (!dateSet.has(dateToKey(cursor))) {
    const yesterday = new Date(cursor);
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateSet.has(dateToKey(yesterday))) {
      cursor = yesterday;
    }
  }

  while (dateSet.has(dateToKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getXPStats() {
  const completionXP = state.completionLog.length * 30;
  const checkinXP = Object.keys(state.checkins || {}).length * 8;
  const diagnosticXP = Object.keys(state.diagnostics || {}).length * 45;
  const planningXP =
    EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).planned).length * 4;
  const total = completionXP + checkinXP + diagnosticXP + planningXP;
  const level = Math.floor(total / 140) + 1;
  const progress = total % 140;

  return {
    total,
    level,
    progress,
    progressPercent: total ? Math.round((progress / 140) * 100) : 0,
    toNext: 140 - progress || 140,
  };
}

function getLevelTitle(level) {
  const titles = [
    "First Light",
    "Path Starter",
    "Steady Builder",
    "Quest Walker",
    "Pattern Reader",
    "Momentum Maker",
    "Deep Practice",
    "Life Designer",
  ];
  return titles[Math.min(titles.length - 1, Math.max(0, level - 1))];
}

function getLaneFocusCopy(laneId) {
  if (laneId === "success") {
    return "beliefs, purpose, expertise, persistence, and relationship quests.";
  }
  if (laneId === "behavior") {
    return "habit loops, motivation, SMART goals, and environment redesign quests.";
  }
  return "rewirements around gratitude, connection, sleep, movement, and mindfulness.";
}

function getCurrentWeekActivityCount() {
  const weekPrefix = getWeekKey();
  const completionCount = state.completionLog.filter(
    (entry) => getWeekKey(new Date(entry.at)) === weekPrefix
  ).length;
  const checkinCount = Object.keys(state.checkins || {}).filter(
    (key) => getWeekKey(new Date(`${key}T12:00:00`)) === weekPrefix
  ).length;
  const diagnosticCount = state.diagnostics[getWeekKey()] ? 1 : 0;
  return completionCount + checkinCount + diagnosticCount;
}

function scoreDiagnostic(responses) {
  const who5Ids = DIAGNOSTIC_SURVEY.filter((item) => item.group === "WHO-5 core").map(
    (item) => item.id
  );
  const who5Score =
    who5Ids.reduce((sum, id) => sum + Number(responses[id] || 0), 0) * 4;

  const laneScores = {
    success: 0,
    behavior: 0,
    wellbeing: 0,
  };

  laneScores.behavior += invertScore(responses.route_plans) * 2;
  laneScores.behavior += invertScore(responses.route_environment) * 2;
  laneScores.behavior += invertScore(responses.route_restoration);

  laneScores.success += invertScore(responses.route_growth) * 2;
  laneScores.success += invertScore(responses.route_connection) * 1.5;
  laneScores.success += invertScore(responses.route_plans);

  laneScores.wellbeing += (100 - who5Score) / 20;
  laneScores.wellbeing += invertScore(responses.route_restoration) * 2;
  laneScores.wellbeing += invertScore(responses.route_connection) * 1.5;

  const recommendedLane = Object.entries(laneScores).sort((left, right) => right[1] - left[1])[0][0];

  return {
    who5Score,
    laneScores: {
      success: roundOne(laneScores.success),
      behavior: roundOne(laneScores.behavior),
      wellbeing: roundOne(laneScores.wellbeing),
    },
    recommendedLane,
  };
}

function normalizeDiagnosticEntry(entry) {
  if (!entry) {
    return null;
  }

  if (entry.responses && entry.laneScores && entry.recommendedLane) {
    return entry;
  }

  const legacyResponses = {
    who5_cheerful: entry.purpose ?? 3,
    who5_calm: entry.calm ?? 3,
    who5_active: entry.momentum ?? 3,
    who5_rested: entry.sleep ?? 3,
    who5_interest: entry.selfKindness ?? 3,
    route_plans: entry.momentum ?? 3,
    route_environment: entry.sleep ?? 3,
    route_growth: entry.purpose ?? 3,
    route_connection: entry.connection ?? 3,
    route_restoration: entry.selfKindness ?? 3,
  };
  const scored = scoreDiagnostic(legacyResponses);

  return {
    ...entry,
    responses: legacyResponses,
    who5Score: scored.who5Score,
    laneScores: scored.laneScores,
    recommendedLane: scored.recommendedLane,
  };
}

function getCurrentWeekDiagnostic() {
  return normalizeDiagnosticEntry(state.diagnostics[getWeekKey()] || null);
}

function getLatestDiagnostic() {
  const latest =
    Object.values(state.diagnostics || {}).sort((left, right) =>
      right.weekKey.localeCompare(left.weekKey)
    )[0] || null;
  return normalizeDiagnosticEntry(latest);
}

function getMilestones() {
  const uniqueDone = EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).completedCount > 0)
    .length;
  const allPrograms = Object.values(PROGRAMS).every((program) =>
    EXERCISES.some(
      (exercise) =>
        exercise.program === program.id && getExerciseRecord(exercise.id).completedCount > 0
    )
  );
  const noteCount = EXERCISES.filter((exercise) => getExerciseRecord(exercise.id).note.trim()).length;
  const diagnostics = Object.keys(state.diagnostics || {}).length;

  return [
    {
      id: "first-quest",
      title: "First Quest",
      subtitle: "Complete any exercise once.",
      unlocked: state.completionLog.length >= 1,
    },
    {
      id: "three-paths",
      title: "Three Paths",
      subtitle: "Touch all three course journeys.",
      unlocked: allPrograms,
    },
    {
      id: "gentle-week",
      title: "Gentle Week",
      subtitle: "Stay active for seven days in a row.",
      unlocked: getStreak() >= 7,
    },
    {
      id: "checkpoint-keeper",
      title: "Checkpoint Keeper",
      subtitle: "Save two weekly diagnostics.",
      unlocked: diagnostics >= 2,
    },
    {
      id: "note-weaver",
      title: "Note Weaver",
      subtitle: "Write notes on five different quests.",
      unlocked: noteCount >= 5,
    },
    {
      id: "pathfinder",
      title: "Pathfinder",
      subtitle: "Explore ten unique quests.",
      unlocked: uniqueDone >= 10,
    },
  ];
}

function getRecommendedExerciseForProgram(programId) {
  const pool = EXERCISES.filter((exercise) => exercise.program === programId);
  return (
    pool.find(
      (exercise) =>
        getExerciseRecord(exercise.id).planned && getExerciseRecord(exercise.id).completedCount === 0
    ) ||
    pool.find((exercise) => getExerciseRecord(exercise.id).favorite) ||
    pool.find((exercise) => getExerciseRecord(exercise.id).completedCount === 0) ||
    pool[0]
  );
}

function getNextQueueExerciseId(currentId) {
  const currentIndex = session.todayQueue.indexOf(currentId);
  if (currentIndex >= 0 && currentIndex < session.todayQueue.length - 1) {
    return session.todayQueue[currentIndex + 1];
  }
  return null;
}

function getActivityDateKeys() {
  const completionDates = state.completionLog.map((entry) => entry.date);
  const checkinDates = Object.keys(state.checkins || {});
  const diagnosticDates = Object.values(state.diagnostics || {}).map((entry) =>
    dateToKey(new Date(entry.savedAt))
  );
  return unique([...completionDates, ...checkinDates, ...diagnosticDates]);
}

function getActivityCountForDate(key) {
  const completionCount = state.completionLog.filter((entry) => entry.date === key).length;
  const checkinCount = state.checkins[key] ? 1 : 0;
  const diagnosticCount = Object.values(state.diagnostics || {}).filter(
    (entry) => dateToKey(new Date(entry.savedAt)) === key
  ).length;
  return completionCount + checkinCount + diagnosticCount;
}

function getWeekKey(date = new Date()) {
  const current = new Date(date);
  const utcDate = new Date(Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()));
  const dayNumber = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    state,
    session,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `being-progress-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  toast("Progress exported.");
}

function clearSessionMemory() {
  session = {
    version: 1,
    activeView: "today",
    activeProgram: "all",
    activeStatus: "all",
    query: "",
    selectedExerciseId: null,
    todayQueue: [],
    sessionId: null,
    startedAt: null,
    completedThisSession: 0,
  };
  sessionStorage.removeItem(SESSION_KEY);
  bootstrapSession();
  closeSheet();
  renderAll();
  toast("Session storage reset.");
}

function resetAllData() {
  const confirmed = window.confirm(
    "Reset all local progress, notes, favorites, plans, and session data?"
  );
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  state = loadState();
  session = loadSession();
  bootstrapSession();
  closeSheet();
  renderAll();
  toast("All app data reset.");
}

function statCard(value, label) {
  return `
    <article class="stat-card">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

function inlineStat(value, label) {
  return `
    <article class="inline-stat">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

function renderMilestoneCard(milestone) {
  return `
    <article class="milestone-item" data-state="${milestone.unlocked ? "unlocked" : "locked"}">
      <strong>${milestone.title}</strong>
      <small>${milestone.subtitle}</small>
    </article>
  `;
}

function renderDiagnosticHistoryCard(entry) {
  const normalized = normalizeDiagnosticEntry(entry);
  return `
    <article class="history-card">
      <div class="queue-header">
        <div>
          <h4>${normalized.weekKey}</h4>
          <p>${formatShortDate(normalized.savedAt)} checkpoint</p>
        </div>
        <span class="badge">Focus: ${PROGRAMS[normalized.recommendedLane].name}</span>
      </div>
      <div class="stats-inline">
        ${inlineStat(normalized.who5Score, "WHO-5")}
        ${inlineStat(normalized.laneScores.success, "Success")}
        ${inlineStat(normalized.laneScores.behavior, "Behavior")}
        ${inlineStat(normalized.laneScores.wellbeing, "Well-Being")}
      </div>
      <p>${normalized.note || "No note saved for this week."}</p>
    </article>
  `;
}

function emptyState(title, text) {
  return `
    <article class="queue-item">
      <h4>${title}</h4>
      <p>${text}</p>
    </article>
  `;
}

function toast(message) {
  const el = document.getElementById("toast");
  el.hidden = false;
  el.textContent = message;
  window.clearTimeout(toast._timer);
  toast._timer = window.setTimeout(() => {
    el.hidden = true;
  }, 2200);
}

function todayKey() {
  return dateToKey(new Date());
}

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function invertScore(value) {
  return 5 - Number(value || 0);
}

function roundOne(value) {
  return Math.round(value * 10) / 10;
}

function addRoundRobin(queue, ids) {
  const grouped = {
    success: [],
    behavior: [],
    wellbeing: [],
  };

  ids.forEach((id) => {
    const exercise = exerciseById[id];
    if (!exercise || queue.includes(id)) {
      return;
    }
    grouped[exercise.program].push(id);
  });

  let progress = true;
  while (queue.length < 6 && progress) {
    progress = false;

    Object.keys(grouped).forEach((programId) => {
      if (queue.length >= 6) {
        return;
      }

      const nextId = grouped[programId].shift();
      if (nextId) {
        queue.push(nextId);
        progress = true;
      }
    });
  }
}
