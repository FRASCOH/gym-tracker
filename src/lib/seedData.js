/**
 * Seed data for the inVictus Academy workout plans.
 * Contains all three schedules (A, B, C) extracted from the training cards.
 */

import { createPlan, createPlanExercises, getUserPlans } from './supabase';

// ============================================
// Scheda A — Petto, Braccia, Gambe
// ============================================
const SCHEDA_A = {
  name: 'Scheda A',
  description: 'Petto • Braccia • Gambe',
  sort_order: 0,
  exercises: [
    // --- PETTO ---
    {
      exercise_name: 'Panca piana',
      muscle_group: 'Petto',
      progression_type: 'PPa',
      rest_seconds: 120,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPa',
        sets: 3,
        min_reps: 8,
        max_reps: 12,
        weight_drops: [0, -5, -10],
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Panca con manubri',
      muscle_group: 'Petto',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0, note: 'Max 25/30kg' },
          { min_reps: 8, max_reps: 12, weight_offset: 0, note: 'Max 25/30kg' },
          { min_reps: 8, max_reps: 12, weight_offset: -5, note: 'Max 20/25kg' },
        ],
      },
    },
    {
      exercise_name: 'Chest press',
      muscle_group: 'Petto',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 16, weight_offset: 0, note: 'Carichi discendenti' },
          { min_reps: 12, max_reps: 16, weight_offset: -5 },
          { min_reps: 12, max_reps: 16, weight_offset: -10 },
        ],
      },
    },
    // --- BRACCIA ---
    {
      exercise_name: 'Curl bilanciere EZ',
      muscle_group: 'Braccia',
      progression_type: 'PPa',
      rest_seconds: 120,
      sort_order: 3,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPa',
        sets: 3,
        min_reps: 8,
        max_reps: 12,
        weight_drops: [0, -5, -10],
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Curl con manubri',
      muscle_group: 'Braccia',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    {
      exercise_name: 'French press',
      muscle_group: 'Braccia',
      progression_type: 'PPa',
      rest_seconds: 120,
      sort_order: 5,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPa',
        sets: 3,
        min_reps: 8,
        max_reps: 12,
        weight_drops: [0, -5, -10],
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Spinte in basso ai cavi',
      muscle_group: 'Braccia',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 6,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    // --- GAMBE ---
    {
      exercise_name: 'Squat',
      muscle_group: 'Gambe',
      progression_type: 'PPb',
      rest_seconds: 150,
      sort_order: 7,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPb',
        sets: 4,
        min_reps: 10,
        max_reps: 14,
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Pressa',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 120,
      sort_order: 8,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -15 },
        ],
      },
    },
  ],
};

// ============================================
// Scheda B — Spalle, Dorso, Gambe
// ============================================
const SCHEDA_B = {
  name: 'Scheda B',
  description: 'Spalle • Dorso • Gambe',
  sort_order: 1,
  exercises: [
    // --- SPALLE ---
    {
      exercise_name: 'Military press',
      muscle_group: 'Spalle',
      progression_type: 'PPb',
      rest_seconds: 120,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPb',
        sets: 4,
        min_reps: 8,
        max_reps: 12,
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Panca alta 60°',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    {
      exercise_name: 'Alzate (frontali + laterali + posteriori)',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 2,
      is_superset: true,
      superset_exercises: ['Alzate frontali', 'Alzate laterali', 'Alzate posteriori'],
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    // --- DORSO ---
    {
      exercise_name: 'Lat machine',
      muscle_group: 'Dorso',
      progression_type: 'PPb',
      rest_seconds: 120,
      sort_order: 3,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPb',
        sets: 4,
        min_reps: 8,
        max_reps: 12,
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Rematore',
      muscle_group: 'Dorso',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    // --- GAMBE ---
    {
      exercise_name: 'Stacco',
      muscle_group: 'Gambe',
      progression_type: 'PPc',
      rest_seconds: 150,
      sort_order: 5,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPc',
        sets: 4,
        min_reps: 6,
        max_reps: 10,
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Stacco a gambe tese',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 120,
      sort_order: 6,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -10 },
        ],
      },
    },
  ],
};

