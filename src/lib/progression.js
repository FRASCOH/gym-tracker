/**
 * Progression Logic for inVictus Academy workout plans.
 *
 * PPa — Progressione Principale a
 *   3 sets, weight drops -5kg per set, min 8 / max 12 reps
 *   Increment: +2.5kg (configurable) when ALL sets hit max reps
 *
 * PPb — Progressione Principale b
 *   4 sets, descending weight (-10kg if >100kg, -5kg if ≤100kg)
 *   Squat: min 10 / max 14 reps; Others: min 8 / max 12
 *   Increment: same logic as PPa
 *
 * PPc — Progressione Principale c
 *   4 sets, descending weight -10kg
 *   min 6 / max 10 reps (heavier loads)
 *   Increment: when all sets hit max reps
 */

const DEFAULT_INCREMENT = 2.5;

/**
 * Calculate the suggested weights for the next workout
 * based on the last session's performance.
 *
 * @param {string} progressionType - 'PPa', 'PPb', or 'PPc'
 * @param {Array} lastSets - Array of { set_number, weight_kg, reps, target_reps_min, target_reps_max }
 * @param {object} options - { increment: number }
 * @returns {object} { sets: Array<{ set_number, weight_kg, target_reps_min, target_reps_max }>, message, shouldIncrement }
 */
export function calculateNextProgression(progressionType, lastSets, options = {}) {
  const increment = options.increment ?? DEFAULT_INCREMENT;

  switch (progressionType) {
    case 'PPa':
      return calculatePPa(lastSets, increment);
    case 'PPb':
      return calculatePPb(lastSets, increment);
    case 'PPc':
      return calculatePPc(lastSets, increment);
    default:
      return calculateFixed(lastSets);
  }
}

function calculatePPa(lastSets, increment) {
  if (!lastSets || lastSets.length === 0) {
    return getDefaultPPa(0);
  }

  const sorted = [...lastSets].sort((a, b) => a.set_number - b.set_number);
  const baseWeight = sorted[0]?.weight_kg || 0;
  const maxReps = 12;
  const minReps = 8;

  // Check if all sets hit max reps
  const allMaxed = sorted.every((s) => s.reps >= maxReps);

  // Check if at least all sets hit minimum
  const allMinimum = sorted.every((s) => s.reps >= minReps);

  let newBase = baseWeight;
  let message = '';
  let shouldIncrement = false;

  if (allMaxed) {
    newBase = baseWeight + increment;
    message = `🔥 Incremento! +${increment}kg → ${newBase}kg`;
    shouldIncrement = true;
  } else if (allMinimum) {
    message = '💪 Stesso carico — punta a più ripetizioni';
  } else {
    message = '⚡ Mantieni il carico e lavora sulle reps';
  }

  return {
    sets: [
      { set_number: 1, weight_kg: newBase, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 2, weight_kg: newBase - 5, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 3, weight_kg: newBase - 10, target_reps_min: minReps, target_reps_max: maxReps },
    ],
    message,
    shouldIncrement,
  };
}

function calculatePPb(lastSets, increment) {
  if (!lastSets || lastSets.length === 0) {
    return getDefaultPPb(0);
  }

  const sorted = [...lastSets].sort((a, b) => a.set_number - b.set_number);
  const baseWeight = sorted[0]?.weight_kg || 0;
  const maxReps = sorted[0]?.target_reps_max || 12;
  const minReps = sorted[0]?.target_reps_min || 8;

  const allMaxed = sorted.every((s) => s.reps >= maxReps);
  const allMinimum = sorted.every((s) => s.reps >= minReps);

  let newBase = baseWeight;
  let message = '';
  let shouldIncrement = false;

  // Weight drop depends on the weight level
  const weightDrop = baseWeight > 100 ? 10 : 5;

  if (allMaxed) {
    newBase = baseWeight + increment;
    message = `🔥 Incremento! +${increment}kg → ${newBase}kg`;
    shouldIncrement = true;
  } else if (allMinimum) {
    message = '💪 Stesso carico — punta a più ripetizioni';
  } else {
    message = '⚡ Mantieni il carico e lavora sulle reps';
  }

  const newWeightDrop = newBase > 100 ? 10 : 5;

  return {
    sets: [
      { set_number: 1, weight_kg: newBase, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 2, weight_kg: newBase - newWeightDrop, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 3, weight_kg: newBase - newWeightDrop * 2, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 4, weight_kg: newBase - newWeightDrop * 3, target_reps_min: minReps, target_reps_max: maxReps },
    ],
    message,
    shouldIncrement,
  };
}

