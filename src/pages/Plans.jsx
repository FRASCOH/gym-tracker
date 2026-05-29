import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserPlans, getProfile } from '../lib/supabase';
import { seedUserPlans, MUSCLE_GROUP_COLORS, PLAN_COLORS } from '../lib/seedData';
import { getProgressionInfo } from '../lib/progression';

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadPlans();
  }, [user]);

  async function loadPlans() {
    setLoading(true);
    // Fetch profile to get active_program
    const { data: profileData } = await getProfile(user.id);
    setProfile(profileData);

    const activeProg = profileData?.active_program || 'invictus';

    const { data } = await getUserPlans(user.id, activeProg);
    if (!data || data.length === 0) {
      const seeded = await seedUserPlans(user.id, activeProg);
      setPlans(seeded);
    } else {
      setPlans(data);
    }
    setLoading(false);
  }

  function startWorkout(planId) {
    navigate('/workout', { state: { planId } });
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.5rem' }}>📋 Caricamento schede...</div>
      </div>
    );
  }

  // Group exercises by muscle group for display
  function groupByMuscle(exercises) {
    const groups = {};
    exercises?.forEach((ex) => {
      if (!groups[ex.muscle_group]) groups[ex.muscle_group] = [];
      groups[ex.muscle_group].push(ex);
    });
    return groups;
  }

  function formatRest(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (sec === 0) return `${min}'`;
    return `${min}'${sec.toString().padStart(2, '0')}`;
  }

  function formatSetsConfig(ex) {
    if (ex.progression_type) {
      const info = getProgressionInfo(ex.progression_type);
      return info.label;
    }
    const config = ex.sets_config;
    if (config?.type === 'fixed' && config.sets) {
      const count = config.sets.length;
      const firstSet = config.sets[0];
      return `${count}× ${firstSet.min_reps}-${firstSet.max_reps}`;
    }
    return '—';
  }

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1 className="page-title">Le tue Schede</h1>
        <p className="page-subtitle">
          {profile?.active_program === 'corpolibero'
            ? 'Corpo Libero & Elastici'
            : 'Metodo inVictus Academy'}
        </p>
      </div>

      <div className="stack stack-lg stagger-children">
        {plans.map((plan) => {
          const planColor = PLAN_COLORS[plan.name];
          const isExpanded = expandedPlan === plan.id;
          const muscleGroups = groupByMuscle(plan.plan_exercises);
          const uniqueMuscles = Object.keys(muscleGroups);

          return (
            <div key={plan.id} className="plan-card">
              {/* Plan header */}
              <div
                onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div
                      className="plan-card-letter text-gradient"
                      style={{
                        background: planColor?.gradient || 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {plan.name.replace('Scheda ', '')}
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{plan.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {plan.description}
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    color="var(--text-tertiary)"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      marginTop: 12,
                    }}
                  />
                </div>

                {/* Muscle group badges */}
                <div className="plan-card-muscles">
                  {uniqueMuscles.map((muscle) => {
                    const color = MUSCLE_GROUP_COLORS[muscle];
                    return (
                      <span
                        key={muscle}
                        className="badge"
                        style={{ background: color?.bg, color: color?.text }}
                      >
                        {muscle}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Expanded exercise list */}
              {isExpanded && (
                <div className="animate-fade-in" style={{ marginTop: 16 }}>
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 16,
                    }}
                  >
                    {Object.entries(muscleGroups).map(([muscle, exercises]) => (
                      <div key={muscle} style={{ marginBottom: 16 }}>
                        <div
                          className="section-title"
                          style={{
                            color: MUSCLE_GROUP_COLORS[muscle]?.text || 'var(--text-tertiary)',
                          }}
                        >
                          {muscle}
                        </div>
                        {exercises.map((ex) => (
                          <div
                            key={ex.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 0',
                              borderBottom: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div>
                              <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                                {ex.exercise_name}
                              </span>
                              {ex.is_superset && (
                                <span
                                  style={{
                                    marginLeft: 6,
                                    fontSize: '0.625rem',
                                    color: 'var(--color-warning)',
                                  }}
                                >
                                  ⚡ SS
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                fontSize: '0.8125rem',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <span
                                className="font-mono"
                                style={{
                                  color: ex.progression_type
                                    ? getProgressionInfo(ex.progression_type).color
                                    : 'var(--text-tertiary)',
                                  fontWeight: 600,
                                }}
                              >
                                {formatSetsConfig(ex)}
                              </span>
                              <span className="font-mono" style={{ color: 'var(--text-tertiary)' }}>
                                {formatRest(ex.rest_seconds)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Start workout button */}
                  <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={() => startWorkout(plan.id)}
                    style={{ marginTop: 8 }}
                  >
                    <Play size={18} />
                    Inizia {plan.name}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