// ============================================
// Scheda C — Petto, Dorso, Spalle, Braccia
// ============================================
const SCHEDA_C = {
  name: 'Scheda C',
  description: 'Petto • Dorso • Spalle • Braccia',
  sort_order: 2,
  exercises: [
    // --- PETTO ---
    {
      exercise_name: 'Panca con manubri',
      muscle_group: 'Petto',
      progression_type: 'PPa',
      rest_seconds: 120,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPa',
        sets: 3,
        min_reps: 8,
        max_reps: 12,
        weight_drops: [0, -5, -10],
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Panca inclinata',
      muscle_group: 'Petto',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 6, max_reps: 8, weight_offset: 0 },
          { min_reps: 6, max_reps: 8, weight_offset: 0 },
          { min_reps: 8, max_reps: 10, weight_offset: -5 },
          { min_reps: 8, max_reps: 10, weight_offset: -5 },
          { min_reps: 10, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    // --- DORSO ---
    {
      exercise_name: 'Rematore',
      muscle_group: 'Dorso',
      progression_type: 'PPa',
      rest_seconds: 120,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'progression',
        progression: 'PPa',
        sets: 3,
        min_reps: 8,
        max_reps: 12,
        weight_drops: [0, -5, -10],
        increment: 2.5,
      },
    },
    {
      exercise_name: 'Pulley basso',
      muscle_group: 'Dorso',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 3,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 6, max_reps: 8, weight_offset: 0 },
          { min_reps: 6, max_reps: 8, weight_offset: 0 },
          { min_reps: 8, max_reps: 10, weight_offset: -5 },
          { min_reps: 8, max_reps: 10, weight_offset: -5 },
          { min_reps: 10, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    // --- SPALLE ---
    {
      exercise_name: 'Lento in piedi da sedere',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 6, max_reps: 8, weight_offset: 0 },
          { min_reps: 6, max_reps: 8, weight_offset: 0 },
          { min_reps: 8, max_reps: 10, weight_offset: -5 },
          { min_reps: 8, max_reps: 10, weight_offset: -5 },
          { min_reps: 10, max_reps: 12, weight_offset: -5 },
        ],
      },
    },
    {
      exercise_name: 'Alzate (frontali + laterali + posteriori)',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 5,
      is_superset: true,
      superset_exercises: ['Alzate frontali', 'Alzate laterali', 'Alzate posteriori'],
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    // --- BRACCIA ---
    {
      exercise_name: 'Curl con manubri',
      muscle_group: 'Braccia',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 6,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -10 },
        ],
      },
    },
    {
      exercise_name: 'French press',
      muscle_group: 'Braccia',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 7,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: 0 },
          { min_reps: 8, max_reps: 12, weight_offset: -10 },
        ],
      },
    },
  ],
};

export const ALL_PLANS = [SCHEDA_A, SCHEDA_B, SCHEDA_C];

/**
 * Seeds the user's workout plans into Supabase if they don't have any.
 */
export async function seedUserPlans(userId) {
  // Check if user already has plans
  const { data: existing } = await getUserPlans(userId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const plans = [];

  for (const planData of ALL_PLANS) {
    const { exercises, ...planFields } = planData;

    // Create the plan
    const { data: plan, error: planError } = await createPlan({
      ...planFields,
      user_id: userId,
    });

    if (planError) {
      console.error('Error creating plan:', planError);
      continue;
    }

    // Create the exercises for this plan
    const exerciseRows = exercises.map((ex) => ({
      ...ex,
      plan_id: plan.id,
      sets_config: ex.sets_config,
      superset_exercises: ex.superset_exercises || null,
    }));

    const { data: createdExercises, error: exError } = await createPlanExercises(exerciseRows);

    if (exError) {
      console.error('Error creating exercises:', exError);
    }

    plans.push({ ...plan, plan_exercises: createdExercises });
  }

  return plans;
}

/**
 * Returns the next plan to do based on the last completed session.
 */
export function getNextPlanIndex(lastPlanSortOrder) {
  if (lastPlanSortOrder === null || lastPlanSortOrder === undefined) return 0;
  return (lastPlanSortOrder + 1) % 3;
}

/**
 * Muscle group colors for UI badges
 */
export const MUSCLE_GROUP_COLORS = {
  Petto: { bg: 'rgba(239, 68, 68, 0.12)', text: '#f87171' },
  Braccia: { bg: 'rgba(168, 85, 247, 0.12)', text: '#c084fc' },
  Gambe: { bg: 'rgba(34, 211, 153, 0.12)', text: '#34d399' },
  Spalle: { bg: 'rgba(251, 191, 36, 0.12)', text: '#fbbf24' },
  Dorso: { bg: 'rgba(34, 211, 238, 0.12)', text: '#22d3ee' },
};

/**
 * Plan card gradient colors
 */
export const PLAN_COLORS = {
  'Scheda A': { gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', emoji: '🏋️' },
  'Scheda B': { gradient: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)', emoji: '💪' },
  'Scheda C': { gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', emoji: '🔥' },
};
