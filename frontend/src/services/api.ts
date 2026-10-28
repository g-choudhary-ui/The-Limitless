import {
  UserProfile,
  KnowledgeNode,
  Question,
  StudyTask,
  StrategyExperiment,
  ExpressionEvaluation,
  RadarSkill,
  ReflectionItem
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : 'http://127.0.0.1:8000') + '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`API call to ${endpoint} failed, checking fallback:`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => request<{ status: string; platform: string; api_key_configured: boolean; mode: string }>('/health'),

  getProfile: () => request<UserProfile>('/profile'),

  saveOnboarding: (data: Partial<UserProfile>) =>
    request<{ success: boolean; message: string; recommended_first_diagnostic: any }>('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  resetProfile: () => request<{ success: boolean; message: string }>('/profile/reset', { method: 'POST' }),

  getTopics: () => request<any[]>('/topics'),

  getTopicQuestions: (topicId: string) => request<Question[]>(`/assessment/topic/${topicId}`),

  submitAssessment: (payload: { topic_id: string; question_id: string; selected_option_id: string; confidence_level?: string }) =>
    request<{
      is_correct: boolean;
      selected_option: string;
      feedback: string;
      diagnosed_misconception: string | null;
      concept_tested: string;
      explanation: string;
      micro_lesson: any;
      suggested_next_stage: number;
    }>('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  verifyFollowup: (payload: { topic_id: string; question_id: string; selected_option_id: string }) =>
    request<{
      is_correct: boolean;
      feedback: string;
      mastery_updated: boolean;
      new_status: string;
      insight: string;
    }>('/assessment/verify-followup', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getLearningPath: () =>
    request<{
      current_stage: number;
      stages: Array<{ stage: number; name: string; desc: string; completed: boolean; active: boolean }>;
      nodes: KnowledgeNode[];
      immediate_focus: { title: string; why: string; estimated_time: string; action_type: string };
    }>('/learning-path'),

  getStrategyExperiments: () =>
    request<{ summary: string; strategies: StrategyExperiment[] }>('/strategy-experiments'),

  recordStrategyExperiment: (payload: {
    strategy_type: string;
    topic_id: string;
    retention_score: number;
    clarity_rating: number;
    followup_correct: boolean;
    notes?: string;
  }) => request<{ success: boolean }>('/strategy-experiment/record', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getTasks: () => request<StudyTask[]>('/tasks'),

  createTask: (payload: { title: string; duration_minutes: number; goal_id?: string; scheduled_date?: string }) =>
    request<StudyTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  generateAiTasks: (goal: string, available_hours: number) =>
    request<Array<{ id: string; title: string; duration_minutes: number; why_it_matters?: string; source: string }>>('/tasks/ai-generate', {
      method: 'POST',
      body: JSON.stringify({ goal, available_hours })
    }),

  updateTask: (taskId: string, payload: { status?: string; title?: string; duration_minutes?: number }) =>
    request<{ success: boolean }>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),

  recordTaskBarrier: (taskId: string, barrier_reason: string) =>
    request<{ success: boolean; adjustment_suggested: string }>(`/tasks/${taskId}/barrier`, {
      method: 'POST',
      body: JSON.stringify({ barrier_reason })
    }),

  evaluateExpression: (payload: { concept: string; explanation: string; style?: string }) =>
    request<ExpressionEvaluation>('/expression/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getSkillsRadar: () =>
    request<{ target_profile: string; skills: RadarSkill[] }>('/skills/radar'),

  getReflections: () => request<ReflectionItem[]>('/reflections'),

  saveReflection: (payload: { what_understood: string; what_helped: string; best_approach: string; next_step: string }) =>
    request<{ success: boolean; message: string }>('/reflections', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getAnalytics: () => request<any>('/analytics')
};
