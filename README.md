# LIMITLESS AI
> **The AI That Learns How You Learn**
> *Understand Yourself. Learn Smarter. Become Limitless.*

Built for college hackathons, **Limitless** is a full-stack, adaptive learning and cognitive growth platform. It moves beyond traditional scorecards, generic flashcards, and superficial streaks by modeling *why* a student struggles, identifying root-cause misconceptions, empirically testing which teaching formats work best for them, and guiding them from self-awareness to demonstrated mastery.

---

## The Core Innovation: 6-Stage Continuous Learning Cycle

```
      [ Stage 1: Understand Me ]  -->  Intake goals, study routine & comfortable topics
                 │
                 ▼
     [ Stage 2: Discover My Gaps ] -->  Targeted diagnostic questions (BSTs, Recursion, etc.)
                 │
                 ▼
      [ Stage 3: Understand Why ]  -->  Diagnose specific misconception hypotheses
                 │
                 ▼
    [ Stage 4: Design My Strategy ] --> Test Worked Examples, Visual Diagrams, or Active Code
                 │
                 ▼
    [ Stage 5: Practice & Improve ] --> Solve counter-example follow-up & calibrate mastery
                 │
                 ▼
     [ Stage 6: Reflect & Adapt ]  -->  Log private insights & schedule next action to planner
                 │
                 └────────────── Cycle Continues ──────────────┘
```

---

## Key Modules & Screens

1. **Landing Page (`/`)**:
   - Interactive 3D knowledge constellation canvas with floating orbital physics.
   - The Three Student Dilemmas (*"I study, but don't understand where I go wrong"*).
   - Interactive 6-Stage Learning Cycle circular orbit map.
   - Comparative Breakdown: Traditional LMS vs Limitless AI.

2. **Psychologically Safe Onboarding (`/onboarding`)**:
   - 6-step conversational intake.
   - Zero clinical judgment or fixed personality labeling.
   - Distinguishes self-reported format preferences from proven ability.

3. **Personalized Dashboard (`/dashboard`)**:
   - Today's Focus: Top 3 prioritized actions linked to active goals.
   - Learning Intelligence: Mastered, Developing, and Active Gaps ledger.
   - Interactive Knowledge Growth Map with node inspector.
   - One Actionable Evidence-Based Insight.

4. **Adaptive Learning Studio (`/learn`)**:
   - Topic Selection: Binary Search Trees & Invariants, Recursion, Dynamic Programming, System Caching.
   - Diagnostic Question: Tests subtree-wide invariant vs shallow parent-child check.
   - Misconception Diagnosis: Explains *why* the error occurred without scolding.
   - Multi-Format Micro-Lesson: Switch between Worked Examples, Visual Interval Slicing, Active Drills, and Structured Theory.
   - Stage 5 Verification: Tests counter-example (Node 25 in left branch of Root 20); updates mastery delta (+35%) and adds next step to planner.

5. **Learning Strategy Experiments (`/strategies`)**:
   - Compares empirical retention rates across teaching modalities.
   - Scientific hypothesis testing rather than permanent "visual/auditory learner" pigeonholing.

6. **Goal-to-Action Planner (`/planner`)**:
   - AI-Guided Planning: Decomposes goals into bite-sized actions matching available daily bandwidth.
   - Supportive Missed Task Check-in: Identifies task intimidation or friction and reschedules gracefully without broken streaks.

7. **Knowledge-to-Expression Studio (`/expression`)**:
   - Evaluates verbal and written technical explanations for exams and interviews.
   - **Critical Innovation**: Distinguishes conceptual gaps from communication/vocabulary friction.
   - Rubric scoring with polished expert rephrasing and 1-minute targeted verbal drills.

8. **Skill Gap Radar (`/radar`)**:
   - Recharts radar chart comparing Required vs Demonstrated competencies for target roles (e.g. Software Engineering Intern).
   - Unassessed skills are clearly separated from zero-proficiency.

9. **My Growth & Reflection (`/growth`)**:
   - Private reflection journal prompts: *"What do you understand better now?"*, *"What helped?"*.
   - Baseline-to-present evidence comparisons.

10. **Progress & Analytics (`/analytics`)**:
    - Recharts telemetry: Calibrated mastery over time, domain competence, strategy retention, and learning velocity.
    - Knowledge mastery is strictly separated from study hours and completed checkboxes.

11. **Settings & Demo Controls (`/settings`)**:
    - Live Gemini API indicator / Deterministic offline demo mode toggle.
    - One-click database reset to clean baseline demo student (**Alex Chen**).

---

## Technology Stack

- **Frontend**:
  - React 19 + TypeScript + Vite
  - Tailwind CSS 3.4 (Custom dark-mode glassmorphism tokens, gradients, and typography)
  - Framer Motion (Page transitions, animated stage cycles, floating canvas)
  - Recharts (Radar charts, Area progression charts, Bar comparisons)
  - Lucide React (Clean semantic iconography)
  - React Router DOM 7
- **Backend**:
  - Python 3.11/3.12 + FastAPI
  - SQLite relational database with atomic schema migrations (`backend/app/data/limitless.db`)
  - Google Gemini API (`google-genai` SDK) with deterministic demo fallbacks
  - Uvicorn ASGI server

---

## Quickstart & Local Setup

### 1. Start the FastAPI Backend
```bash
cd backend
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Backend will run on: `http://127.0.0.1:8000` (API docs at `http://127.0.0.1:8000/docs`)*

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on: `http://127.0.0.1:5173`*

---

## Hackathon Demo Walkthrough (2-Minute Journey)

1. Open `http://127.0.0.1:5173/` &rarr; observe the 3D Constellation canvas and interactive 6-stage cycle.
2. Click **Discover My Learning Journey** &rarr; step through the supportive onboarding intake.
3. Arrive at **Dashboard** &rarr; review Today's Focus and inspect the Growth Map nodes.
4. Go to **Adaptive Studio (`/learn`)**:
   - Answer the BST question (Option B: "Empty subtrees are invalid" or Option A: "Only checks local parent-child").
   - Notice the instant diagnosis of the local invariant misconception.
   - Switch tabs to the **Visual Mental Model & Bounding Intervals** micro-lesson.
   - Click **Verify Improvement** and answer the counter-example follow-up (Root 20, Left 10, Right 25).
   - Observe the **+35% Mastery Calibration** and click **Add Next Action to Planner**.
5. Visit **Expression Studio (`/expression`)** &rarr; submit a natural-language explanation and view the rubric distinguishing conceptual depth from articulation clarity.
6. Visit **Skill Gap Radar (`/radar`)** &rarr; view the target role radar chart with assessed vs unassessed competencies.
