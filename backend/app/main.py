import os
import json
import uuid
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.database import get_connection, init_db
from app.curriculum import TOPICS, QUESTIONS, MICRO_LESSONS
from app.llm_service import analyze_expression_with_gemini, generate_ai_plan_with_gemini

# Initialize Database on startup
init_db()

app = FastAPI(
    title="Limitless API",
    description="Backend for Limitless: The Adaptive Learning and Cognitive Growth Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed default knowledge nodes if empty
def seed_knowledge_nodes():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM knowledge_nodes")
    count = c.fetchone()[0]
    if count == 0:
        nodes = [
            ("recursion_basics", "Computer Science", "Recursive Base-Cases", "Terminating conditions and call-stack return propagation", "[]", 75.0, 3, "developing"),
            ("bst_invariants", "Data Structures", "BST Subtree-Wide Bounds", "Validating nodes against ancestor range constraints", json.dumps(["recursion_basics"]), 45.0, 1, "gap_detected"),
            ("tree_traversal", "Data Structures", "Tree Traversals (In-Order, Pre, Post)", "In-order traversal guarantees monotonic ordering on valid BST", "[]", 85.0, 4, "mastered"),
            ("dp_memoization", "Algorithms", "Dynamic Programming Memoization", "Caching overlapping subproblem computations", json.dumps(["recursion_basics"]), 30.0, 0, "unassessed"),
            ("cache_invalidation", "Distributed Systems", "Cache-Aside & Invalidation", "Consistency invariants across cache and database stores", "[]", 60.0, 2, "developing"),
        ]
        c.executemany("""
            INSERT INTO knowledge_nodes (id, subject, title, description, prerequisites, mastery_score, evidence_count, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, nodes)
        conn.commit()
    conn.close()

seed_knowledge_nodes()

# Seed default demo user if empty
def seed_default_user():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM user_profile")
    if c.fetchone()[0] == 0:
        c.execute("""
            INSERT INTO user_profile (
                id, name, current_study, goals, comfortable_subjects,
                hard_topics, stuck_reaction, difficulty_type, preferred_format,
                daily_study_hours, schedule_preference, planning_barriers, academic_baseline, current_cycle_stage
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "default_user",
            "Alex Chen",
            "Computer Science Sophomore",
            json.dumps(["Prepare for technical internships", "Master tree and graph algorithms"]),
            json.dumps(["Arrays & Hashing", "Basic OOP"]),
            json.dumps(["BST Invariant proofs", "Recursive state backtracking"]),
            "I often know what the code should do in plain English, but struggle to structure recursive range checks.",
            "application",
            "worked_example",
            1.5,
            "flexible",
            json.dumps(["Task feels too large", "Unsure where to begin when stuck"]),
            json.dumps({"recent_gpa": "3.5", "target_role": "Software Engineering Intern"}),
            2 # Stage 2: Discover My Gaps
        ))
        # Add sample study tasks
        tasks = [
            ("t1", "Complete BST range-boundary diagnostic exercise", 20, "Prepare for technical internships", "completed", "2026-10-28", None, None),
            ("t2", "Trace counter-example: Node 25 in left subtree of 20", 15, "Master tree and graph algorithms", "pending", "2026-10-28", None, None),
            ("t3", "Formulate 2-minute verbal explanation of BST invariant", 15, "Prepare for technical internships", "pending", "2026-10-29", None, None),
        ]
        c.executemany("""
            INSERT OR REPLACE INTO study_tasks (id, title, duration_minutes, goal_id, status, scheduled_date, barrier_reason, adjustment_suggested)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, tasks)
        conn.commit()
    conn.close()

seed_default_user()

# --- Pydantic Schemas ---
class OnboardingData(BaseModel):
    name: str = "Alex Chen"
    current_study: str = "Computer Science"
    goals: List[str] = Field(default_factory=list)
    comfortable_subjects: List[str] = Field(default_factory=list)
    hard_topics: List[str] = Field(default_factory=list)
    stuck_reaction: Optional[str] = "I spend too long re-reading without writing code."
    difficulty_type: Optional[str] = "application"
    preferred_format: Optional[str] = "worked_example"
    daily_study_hours: float = 1.5
    schedule_preference: str = "flexible"
    planning_barriers: List[str] = Field(default_factory=list)
    academic_baseline: Dict[str, Any] = Field(default_factory=dict)

class AssessmentSubmission(BaseModel):
    topic_id: str
    question_id: str
    selected_option_id: str
    confidence_level: Optional[str] = "medium"

class FollowupSubmission(BaseModel):
    topic_id: str
    question_id: str
    selected_option_id: str

class StrategyExperimentRecord(BaseModel):
    strategy_type: str
    topic_id: str
    retention_score: float
    clarity_rating: int
    followup_correct: bool
    notes: Optional[str] = ""

class TaskCreate(BaseModel):
    title: str
    duration_minutes: int
    goal_id: Optional[str] = "General"
    scheduled_date: Optional[str] = "Today"

class TaskUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    duration_minutes: Optional[int] = None

class TaskBarrier(BaseModel):
    barrier_reason: str

class ExpressionSubmission(BaseModel):
    concept: str
    explanation: str
    style: Optional[str] = "interview"

class ReflectionCreate(BaseModel):
    what_understood: str
    what_helped: str
    best_approach: str
    next_step: str

# --- Routes ---

@app.get("/api/health")
def health_check():
    api_key_configured = bool(os.environ.get("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "platform": "Limitless AI",
        "api_key_configured": api_key_configured,
        "mode": "live_gemini" if api_key_configured else "deterministic_demo"
    }

@app.get("/api/profile")
def get_profile():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM user_profile WHERE id = 'default_user'")
    row = c.fetchone()
    conn.close()
    if not row:
        return {}
    return {
        "id": row["id"],
        "name": row["name"],
        "current_study": row["current_study"],
        "goals": json.loads(row["goals"] or "[]"),
        "comfortable_subjects": json.loads(row["comfortable_subjects"] or "[]"),
        "hard_topics": json.loads(row["hard_topics"] or "[]"),
        "stuck_reaction": row["stuck_reaction"],
        "difficulty_type": row["difficulty_type"],
        "preferred_format": row["preferred_format"],
        "daily_study_hours": row["daily_study_hours"],
        "schedule_preference": row["schedule_preference"],
        "planning_barriers": json.loads(row["planning_barriers"] or "[]"),
        "academic_baseline": json.loads(row["academic_baseline"] or "{}"),
        "current_cycle_stage": row["current_cycle_stage"]
    }

@app.post("/api/onboarding")
def save_onboarding(data: OnboardingData):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT OR REPLACE INTO user_profile (
            id, name, current_study, goals, comfortable_subjects,
            hard_topics, stuck_reaction, difficulty_type, preferred_format,
            daily_study_hours, schedule_preference, planning_barriers, academic_baseline, current_cycle_stage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "default_user",
        data.name,
        data.current_study,
        json.dumps(data.goals),
        json.dumps(data.comfortable_subjects),
        json.dumps(data.hard_topics),
        data.stuck_reaction,
        data.difficulty_type,
        data.preferred_format,
        data.daily_study_hours,
        data.schedule_preference,
        json.dumps(data.planning_barriers),
        json.dumps(data.academic_baseline),
        2 # Move to Stage 2: Discover My Gaps
    ))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Onboarding profile built successfully.",
        "recommended_first_diagnostic": {
            "topic_id": "bst_invariants",
            "title": "Binary Search Trees & Recursive Invariants",
            "reason": "Directly matches your goal to master tree algorithms and tests application rather than rote syntax."
        }
    }

@app.post("/api/profile/reset")
def reset_profile():
    conn = get_connection()
    c = conn.cursor()
    c.execute("DELETE FROM user_profile")
    c.execute("DELETE FROM knowledge_nodes")
    c.execute("DELETE FROM study_tasks")
    c.execute("DELETE FROM assessments")
    c.execute("DELETE FROM strategy_experiments")
    c.execute("DELETE FROM reflections")
    conn.commit()
    conn.close()
    seed_knowledge_nodes()
    seed_default_user()
    return {"success": True, "message": "Demo profile restored to clean baseline state."}

@app.get("/api/topics")
def get_topics():
    return TOPICS

@app.get("/api/assessment/topic/{topic_id}")
def get_topic_questions(topic_id: str):
    topic_questions = [q for q in QUESTIONS if q["topic_id"] == topic_id]
    if not topic_questions:
        raise HTTPException(status_code=404, detail="Topic questions not found")
    # Return questions without revealing answer keys
    clean_questions = []
    for q in topic_questions:
        clean_q = dict(q)
        clean_q["options"] = [
            {"id": opt["id"], "text": opt["text"]}
            for opt in q["options"]
        ]
        clean_questions.append(clean_q)
    return clean_questions

@app.post("/api/assessment/submit")
def submit_assessment(sub: AssessmentSubmission):
    question = next((q for q in QUESTIONS if q["id"] == sub.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    selected_opt = next((o for o in question["options"] if o["id"] == sub.selected_option_id), None)
    if not selected_opt:
        raise HTTPException(status_code=400, detail="Invalid option selected")

    is_correct = selected_opt["is_correct"]
    misconception = selected_opt.get("misconception")

    # Record assessment in DB
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO assessments (id, topic_id, question_id, user_answer, is_correct, diagnosed_misconception, confidence_level)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()),
        sub.topic_id,
        sub.question_id,
        sub.selected_option_id,
        is_correct,
        misconception,
        sub.confidence_level
    ))

    # Update knowledge node status
    if is_correct:
        c.execute("""
            UPDATE knowledge_nodes
            SET mastery_score = MIN(100.0, mastery_score + 20.0),
                evidence_count = evidence_count + 1,
                status = CASE WHEN mastery_score + 20.0 >= 80 THEN 'mastered' ELSE 'developing' END,
                last_assessed = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (sub.topic_id,))
        # Update user cycle stage to Stage 5: Practice & Improve
        c.execute("UPDATE user_profile SET current_cycle_stage = 5 WHERE id = 'default_user'")
    else:
        c.execute("""
            UPDATE knowledge_nodes
            SET mastery_score = MAX(15.0, mastery_score - 10.0),
                evidence_count = evidence_count + 1,
                status = 'gap_detected',
                last_assessed = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (sub.topic_id,))
        # Update user cycle stage to Stage 3: Understand Why
        c.execute("UPDATE user_profile SET current_cycle_stage = 3 WHERE id = 'default_user'")

    conn.commit()
    conn.close()

    # Get micro-lesson if available
    micro_lesson = MICRO_LESSONS.get(sub.topic_id, None)

    return {
        "is_correct": is_correct,
        "selected_option": sub.selected_option_id,
        "feedback": selected_opt.get("feedback"),
        "diagnosed_misconception": misconception,
        "concept_tested": question.get("concept_tested"),
        "explanation": "Simple Rule: In a number tree, EVERY number on the left side must be smaller than the top root (Grandpa), not just its direct parent!",
        "micro_lesson": micro_lesson,
        "suggested_next_stage": 3 if not is_correct else 5
    }

@app.post("/api/assessment/verify-followup")
def verify_followup(sub: FollowupSubmission):
    question = next((q for q in QUESTIONS if q["id"] == sub.question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Followup question not found")

    selected_opt = next((o for o in question["options"] if o["id"] == sub.selected_option_id), None)
    if not selected_opt:
        raise HTTPException(status_code=400, detail="Invalid option selected")

    is_correct = selected_opt["is_correct"]

    conn = get_connection()
    c = conn.cursor()
    if is_correct:
        c.execute("""
            UPDATE knowledge_nodes
            SET mastery_score = MIN(100.0, mastery_score + 35.0),
                evidence_count = evidence_count + 1,
                status = 'developing',
                last_assessed = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (sub.topic_id,))
        # Cycle stage moves to Stage 6: Reflect and Adapt
        c.execute("UPDATE user_profile SET current_cycle_stage = 6 WHERE id = 'default_user'")
    conn.commit()
    conn.close()

    return {
        "is_correct": is_correct,
        "feedback": selected_opt.get("feedback"),
        "mastery_updated": True,
        "new_status": "developing" if is_correct else "gap_detected",
        "insight": "🌟 You got it! You spotted that 25 was on the left of 20, which breaks the tree rule." if is_correct else "Not quite! Look where 25 is standing compared to 20 on the top."
    }

@app.get("/api/learning-path")
def get_learning_path():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT current_cycle_stage FROM user_profile WHERE id = 'default_user'")
    row = c.fetchone()
    current_stage = row["current_cycle_stage"] if row else 1

    c.execute("SELECT * FROM knowledge_nodes")
    nodes = []
    for r in c.fetchall():
        nodes.append({
            "id": r["id"],
            "subject": r["subject"],
            "title": r["title"],
            "description": r["description"],
            "prerequisites": json.loads(r["prerequisites"] or "[]"),
            "mastery_score": r["mastery_score"],
            "evidence_count": r["evidence_count"],
            "status": r["status"],
            "last_assessed": r["last_assessed"]
        })
    conn.close()

    stages = [
        {"stage": 1, "name": "Understand Me", "desc": "Goal discovery, current comfort levels, and baseline routine.", "completed": current_stage > 1, "active": current_stage == 1},
        {"stage": 2, "name": "Discover My Gaps", "desc": "Diagnostic assessments and precise misconception detection.", "completed": current_stage > 2, "active": current_stage == 2},
        {"stage": 3, "name": "Understand Why", "desc": "Distinguish conceptual gaps from application or planning barriers.", "completed": current_stage > 3, "active": current_stage == 3},
        {"stage": 4, "name": "Design My Strategy", "desc": "Compare worked examples, visual models, or structured challenges.", "completed": current_stage > 4, "active": current_stage == 4},
        {"stage": 5, "name": "Practice & Improve", "desc": "Adaptive follow-up exercises to demonstrate progress.", "completed": current_stage > 5, "active": current_stage == 5},
        {"stage": 6, "name": "Reflect & Adapt", "desc": "Update evidence-based mastery and calibrate the next cycle.", "completed": False, "active": current_stage == 6},
    ]

    return {
        "current_stage": current_stage,
        "stages": stages,
        "nodes": nodes,
        "immediate_focus": {
            "title": "Resolve BST Subtree Boundary Invariant",
            "why": "Directly impacts technical interview readiness; resolves root cause of failing corner tests.",
            "estimated_time": "15 mins",
            "action_type": "practice"
        }
    }

@app.get("/api/strategy-experiments")
def get_strategy_experiments():
    # Return empirical comparison data
    return {
        "summary": "Worked examples and visual diagrams currently show the highest retention on structural algorithm topics.",
        "strategies": [
            {
                "id": "worked_example",
                "name": "Worked Examples & Traces",
                "description": "Step-by-step counter-examples showing exactly where boundary violations occur.",
                "observed_retention": 84.5,
                "trials_completed": 7,
                "recommended": True
            },
            {
                "id": "visual_diagram",
                "name": "Visual Interval Models",
                "description": "Spatial interval slicing and call-stack frame diagrams.",
                "observed_retention": 79.2,
                "trials_completed": 5,
                "recommended": True
            },
            {
                "id": "active_practice",
                "name": "Active Problem Solving",
                "description": "Immediate coding challenges without hints.",
                "observed_retention": 62.0,
                "trials_completed": 4,
                "recommended": False
            },
            {
                "id": "structured_text",
                "name": "Structured Written Theory",
                "description": "Rigorous inductive definitions and mathematical formulas.",
                "observed_retention": 68.4,
                "trials_completed": 3,
                "recommended": False
            }
        ]
    }

@app.post("/api/strategy-experiment/record")
def record_strategy_experiment(data: StrategyExperimentRecord):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO strategy_experiments (id, strategy_type, topic_id, retention_score, clarity_rating, followup_correct, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()),
        data.strategy_type,
        data.topic_id,
        data.retention_score,
        data.clarity_rating,
        data.followup_correct,
        data.notes
    ))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Strategy experiment trial recorded."}

