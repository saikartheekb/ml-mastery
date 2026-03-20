import { createClient } from '@supabase/supabase-js';

// These will be set via environment variables in Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  created_at: string;
}

export interface Course {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  time_spent: number;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
  gemini_api_key?: string;
  ai_provider: 'openai' | 'anthropic' | 'gemini';
  created_at: string;
  updated_at: string;
}

// API functions
export const api = {
  // Lessons
  async getLessons(courseId?: string) {
    if (!supabase) return null;
    let query = supabase.from('lessons').select('*').order('order');
    if (courseId) query = query.eq('course_id', courseId);
    return query;
  },

  async getLesson(lessonId: string) {
    if (!supabase) return null;
    return supabase.from('lessons').select('*').eq('id', lessonId).single();
  },

  // Courses
  async getCourses() {
    if (!supabase) return null;
    return supabase.from('courses').select('*').order('order');
  },

  // User Progress
  async getUserProgress(userId: string) {
    if (!supabase) return null;
    return supabase.from('user_progress').select('*').eq('user_id', userId);
  },

  async saveProgress(userId: string, lessonId: string, completed: boolean, timeSpent: number) {
    if (!supabase) return null;
    return supabase.from('user_progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed,
      time_spent: timeSpent,
      updated_at: new Date().toISOString()
    });
  },

  // User Settings
  async getUserSettings(userId: string) {
    if (!supabase) return null;
    const result = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
    return result;
  },

  async saveUserSettings(userId: string, settings: Partial<UserSettings>) {
    if (!supabase) return null;
    return supabase.from('user_settings').upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString()
    });
  }
};
