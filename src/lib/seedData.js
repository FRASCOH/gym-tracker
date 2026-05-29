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

// ============================================
// Schede Corpo Libero & Elastici (Tonificazione & Glutei Focus)
// ============================================
const SCHEDA_A_CORPO_LIBERO = {
  name: 'Scheda A',
  description: 'Gambe • Glutei • Addome (Corpo Libero)',
  sort_order: 0,
  exercises: [
    {
      exercise_name: 'Squat con elastico',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 15, max_reps: 20, weight_offset: 0, note: 'Banda elastica sopra le ginocchia' },
          { min_reps: 15, max_reps: 20, weight_offset: 0, note: 'Banda elastica sopra le ginocchia' },
          { min_reps: 15, max_reps: 20, weight_offset: 0, note: 'Banda elastica sopra le ginocchia' },
        ],
      },
    },
    {
      exercise_name: 'Hip Thrust con manubrio + elastico',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 15, weight_offset: 0, note: 'Usa manubrio 5kg' },
          { min_reps: 12, max_reps: 15, weight_offset: 0, note: 'Usa manubrio 5kg' },
          { min_reps: 12, max_reps: 15, weight_offset: 0, note: 'Usa manubrio 5kg' },
          { min_reps: 12, max_reps: 15, weight_offset: 0, note: 'Usa manubrio 5kg' },
        ],
      },
    },
    {
      exercise_name: 'Affondi posteriori con manubri',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 10, max_reps: 10, weight_offset: 0, note: 'Manubri da 3kg o 5kg' },
          { min_reps: 10, max_reps: 10, weight_offset: 0 },
          { min_reps: 10, max_reps: 10, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Slanci posteriori con elastico',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 3,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 15, max_reps: 15, weight_offset: 0, note: '15 ripetizioni per gamba' },
          { min_reps: 15, max_reps: 15, weight_offset: 0 },
          { min_reps: 15, max_reps: 15, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Plank addominale',
      muscle_group: 'Addome',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 30, max_reps: 60, weight_offset: 0, note: 'Mantieni i secondi target' },
          { min_reps: 30, max_reps: 60, weight_offset: 0 },
          { min_reps: 30, max_reps: 60, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Crunch a terra',
      muscle_group: 'Addome',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 5,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 15, max_reps: 20, weight_offset: 0 },
          { min_reps: 15, max_reps: 20, weight_offset: 0 },
          { min_reps: 15, max_reps: 20, weight_offset: 0 },
        ],
      },
    },
  ],
};

const SCHEDA_B_CORPO_LIBERO = {
  name: 'Scheda B',
  description: 'Tono Upper Body • Spalle • Dorso • Braccia',
  sort_order: 1,
  exercises: [
    {
      exercise_name: 'Alzate laterali con manubri',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 15, weight_offset: 0, note: 'Manubri da 3kg' },
          { min_reps: 12, max_reps: 15, weight_offset: 0 },
          { min_reps: 12, max_reps: 15, weight_offset: 0 },
          { min_reps: 12, max_reps: 15, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Rematore con manubri',
      muscle_group: 'Dorso',
      progression_type: null,
      rest_seconds: 75,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 10, max_reps: 12, weight_offset: 0, note: 'Manubri da 5kg' },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Shoulder Press con manubri',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 90,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 10, max_reps: 12, weight_offset: 0, note: 'Manubri da 3kg o 5kg' },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Superset: Curl + Kickback con manubri',
      muscle_group: 'Braccia',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 3,
      is_superset: true,
      superset_exercises: ['Curl bicipiti', 'Kickback tricipiti'],
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 12, weight_offset: 0, note: 'Manubri da 3kg' },
          { min_reps: 12, max_reps: 12, weight_offset: 0 },
          { min_reps: 12, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Lat pull-down con elastico',
      muscle_group: 'Dorso',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 15, max_reps: 15, weight_offset: 0, note: 'Tendi la banda tra le braccia sopra la testa' },
          { min_reps: 15, max_reps: 15, weight_offset: 0 },
          { min_reps: 15, max_reps: 15, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Russian Twist addominale',
      muscle_group: 'Addome',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 5,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 20, max_reps: 20, weight_offset: 0, note: 'Eventualmente con manubrio 3kg' },
          { min_reps: 20, max_reps: 20, weight_offset: 0 },
          { min_reps: 20, max_reps: 20, weight_offset: 0 },
        ],
      },
    },
  ],
};