@app.get("/api/tasks")
def get_tasks():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM study_tasks ORDER BY created_at DESC")
    tasks = []
    for r in c.fetchall():
        tasks.append({
            "id": r["id"],
            "title": r["title"],
            "duration_minutes": r["duration_minutes"],
            "goal_id": r["goal_id"],
            "status": r["status"],
            "scheduled_date": r["scheduled_date"],
            "barrier_reason": r["barrier_reason"],
            "adjustment_suggested": r["adjustment_suggested"],
            "created_at": r["created_at"]
        })
    conn.close()
    return tasks

@app.post("/api/tasks")
def create_task(data: TaskCreate):
    conn = get_connection()
    c = conn.cursor()
    task_id = "task_" + str(uuid.uuid4())[:8]
    c.execute("""
        INSERT INTO study_tasks (id, title, duration_minutes, goal_id, scheduled_date, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
    """, (task_id, data.title, data.duration_minutes, data.goal_id, data.scheduled_date))
    conn.commit()
    conn.close()
    return {"id": task_id, "title": data.title, "status": "pending"}

@app.post("/api/tasks/ai-generate")
def generate_ai_tasks(payload: Dict[str, Any] = Body(...)):
    goal = payload.get("goal", "Software Engineering Interview Prep")
    available_hours = float(payload.get("available_hours", 1.5))
    gaps = ["BST Subtree Invariant", "Recursive Base-case return propagation"]
    tasks = generate_ai_plan_with_gemini(goal, available_hours, gaps)

    # Persist generated tasks to DB
    conn = get_connection()
    c = conn.cursor()
    created = []
    for t in tasks:
        tid = "task_" + str(uuid.uuid4())[:8]
        c.execute("""
            INSERT INTO study_tasks (id, title, duration_minutes, goal_id, scheduled_date, status)
            VALUES (?, ?, ?, ?, 'Today', 'pending')
        """, (tid, t["title"], t["duration_minutes"], goal))
        created.append({
            "id": tid,
            "title": t["title"],
            "duration_minutes": t["duration_minutes"],
            "why_it_matters": t.get("why_it_matters"),
            "source": t.get("source", "deterministic_demo")
        })
    conn.commit()
    conn.close()
    return created

