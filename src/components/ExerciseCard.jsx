import { useState } from 'react';
import { Timer as TimerIcon, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import SetRow from './SetRow';
import { getProgressionInfo } from '../lib/progression';
import { MUSCLE_GROUP_COLORS } from '../lib/seedData';

/**
 * Exercise card containing all sets for a single exercise.
 * Used in the Active Workout page.
 */
export default function ExerciseCard({
  exercise,
  sets,
  progressionMessage,
  onSetUpdate,
  onSetComplete,
  isActive,
}) {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const progressionInfo = getProgressionInfo(exercise.progression_type);
  const muscleColor = MUSCLE_GROUP_COLORS[exercise.muscle_group] || {
    bg: 'rgba(148,163,184,0.12)',
    text: '#94a3b8',
  };

  const completedSets = sets.filter((s) => s.isCompleted).length;
  const totalSets = sets.length;
  const allComplete = completedSets === totalSets && totalSets > 0;

  function formatRest(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (sec === 0) return `${min}'`;
    return `${min}'${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div
      className={`exercise-card ${allComplete ? 'animate-fade-in' : ''}`}
      style={{
        borderColor: allComplete ? 'var(--color-success)' : undefined,
        opacity: allComplete ? 0.75 : 1,
      }}
    >
      {/* Header */}
      <div
        className="exercise-card-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="exercise-name">{exercise.exercise_name}</span>
            {exercise.is_superset && (
              <span className="badge badge-warning" style={{ fontSize: '0.625rem' }}>
                <Zap size={10} style={{ marginRight: 2 }} />
                SUPERSET
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="badge"
              style={{ background: muscleColor.bg, color: muscleColor.text }}
            >
              {exercise.muscle_group}
            </span>
            {exercise.progression_type && (
              <span
                className="badge"
                style={{
                  background: `${progressionInfo.color}20`,
                  color: progressionInfo.color,
                }}
              >
                {progressionInfo.label}
              </span>
            )}
          </div>
        </div>

        <div className="exercise-meta">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--text-tertiary)',
              fontSize: '0.8125rem',
            }}
          >
            <TimerIcon size={14} />
            <span className="font-mono">{formatRest(exercise.rest_seconds)}</span>
          </div>

          <div
            style={{
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              color: allComplete ? 'var(--color-success)' : 'var(--text-secondary)',
            }}
          >
            {completedSets}/{totalSets}
          </div>

          {isExpanded ? (
            <ChevronUp size={18} color="var(--text-tertiary)" />
          ) : (
            <ChevronDown size={18} color="var(--text-tertiary)" />
          )}
        </div>
      </div>

      {/* Body — Sets */}
      {isExpanded && (
        <div className="exercise-card-body animate-fade-in">
          {/* Progression message */}
          {progressionMessage && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-gradient-subtle)',
                fontSize: '0.8125rem',
                marginBottom: 8,
                color: 'var(--text-accent)',
              }}
            >
              {progressionMessage}
            </div>
          )}

          {/* Superset note */}
          {exercise.is_superset && exercise.superset_exercises && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-warning-bg)',
                fontSize: '0.75rem',
                marginBottom: 8,
                color: 'var(--color-warning)',
              }}
            >
              Esegui in sequenza: {exercise.superset_exercises.join(' → ')}
            </div>
          )}

          {/* Header labels */}
          <div className="set-header">
            <span style={{ textAlign: 'center' }}>#</span>
            <span style={{ textAlign: 'center' }}>KG</span>
            <span style={{ textAlign: 'center' }}>REPS</span>
            <span></span>
          </div>

          {/* Set rows */}
          {sets.map((set, idx) => (
            <SetRow
              key={idx}
              setNumber={set.set_number}
              targetWeight={set.target_weight_kg}
              targetRepsMin={set.target_reps_min}
              targetRepsMax={set.target_reps_max}
              weight={set.weight_kg}
              reps={set.reps}
              notes={set.notes}
              isCompleted={set.isCompleted}
              onUpdate={(data) => onSetUpdate(idx, data)}
              onComplete={() => onSetComplete(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