function calculatePPc(lastSets, increment) {
  if (!lastSets || lastSets.length === 0) {
    return getDefaultPPc(0);
  }

  const sorted = [...lastSets].sort((a, b) => a.set_number - b.set_number);
  const baseWeight = sorted[0]?.weight_kg || 0;
  const maxReps = 10;
  const minReps = 6;

  const allMaxed = sorted.every((s) => s.reps >= maxReps);
  const allMinimum = sorted.every((s) => s.reps >= minReps);

  let newBase = baseWeight;
  let message = '';
  let shouldIncrement = false;

  if (allMaxed) {
    newBase = baseWeight + increment;
    message = `🔥 Incremento! +${increment}kg → ${newBase}kg`;
    shouldIncrement = true;
  } else if (allMinimum) {
    message = '💪 Stesso carico — punta a più ripetizioni';
  } else {
    message = '⚡ Mantieni il carico e lavora sulle reps';
  }

  return {
    sets: [
      { set_number: 1, weight_kg: newBase, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 2, weight_kg: newBase - 10, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 3, weight_kg: newBase - 20, target_reps_min: minReps, target_reps_max: maxReps },
      { set_number: 4, weight_kg: newBase - 30, target_reps_min: minReps, target_reps_max: maxReps },
    ],
    message,
    shouldIncrement,
  };
}

function calculateFixed(lastSets) {
  if (!lastSets || lastSets.length === 0) {
    return { sets: [], message: 'Nessun dato precedente', shouldIncrement: false };
  }

  // For fixed schema exercises, just carry forward the same weights
  const sorted = [...lastSets].sort((a, b) => a.set_number - b.set_number);

  return {
    sets: sorted.map((s) => ({
      set_number: s.set_number,
      weight_kg: s.weight_kg,
      target_reps_min: s.target_reps_min,
      target_reps_max: s.target_reps_max,
    })),
    message: '📋 Carichi dalla sessione precedente',
    shouldIncrement: false,
  };
}

// Default configurations when no history exists
function getDefaultPPa(baseWeight) {
  return {
    sets: [
      { set_number: 1, weight_kg: baseWeight, target_reps_min: 8, target_reps_max: 12 },
      { set_number: 2, weight_kg: Math.max(0, baseWeight - 5), target_reps_min: 8, target_reps_max: 12 },
      { set_number: 3, weight_kg: Math.max(0, baseWeight - 10), target_reps_min: 8, target_reps_max: 12 },
    ],
    message: '🆕 Prima sessione — inserisci un carico che ti permetta 8 ripetizioni',
    shouldIncrement: false,
  };
}

function getDefaultPPb(baseWeight) {
  const drop = baseWeight > 100 ? 10 : 5;
  return {
    sets: [
      { set_number: 1, weight_kg: baseWeight, target_reps_min: 8, target_reps_max: 12 },
      { set_number: 2, weight_kg: Math.max(0, baseWeight - drop), target_reps_min: 8, target_reps_max: 12 },
      { set_number: 3, weight_kg: Math.max(0, baseWeight - drop * 2), target_reps_min: 8, target_reps_max: 12 },
      { set_number: 4, weight_kg: Math.max(0, baseWeight - drop * 3), target_reps_min: 8, target_reps_max: 12 },
    ],
    message: '🆕 Prima sessione — inserisci un carico che ti permetta 8 ripetizioni',
    shouldIncrement: false,
  };
}

function getDefaultPPc(baseWeight) {
  return {
    sets: [
      { set_number: 1, weight_kg: baseWeight, target_reps_min: 6, target_reps_max: 10 },
      { set_number: 2, weight_kg: Math.max(0, baseWeight - 10), target_reps_min: 6, target_reps_max: 10 },
      { set_number: 3, weight_kg: Math.max(0, baseWeight - 20), target_reps_min: 6, target_reps_max: 10 },
      { set_number: 4, weight_kg: Math.max(0, baseWeight - 30), target_reps_min: 6, target_reps_max: 10 },
    ],
    message: '🆕 Prima sessione — inserisci un carico che ti permetta 6 ripetizioni',
    shouldIncrement: false,
  };
}

/**
 * Get the progression config for display purposes
 */
export function getProgressionInfo(type) {
  const configs = {
    PPa: {
      label: 'PPa',
      description: '3 serie scalari, +2.5kg quando completi',
      color: '#6366f1',
      sets: 3,
    },
    PPb: {
      label: 'PPb',
      description: '4 serie decrescenti, carico adattivo',
      color: '#22d3ee',
      sets: 4,
    },
    PPc: {
      label: 'PPc',
      description: '4 serie decrescenti pesanti',
      color: '#f59e0b',
      sets: 4,
    },
  };
  return configs[type] || { label: type || 'Fisso', description: 'Schema fisso', color: '#94a3b8' };
}

/**
 * Parse a fixed sets_config and produce target sets
 */
export function parseFixedSets(setsConfig) {
  if (!setsConfig || setsConfig.type !== 'fixed') return [];

  return setsConfig.sets.map((s, i) => ({
    set_number: i + 1,
    target_reps_min: s.min_reps,
    target_reps_max: s.max_reps,
    weight_offset: s.weight_offset || 0,
  }));
}
