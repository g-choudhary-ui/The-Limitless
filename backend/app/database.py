import sqlite3
import json
import os
from pathlib import Path

DB_DIR = Path(__file__).parent.parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "limitless.db"

def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # User Profile
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        name TEXT,
        current_study TEXT,
        goals TEXT,
        comfortable_subjects TEXT,
        hard_topics TEXT,
        stuck_reaction TEXT,
        difficulty_type TEXT,
        preferred_format TEXT,
        daily_study_hours REAL,
        schedule_preference TEXT,
        planning_barriers TEXT,
        academic_baseline TEXT,
        current_cycle_stage INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Knowledge Nodes / Skills
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_nodes (
        id TEXT PRIMARY KEY,
        subject TEXT,
        title TEXT,
        description TEXT,
        prerequisites TEXT,
        mastery_score REAL DEFAULT 0.0,
        evidence_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'unassessed', -- unassessed, developing, mastered, gap_detected
        last_assessed TIMESTAMP
    )
    """)

    # Assessments and Submissions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        topic_id TEXT,
        question_id TEXT,
        user_answer TEXT,
        is_correct BOOLEAN,
        diagnosed_misconception TEXT,
        confidence_level TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Strategy Experiments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS strategy_experiments (
        id TEXT PRIMARY KEY,
        strategy_type TEXT, -- visual_diagram, worked_example, active_practice, structured_text
        topic_id TEXT,
        retention_score REAL,
        clarity_rating INTEGER,
        followup_correct BOOLEAN,
        notes TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Tasks / Planner
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_tasks (
        id TEXT PRIMARY KEY,
        title TEXT,
        duration_minutes INTEGER,
        goal_id TEXT,
        status TEXT DEFAULT 'pending', -- pending, completed, missed, rescheduled
        scheduled_date TEXT,
        barrier_reason TEXT,
        adjustment_suggested TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Reflections
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reflections (
        id TEXT PRIMARY KEY,
        what_understood TEXT,
        what_helped TEXT,
        best_approach TEXT,
        next_step TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()