@app.patch("/api/tasks/{task_id}")
def update_task(task_id: str, data: TaskUpdate):
    conn = get_connection()
    c = conn.cursor()
    if data.status:
        c.execute("UPDATE study_tasks SET status = ? WHERE id = ?", (data.status, task_id))
    if data.title:
        c.execute("UPDATE study_tasks SET title = ? WHERE id = ?", (data.title, task_id))
    if data.duration_minutes:
        c.execute("UPDATE study_tasks SET duration_minutes = ? WHERE id = ?", (data.duration_minutes, task_id))
    conn.commit()
    conn.close()
    return {"success": True}

@app.post("/api/tasks/{task_id}/barrier")
def record_task_barrier(task_id: str, data: TaskBarrier):
    adjustments = {
        "task_too_large": "Let's decompose this task into two 10-minute micro-steps.",
        "unsure_where_to_start": "We will provide an example starter template with comments.",
        "unexpected_responsibility": "No problem at all. We have rescheduled this smoothly without penalty.",
        "needed_more_time": "Adjusted the estimated duration from 20m to 35m for your next session.",
        "need_different_approach": "Switched recommendation from written reading to a worked example walkthrough."
    }
    suggested = adjustments.get(data.barrier_reason, "Adjusted task scope into a manageable 10-minute focus session.")

    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        UPDATE study_tasks
        SET status = 'rescheduled',
            barrier_reason = ?,
            adjustment_suggested = ?
        WHERE id = ?
    """, (data.barrier_reason, suggested, task_id))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "adjustment_suggested": suggested
    }

@app.post("/api/expression/evaluate")
def evaluate_expression(data: ExpressionSubmission):
    return analyze_expression_with_gemini(
        concept=data.concept,
        user_explanation=data.explanation,
        style=data.style or "interview"
    )

@app.get("/api/skills/radar")
def get_skills_radar():
    return {
        "target_profile": "Software Engineering Intern (Algorithms & Systems)",
        "skills": [
            {"subject": "Binary Search Trees", "demonstrated": 55, "required": 85, "assessed": True, "evidence_status": "Gap Detected in Subtree Bounds"},
            {"subject": "Recursion & Invariants", "demonstrated": 75, "required": 80, "assessed": True, "evidence_status": "Sufficient for Simple Calls"},
            {"subject": "Dynamic Programming", "demonstrated": 30, "required": 75, "assessed": False, "evidence_status": "Unassessed Baseline"},
            {"subject": "Technical Explanation", "demonstrated": 70, "required": 85, "assessed": True, "evidence_status": "Expression Clarity Developing"},
            {"subject": "Cache Systems", "demonstrated": 60, "required": 70, "assessed": True, "evidence_status": "Foundational Knowledge"},
            {"subject": "Planning & Consistency", "demonstrated": 80, "required": 75, "assessed": True, "evidence_status": "Active Study Sessions"},
        ]
    }

@app.get("/api/reflections")
def get_reflections():
    conn = get_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM reflections ORDER BY timestamp DESC")
    items = []
    for r in c.fetchall():
        items.append({
            "id": r["id"],
            "what_understood": r["what_understood"],
            "what_helped": r["what_helped"],
            "best_approach": r["best_approach"],
            "next_step": r["next_step"],
            "timestamp": r["timestamp"]
        })
    conn.close()
    if not items:
        # Default starter reflection
        items = [{
            "id": "starter_1",
            "what_understood": "Understood why checking node.left < node is insufficient; the interval bounds must propagate from root.",
            "what_helped": "Tracing the concrete counter-example with Node 25 in the left branch.",
            "best_approach": "Worked examples with tree diagrams.",
            "next_step": "Implement the range check validator without looking at references.",
            "timestamp": "2026-10-28 12:00:00"
        }]
    return items

@app.post("/api/reflections")
def save_reflection(data: ReflectionCreate):
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        INSERT INTO reflections (id, what_understood, what_helped, best_approach, next_step)
        VALUES (?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), data.what_understood, data.what_helped, data.best_approach, data.next_step))
    conn.commit()
    conn.close()
    return {"success": True, "message": "Reflection recorded."}

@app.get("/api/analytics")
def get_analytics():
    return {
        "mastery_progression": [
            {"date": "Day 1", "baseline": 40, "current": 40},
            {"date": "Day 3", "baseline": 40, "current": 48},
            {"date": "Day 5", "baseline": 40, "current": 58},
            {"date": "Day 7", "baseline": 40, "current": 65},
            {"date": "Day 9", "baseline": 40, "current": 74},
        ],
        "domain_competence": [
            {"domain": "Conceptual Depth", "score": 72, "benchmark": 80},
            {"domain": "Problem Solving", "score": 68, "benchmark": 75},
            {"domain": "Technical Expression", "score": 75, "benchmark": 80},
            {"domain": "Planning Consistency", "score": 85, "benchmark": 70},
        ],
        "strategy_efficacy": [
            {"name": "Worked Examples", "retention": 85},
            {"name": "Visual Diagrams", "retention": 79},
            {"name": "Written Theory", "retention": 68},
            {"name": "Blind Practice", "retention": 62},
        ],
        "stats": {
            "concepts_mastered": 2,
            "concepts_developing": 3,
            "active_gaps": 1,
            "hours_invested": 9.5,
            "learning_velocity": "+22% retention improvement"
        }
    }
