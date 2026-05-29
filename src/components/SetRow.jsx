import { useState } from 'react';
import { Check, MessageSquare } from 'lucide-react';

/**
 * A single set row with weight/reps inputs and completion checkbox.
 * Shows visual feedback based on target reps achieved.
 */
export default function SetRow({
  setNumber,
  targetWeight,
  targetRepsMin,
  targetRepsMax,
  weight,
  reps,
  notes,
  isCompleted,
  onUpdate,
  onComplete,
}) {
  const [showNotes, setShowNotes] = useState(false);

  function getRepsClass() {
    if (!reps || !isCompleted) return '';
    if (reps >= targetRepsMax) return 'target-hit';
    if (reps >= targetRepsMin) return 'target-close';
    return 'target-miss';
  }

  function handleWeightChange(e) {
    const val = e.target.value === '' ? '' : parseFloat(e.target.value);
    onUpdate({ weight: val, reps, notes });
  }

  function handleRepsChange(e) {
    const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    onUpdate({ weight, reps: val, notes });
  }

  function handleNotesChange(e) {
    onUpdate({ weight, reps, notes: e.target.value });
  }

  function handleComplete() {
    if (!isCompleted) {
      onComplete();
    }
  }

  return (
    <div className={`set-row ${isCompleted ? 'completed' : ''}`}>
      {/* Set number */}
      <div className="set-number">{setNumber}</div>

      {/* Weight input */}
      <div className="set-input-group">
        <input
          type="number"
          className="set-input input-mono"
          placeholder={targetWeight > 0 ? String(targetWeight) : '—'}
          value={weight ?? ''}
          onChange={handleWeightChange}
          step="0.5"
          min="0"
          inputMode="decimal"
          disabled={isCompleted}
        />
        {targetWeight > 0 ? (
          <span className="target-indicator">target: {targetWeight}</span>
        ) : (
          <span className="target-indicator" style={{ visibility: 'hidden' }}>—</span>
        )}
      </div>

      {/* Reps input */}
      <div className="set-input-group">
        <input
          type="number"
          className={`set-input input-mono ${getRepsClass()}`}
          placeholder={`${targetRepsMin}-${targetRepsMax}`}
          value={reps ?? ''}
          onChange={handleRepsChange}
          step="1"
          min="0"
          inputMode="numeric"
          disabled={isCompleted}
        />
        <span className="target-indicator">
          {targetRepsMin}-{targetRepsMax}
        </span>
      </div>

      {/* Complete button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <button
          className={`set-check ${isCompleted ? 'checked' : ''}`}
          onClick={handleComplete}
          disabled={isCompleted}
          aria-label={`Completa serie ${setNumber}`}
        >
          <Check size={20} />
        </button>
        {!isCompleted && (
          <button
            className="btn btn-ghost"
            onClick={() => setShowNotes(!showNotes)}
            style={{ padding: 4, width: 28, height: 28 }}
            aria-label="Note"
          >
            <MessageSquare size={12} />
          </button>
        )}
      </div>

      {/* Notes (expanded) */}
      {showNotes && !isCompleted && (
        <div style={{ gridColumn: '1 / -1', marginTop: 4 }}>
          <input
            type="text"
            className="input input-compact"
            placeholder="Note per questa serie..."
            value={notes || ''}
            onChange={handleNotesChange}
          />
        </div>
      )}
    </div>
  );
}
