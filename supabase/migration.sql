-- ============================================
-- GymTracker — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  weight_unit TEXT DEFAULT 'kg',
  default_increment NUMERIC(4,2) DEFAULT 2.5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. WORKOUT_PLANS (Schede A, B, C)
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  program_type TEXT DEFAULT 'invictus',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_plan_name_type UNIQUE (user_id, name, program_type)
);

-- 3. PLAN_EXERCISES (esercizi dentro ogni scheda)
CREATE TABLE IF NOT EXISTS plan_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  progression_type TEXT,
  sets_config JSONB NOT NULL DEFAULT '{}',
  rest_seconds INT NOT NULL DEFAULT 120,
  sort_order INT DEFAULT 0,
  is_superset BOOLEAN DEFAULT FALSE,
  superset_exercises TEXT[],
  notes TEXT
);

-- 4. WORKOUT_SESSIONS (ogni allenamento completato)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES workout_plans(id),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  duration_minutes INT
);

-- 5. SESSION_SETS (ogni serie loggata)
CREATE TABLE IF NOT EXISTS session_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  plan_exercise_id UUID REFERENCES plan_exercises(id),
  set_number INT NOT NULL,
  weight_kg NUMERIC(6,2),
  reps INT,
  target_weight_kg NUMERIC(6,2),
  target_reps_min INT,
  target_reps_max INT,
  is_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_sessions_user ON workout_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_plan ON workout_sessions(user_id, plan_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sets_session ON session_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise ON session_sets(plan_exercise_id, logged_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_sets ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own profile
CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Workout Plans: users can manage their own plans
CREATE POLICY "Users manage own plans" ON workout_plans
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Plan Exercises: users can manage exercises in their own plans
CREATE POLICY "Users manage own plan exercises" ON plan_exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM workout_plans WHERE workout_plans.id = plan_exercises.plan_id AND workout_plans.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM workout_plans WHERE workout_plans.id = plan_exercises.plan_id AND workout_plans.user_id = auth.uid())
  );

-- Workout Sessions: users can manage their own sessions
CREATE POLICY "Users manage own sessions" ON workout_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Session Sets: users can manage sets in their own sessions
CREATE POLICY "Users manage own sets" ON session_sets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = session_sets.session_id AND workout_sessions.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = session_sets.session_id AND workout_sessions.user_id = auth.uid())
  );

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
-- Aggiunta colonne per supporto multi-programma
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_program TEXT DEFAULT 'invictus';
ALTER TABLE workout_plans ADD COLUMN IF NOT EXISTS program_type TEXT DEFAULT 'invictus';

-- Rimuovi duplicati (se presenti) prima di aggiungere il vincolo unico
DELETE FROM public.workout_plans a USING public.workout_plans b
WHERE a.id > b.id 
  AND a.user_id = b.user_id 
  AND a.name = b.name 
  AND COALESCE(a.program_type, '') = COALESCE(b.program_type, '');

-- Aggiungi vincolo unico
ALTER TABLE public.workout_plans 
  DROP CONSTRAINT IF EXISTS unique_user_plan_name_type,
  ADD CONSTRAINT unique_user_plan_name_type UNIQUE (user_id, name, program_type);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, active_program)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'active_program', 'invictus')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