const SCHEDA_C_CORPO_LIBERO = {
  name: 'Scheda C',
  description: 'Total Body Conditioning (HIIT & Tone)',
  sort_order: 2,
  exercises: [
    {
      exercise_name: 'Goblet Squat con manubrio',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 15, weight_offset: 0, note: 'Manubrio da 5kg al petto' },
          { min_reps: 12, max_reps: 15, weight_offset: 0 },
          { min_reps: 12, max_reps: 15, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Piegamenti sulle ginocchia',
      muscle_group: 'Petto',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 10, max_reps: 12, weight_offset: 0, note: 'Piegamenti facilitati' },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
          { min_reps: 10, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Ponte glutei singolo leg',
      muscle_group: 'Gambe',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 12, weight_offset: 0, note: '12 ripetizioni per lato' },
          { min_reps: 12, max_reps: 12, weight_offset: 0 },
          { min_reps: 12, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Mountain Climber',
      muscle_group: 'Addome',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 3,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 30, max_reps: 30, weight_offset: 0, note: '30 secondi di lavoro continuo' },
          { min_reps: 30, max_reps: 30, weight_offset: 0 },
          { min_reps: 30, max_reps: 30, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Alzate frontali con elastico',
      muscle_group: 'Spalle',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 12, max_reps: 12, weight_offset: 0, note: 'Sotto i piedi e tira in avanti' },
          { min_reps: 12, max_reps: 12, weight_offset: 0 },
          { min_reps: 12, max_reps: 12, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Bicycle Crunch',
      muscle_group: 'Addome',
      progression_type: null,
      rest_seconds: 45,
      sort_order: 5,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 20, max_reps: 20, weight_offset: 0, note: 'Alternato destra/sinistra' },
          { min_reps: 20, max_reps: 20, weight_offset: 0 },
          { min_reps: 20, max_reps: 20, weight_offset: 0 },
        ],
      },
    },
  ],
};

// ============================================
// Schede Cardio (Brucia Calorie & Resistenza)
// ============================================
const CARDIO_NO_EQUIPMENT = {
  name: 'Cardio (A Corpo Libero)',
  description: 'HIIT • Brucia Calorie • Senza Attrezzi (30m)',
  sort_order: 10,
  exercises: [
    {
      exercise_name: 'Corsa sul posto (Riscaldamento)',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 180, max_reps: 180, weight_offset: 0, note: '3 minuti di corsa leggera sul posto' },
        ],
      },
    },
    {
      exercise_name: 'Jumping Jacks',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 15,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 45, max_reps: 45, weight_offset: 0, note: '45 secondi di lavoro, 15s recupero' },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Mountain Climbers',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 15,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 45, max_reps: 45, weight_offset: 0, note: '45 secondi di lavoro, 15s recupero' },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Squat Jumps',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 15,
      sort_order: 3,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 45, max_reps: 45, weight_offset: 0, note: '45 secondi di lavoro, 15s recupero' },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Burpees',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 15,
      sort_order: 4,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 45, max_reps: 45, weight_offset: 0, note: '45 secondi di lavoro, 15s recupero' },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Plank Jacks',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 15,
      sort_order: 5,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 45, max_reps: 45, weight_offset: 0, note: '45 secondi di lavoro. Esegui il circuito per 3 Round!' },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
          { min_reps: 45, max_reps: 45, weight_offset: 0 },
        ],
      },
    },
  ],
};

const CARDIO_BOXING_ROPE = {
  name: 'Cardio (Corda & Sacco)',
  description: 'Pugilato HIIT • Corda + Sacco da Boxe (30m)',
  sort_order: 11,
  exercises: [
    {
      exercise_name: 'Riscaldamento corda',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 0,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 180, max_reps: 180, weight_offset: 0, note: '3 round x 3 min di salti corda' },
          { min_reps: 180, max_reps: 180, weight_offset: 0 },
          { min_reps: 180, max_reps: 180, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Sacco da boxe combinazioni',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 1,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 180, max_reps: 180, weight_offset: 0, note: '3 round x 3 min: jab, cross, ganci + movimento' },
          { min_reps: 180, max_reps: 180, weight_offset: 0 },
          { min_reps: 180, max_reps: 180, weight_offset: 0 },
        ],
      },
    },
    {
      exercise_name: 'Shadow Boxing / Finisher',
      muscle_group: 'Cardio',
      progression_type: null,
      rest_seconds: 60,
      sort_order: 2,
      is_superset: false,
      sets_config: {
        type: 'fixed',
        sets: [
          { min_reps: 180, max_reps: 180, weight_offset: 0, note: '2 round x 3 min a ritmo sostenuto' },
          { min_reps: 180, max_reps: 180, weight_offset: 0 },
        ],
      },
    },
  ],
};

