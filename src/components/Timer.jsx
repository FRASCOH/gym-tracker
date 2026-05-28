import { Play, Pause, SkipForward, RotateCcw, Plus } from 'lucide-react';

/**
 * Full-screen countdown timer overlay with circular progress.
 */
export default function Timer({ timer }) {
  const {
    remainingSeconds,
    isRunning,
    isVisible,
    progress,
    displayTime,
    pause,
    resume,
    reset,
    skip,
    addTime,
  } = timer;

  if (!isVisible) return null;

  const circumference = 2 * Math.PI * 108;
  const dashOffset = circumference * (1 - progress);
  const isFinished = remainingSeconds === 0;

  return (
    <div className="timer-overlay animate-fade-in">
      {/* Circular progress */}
      <div className="timer-circle">
        <svg viewBox="0 0 240 240">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <circle
            className="timer-circle-bg"
            cx="120"
            cy="120"
            r="108"
          />
          <circle
            className="timer-circle-progress"
            cx="120"
            cy="120"
            r="108"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>

        <div className="timer-value">
          <span
            className="timer-seconds"
            style={{
              color: isFinished
                ? 'var(--color-success)'
                : remainingSeconds <= 5
                ? 'var(--color-warning)'
                : 'var(--text-primary)',
            }}
          >
            {isFinished ? '✓' : displayTime}
          </span>
          <span className="timer-label">
            {isFinished ? 'Recupero completato!' : 'Recupero'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        {!isFinished && (
          <>
            <button
              className="btn btn-secondary btn-icon"
              onClick={reset}
              aria-label="Reset timer"
            >
              <RotateCcw size={20} />
            </button>

            <button
              className="btn btn-primary btn-icon"
              onClick={isRunning ? pause : resume}
              aria-label={isRunning ? 'Pausa' : 'Riprendi'}
              style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)' }}
            >
              {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
            </button>

            <button
              className="btn btn-secondary btn-icon"
              onClick={() => addTime(15)}
              aria-label="Aggiungi 15 secondi"
            >
              <Plus size={16} />
              <span style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)' }}>15</span>
            </button>
          </>
        )}
      </div>

      {/* Skip / Dismiss */}
      <button
        className="btn btn-ghost"
        onClick={skip}
        style={{ marginTop: 24, gap: 6 }}
      >
        <SkipForward size={16} />
        {isFinished ? 'Chiudi' : 'Salta recupero'}
      </button>
    </div>
  );
}
