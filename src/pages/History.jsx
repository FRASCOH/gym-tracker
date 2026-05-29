import { useEffect, useState } from 'react';
import { Calendar, Clock, Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserSessions, getSessionSets } from '../lib/supabase';
import { PLAN_COLORS, formatPlanTitle } from '../lib/seedData';

export default function History() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadSessions();
  }, [user]);

  async function loadSessions() {
    setLoading(true);
    const { data } = await getUserSessions(user.id, 50);
    setSessions(data || []);
    setLoading(false);
  }

  async function toggleSession(sessionId) {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      return;
    }

    setExpandedSession(sessionId);

    if (!sessionDetails[sessionId]) {
      const { data } = await getSessionSets(sessionId);
      setSessionDetails((prev) => ({
        ...prev,
        [sessionId]: data || [],
      }));
    }
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.5rem' }}>📚 Caricamento storico...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1 className="page-title">Storico</h1>
        <p className="page-subtitle">
          {sessions.length} {sessions.length === 1 ? 'allenamento' : 'allenamenti'} completati
        </p>
      </div>

      {sessions.length === 0 ? (
        <div
          className="card animate-fade-in-up"
          style={{
            textAlign: 'center',
            padding: 40,
            color: 'var(--text-secondary)',
          }}
        >
          <Dumbbell size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 4 }}>
            Nessun allenamento ancora
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            Completa il tuo primo allenamento per vederlo qui!
          </p>
        </div>
      ) : (
        <div className="stack stack-sm stagger-children">
          {sessions.map((session) => {
            const planName = session.workout_plans?.name || 'Allenamento';
            const planColor = PLAN_COLORS[planName];
            const isExpanded = expandedSession === session.id;
            const details = sessionDetails[session.id] || [];

            return (
              <div key={session.id}>
                <div
                  className="history-item"
                  onClick={() => toggleSession(session.id)}
                  style={{
                    borderRadius: isExpanded
                      ? 'var(--radius-lg) var(--radius-lg) 0 0'
                      : 'var(--radius-lg)',
                  }}
                >
                  <div
                    className="history-icon"
                    style={{ background: planColor?.gradient || 'var(--bg-elevated)' }}
                  >
                    {planColor?.emoji || '🏋️'}
                  </div>
                  <div className="history-details">
                    <div className="history-plan-name">{formatPlanTitle(planName)}</div>
                    <div className="history-date" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} />
                      {new Date(session.started_at).toLocaleDateString('it-IT', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  {session.duration_minutes && (
                    <div
                      className="history-duration"
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Clock size={12} />
                      {session.duration_minutes}'
                    </div>
                  )}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    className="animate-fade-in"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: 'none',
                      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                      padding: 16,
                    }}
                  >
                    {details.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: 20,
                          color: 'var(--text-tertiary)',
                          fontSize: '0.875rem',
                        }}
                      >
                        Caricamento dettagli...
                      </div>
                    ) : (
                      <div>
                        {/* Group by exercise */}
                        {(() => {
                          const grouped = {};
                          details.forEach((set) => {
                            const key = set.plan_exercise_id;
                            if (!grouped[key]) grouped[key] = [];
                            grouped[key].push(set);
                          });

                          return Object.entries(grouped).map(([exId, sets]) => (
                            <div key={exId} style={{ marginBottom: 12 }}>
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: 'var(--text-tertiary)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  marginBottom: 6,
                                }}
                              >
                                Esercizio
                              </div>
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '32px 1fr 1fr',
                                  gap: '4px 8px',
                                  fontSize: '0.8125rem',
                                }}
                              >
                                {sets
                                  .sort((a, b) => a.set_number - b.set_number)
                                  .map((set) => (
                                    <div
                                      key={set.id}
                                      style={{
                                        display: 'contents',
                                      }}
                                    >
                                      <span
                                        className="font-mono"
                                        style={{
                                          color: 'var(--text-tertiary)',
                                          textAlign: 'center',
                                        }}
                                      >
                                        {set.set_number}
                                      </span>
                                      <span
                                        className="font-mono"
                                        style={{ color: 'var(--accent-primary-light)' }}
                                      >
                                        {set.weight_kg} kg
                                      </span>
                                      <span
                                        className="font-mono"
                                        style={{
                                          color:
                                            set.reps >= (set.target_reps_max || 12)
                                              ? 'var(--color-success)'
                                              : set.reps >= (set.target_reps_min || 8)
                                              ? 'var(--color-warning)'
                                              : 'var(--color-danger)',
                                        }}
                                      >
                                        {set.reps} reps
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