export const INVICTUS_PLANS = [SCHEDA_A, SCHEDA_B, SCHEDA_C];
export const CORPO_LIBERO_PLANS = [SCHEDA_A_CORPO_LIBERO, SCHEDA_B_CORPO_LIBERO, SCHEDA_C_CORPO_LIBERO];
export const CARDIO_PLANS = [CARDIO_NO_EQUIPMENT, CARDIO_BOXING_ROPE];

/**
 * Seeds the user's workout plans into Supabase if they don't have any for the given program type.
 */
export async function seedUserPlans(userId, programType = 'invictus') {
  const plans = [];

  // 1. Seed active program plans
  const { data: existingActive } = await getUserPlans(userId, programType);
  const activeNeedsSeed = !existingActive || existingActive.filter(p => p.program_type === programType).length === 0;

  if (activeNeedsSeed) {
    const sourcePlans = programType === 'corpolibero' ? CORPO_LIBERO_PLANS : INVICTUS_PLANS;
    for (const planData of sourcePlans) {
      const { exercises, ...planFields } = planData;
      const { data: plan, error: planError } = await createPlan({
        ...planFields,
        user_id: userId,
        program_type: programType,
      });

      if (planError) {
        console.error('Error creating plan:', planError);
        continue;
      }

      const exerciseRows = exercises.map((ex) => ({
        ...ex,
        plan_id: plan.id,
        sets_config: ex.sets_config,
        superset_exercises: ex.superset_exercises || null,
      }));

      const { data: createdExercises, error: exError } = await createPlanExercises(exerciseRows);
      if (exError) console.error('Error creating exercises:', exError);

      plans.push({ ...plan, plan_exercises: createdExercises });
    }
  } else {
    plans.push(...existingActive.filter(p => p.program_type === programType));
  }

  // 2. Seed cardio plans if needed
  const cardioNeedsSeed = !existingActive || existingActive.filter(p => p.program_type === 'cardio').length === 0;

  if (cardioNeedsSeed) {
    for (const planData of CARDIO_PLANS) {
      const { exercises, ...planFields } = planData;
      const { data: plan, error: planError } = await createPlan({
        ...planFields,
        user_id: userId,
        program_type: 'cardio',
      });

      if (planError) {
        console.error('Error creating cardio plan:', planError);
        continue;
      }

      const exerciseRows = exercises.map((ex) => ({
        ...ex,
        plan_id: plan.id,
        sets_config: ex.sets_config,
        superset_exercises: ex.superset_exercises || null,
      }));

      const { data: createdExercises, error: exError } = await createPlanExercises(exerciseRows);
      if (exError) console.error('Error creating exercises:', exError);

      plans.push({ ...plan, plan_exercises: createdExercises });
    }
  } else {
    plans.push(...existingActive.filter(p => p.program_type === 'cardio'));
  }

  return plans;
}

/**
 * Returns the next plan to do based on the last completed session.
 */
export function getNextPlanIndex(lastPlanSortOrder) {
  if (lastPlanSortOrder === null || lastPlanSortOrder === undefined) return 0;
  // Make sure we only rotate A, B, C (sort_order 0, 1, 2)
  if (lastPlanSortOrder >= 10) return 0; // If they did cardio, suggest A
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
  Cardio: { bg: 'rgba(236, 72, 153, 0.12)', text: '#ec4899' },
};

/**
 * Plan card gradient colors
 */
export const PLAN_COLORS = {
  'Scheda A': { gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', emoji: '🏋️' },
  'Scheda B': { gradient: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)', emoji: '💪' },
  'Scheda C': { gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', emoji: '🔥' },
  'Cardio (A Corpo Libero)': { gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', emoji: '🏃' },
  'Cardio (Corda & Sacco)': { gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', emoji: '🥊' },
};
