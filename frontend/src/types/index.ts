export interface UserProfile {
  id: string;
  name: string;
  current_study: string;
  goals: string[];
  comfortable_subjects: string[];
  hard_topics: string[];
  stuck_reaction?: string;
  difficulty_type?: 'understanding' | 'remembering' | 'application' | 'explanation';
  preferred_format?: string;
  daily_study_hours: number;
  schedule_preference: string;
  planning_barriers: string[];
  academic_baseline?: {
    recent_gpa?: string;
    target_role?: string;
    upcoming_deadlines?: string;
  };
  current_cycle_stage: number; // 1 to 6
}

export interface KnowledgeNode {
  id: string;
  subject: string;
  title: string;
  description: string;
  prerequisites: string[];
  mastery_score: number;
  evidence_count: number;
  status: 'unassessed' | 'developing' | 'mastered' | 'gap_detected';
  last_assessed?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct?: boolean;
  misconception?: string | null;
  feedback?: string;
}

export interface Question {
  id: string;
  topic_id: string;
  prompt: string;
  options: QuestionOption[];
  concept_tested?: string;
  difficulty?: string;
}

export interface MicroLessonFormat {
  label: string;
  content: string;
}

export interface MicroLesson {
  title: string;
  concept: string;
  formats: Record<string, MicroLessonFormat>;
}

export interface StudyTask {
  id: string;
  title: string;
  duration_minutes: number;
  goal_id?: string;
  status: 'pending' | 'completed' | 'missed' | 'rescheduled';
  scheduled_date?: string;
  barrier_reason?: string;
  adjustment_suggested?: string;
  created_at?: string;
}

export interface StrategyExperiment {
  id: string;
  name: string;
  description: string;
  observed_retention: number;
  trials_completed: number;
  recommended: boolean;
}

export interface ExpressionEvaluation {
  conceptual_score: number;
  clarity_score: number;
  structure_score: number;
  diagnosis: 'conceptual_gap' | 'expression_difficulty' | 'sound_understanding';
  diagnosis_explanation: string;
  strengths: string[];
  missing_key_points: string[];
  refined_version: string;
  recommended_exercise: string;
  mode?: string;
}

export interface RadarSkill {
  subject: string;
  demonstrated: number;
  required: number;
  assessed: boolean;
  evidence_status: string;
}

export interface ReflectionItem {
  id: string;
  what_understood: string;
  what_helped: string;
  best_approach: string;
  next_step: string;
  timestamp: string;
}
