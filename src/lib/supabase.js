import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ============================================
// Auth helpers
// ============================================

export async function signUpWithEmail(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ============================================
// Profile helpers
// ============================================

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function upsertProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates })
    .select()
    .single();
  return { data, error };
}

// ============================================
// Workout Plans
// ============================================

export async function getUserPlans(userId, programType = 'invictus') {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*, plan_exercises(*)')
    .eq('user_id', userId)
    .in('program_type', [programType, 'cardio'])
    .order('sort_order');

  if (data) {
    data.forEach((plan) => {
      plan.plan_exercises?.sort((a, b) => a.sort_order - b.sort_order);
    });
  }
  return { data, error };
}

export async function createPlan(plan) {
  const { data, error } = await supabase
    .from('workout_plans')
    .insert(plan)
    .select()
    .single();
  return { data, error };
}

export async function createPlanExercises(exercises) {
  const { data, error } = await supabase
    .from('plan_exercises')
    .insert(exercises)
    .select();
  return { data, error };
}

// ============================================
// Workout Sessions
// ============================================

export async function startSession(userId, planId) {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      plan_id: planId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data, error };
}

export async function completeSession(sessionId, notes) {
  const startedAt = await supabase
    .from('workout_sessions')
    .select('started_at')
    .eq('id', sessionId)
    .single();

  const durationMinutes = startedAt.data
    ? Math.round((Date.now() - new Date(startedAt.data.started_at).getTime()) / 60000)
    : null;

  const { data, error } = await supabase
    .from('workout_sessions')
    .update({
      completed_at: new Date().toISOString(),
      notes,
      duration_minutes: durationMinutes,
    })
    .eq('id', sessionId)
    .select()
    .single();
  return { data, error };
}

export async function getLastSession(userId, planId) {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, session_sets(*)')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .not('completed_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data, error };
}

export async function getUserSessions(userId, limit = 20) {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, workout_plans(name), session_sets(count)')
    .eq('user_id', userId)
    .not('completed_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(limit);
  return { data, error };
}

// ============================================
// Session Sets
// ============================================

export async function logSet(setData) {
  const { data, error } = await supabase
    .from('session_sets')
    .upsert(setData)
    .select()
    .single();
  return { data, error };
}

export async function getSessionSets(sessionId) {
  const { data, error } = await supabase
    .from('session_sets')
    .select('*')
    .eq('session_id', sessionId)
    .order('set_number');
  return { data, error };
}

// ============================================
// Progress / Charts data
// ============================================

export async function getExerciseHistory(userId, exerciseName, limit = 30) {
  // Get all sessions with sets for a specific exercise
  const { data, error } = await supabase
    .from('session_sets')
    .select(`
      weight_kg,
      reps,
      set_number,
      logged_at,
      workout_sessions!inner(
        user_id,
        started_at,
        plan_id
      ),
      plan_exercises!inner(
        exercise_name
      )
    `)
    .eq('workout_sessions.user_id', userId)
    .eq('plan_exercises.exercise_name', exerciseName)
    .eq('set_number', 1)
    .order('logged_at', { ascending: true })
    .limit(limit);

  return { data, error };
}

export async function getMainExerciseNames(userId) {
  const { data, error } = await supabase
    .from('plan_exercises')
    .select('exercise_name, progression_type, workout_plans!inner(user_id)')
    .eq('workout_plans.user_id', userId)
    .not('progression_type', 'is', null);

  const unique = [...new Set(data?.map((d) => d.exercise_name) || [])];
  return { data: unique, error };
}
