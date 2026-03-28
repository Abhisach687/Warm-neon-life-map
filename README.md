# Warm Neon Life-Map

Live app: https://abhisach687.github.io/Warm-neon-life-map/

Warm Neon Life-Map is a mobile-first self-improvement game with a cozy cyberpunk style.

## User story

A user opens the app and lands on `Play`.

They read the `Start Here` block to see the one best next step instead of choosing from everything at once.

If it is their first time, they run the weekly scan so the app can decide what kind of route fits them best.

Then they open the current quest, do the exercise, and mark it complete.

After that, the app updates the next quest, XP, rewards, streaks, and progress automatically.

If they want to understand the bigger picture, they open:

- `Archive` to browse all quests
- `Map` to see their chapter path and upcoming milestones
- `Review` to see progress, scan history, and the therapy / psychiatric session summary
- `Sources` to understand where the exercises and evidence came from

Before a therapy or psychiatric appointment, they open `Review` and read the section:

`Things I have to tell during psychiatric session`

That gives them a quick summary of what changed, what feels hard, what seems to help, and what may be worth bringing up.

## What this app does

The app guides you through one next step at a time.

- You get a current quest.
- You open the quest workspace and answer the exercise inside the app.
- The app unlocks the next step.
- A weekly scan helps the app decide what you should focus on next.
- Your progress is saved on your device.
- You earn XP, badges, artifacts, memories, and streak progress as you move.

## Where to tap

The app has 5 main tabs:

- `Play`: your main screen. Start here.
- `Archive`: all quests in one place.
- `Map`: your chapter path and timeline.
- `Review`: your progress, scan history, and psychiatrist-session review page.
- `Sources`: where the exercises and evidence came from.

## How to use it

1. Open `Play`.
2. Read the `Start Here` block.
3. Run the weekly scan if it is your first time.
4. Open the current quest workspace.
5. Answer the exercise prompts inside the app.
6. Complete the quest.
7. Save daily and weekly logs in `Review`.
8. Come back later and continue from the next guided step.

## Weekly scan

The weekly scan is on the `Play` page.

It uses:

- WHO-5 well-being questions
- extra questions about planning, confidence, support, connection, and restoration

It does not diagnose you.

It helps the app choose:

- what lane you should focus on
- whether your pace should be gentle, steady, or deeper
- whether you should stay in ignition or shift toward stabilization

## What gets tracked

The app tracks:

- completed quests
- completed chains
- XP and level
- streak progress
- badges
- artifacts
- companion memories
- weekly scans
- daily logs
- weekly reviews
- quest response forms
- your notes

Your data is saved in the browser on your device.

## If you want to show progress to your therapist or psychiatrist

Go to the `Review` tab.

At the top, there is a section called:

`Things I have to tell during psychiatric session`

That section shows:

- your current focus
- recent scan signals
- repeated low / improving / dropping WHO-5 patterns when enough scans exist
- what seems to be helping
- what feels hard
- recent changes
- suggested things to bring up
- consistency signals and recent wins
- reward and milestone signals the app thinks may matter
- your own personal note

This section is built from your saved scans, quest completions, streaks, memories, and notes.

The `Review` tab also includes:

- a short daily log
- a weekly review form
- a full session report that can be exported

## Run locally

This is a static app.

You can open it directly in a browser:

- [index.html](./index.html)

## Main files

- [index.html](./index.html): app layout
- [styles.css](./styles.css): app styling
- [game-data.js](./game-data.js): quests, chapters, and source data
- [game-app.js](./game-app.js): app logic and progress tracking
- [assets/icon-being.svg](./assets/icon-being.svg): app icon

## Content note

The app does not copy locked course worksheets word-for-word.

It uses public course descriptions and evidence-based sources to create original in-app quests.
