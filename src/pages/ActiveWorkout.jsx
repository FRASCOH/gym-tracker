import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Square, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../hooks/useTimer';
import {
  getUserPlans,
  getLastSession,
  startSession,
  completeSession,
  logSet as saveSetToDb,
} from '../lib/supabase';
import { calculateNextProgression } from '../lib/progression';
import { seedUserPlans, PLAN_COLORS } from '../lib/seedData';
import ExerciseCard from '../components/ExerciseCard';
import Timer from '../components/Timer';

export default function ActiveWorkout() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const timer = useTimer();

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [exerciseSets, setExerciseSets] = useState({});
  const [progressionMessages, setProgressionMessages] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Elapsed time ticker
  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  // Load plans
  useEffect(() => {
    if (user) loadPlans();
  }, [user]);

  // Auto-select plan from navigation state
  useEffect(() => {
    if (location.state?.planId && plans.length > 0) {
      setSelectedPlanId(location.state.planId);
    }
  }, [location.state, plans]);

  // Load plan details when selected
  useEffect(() => {
    if (selectedPlanId && plans.length > 0) {
      const plan = plans.find((p) => p.id === selectedPlanId);
      setSelectedPlan(plan);
      if (plan) loadLastSessionData(plan);
    }
  }, [selectedPlanId, plans]);

  async function loadPlans() {
    setLoading(true);
    const { data } = await getUserPlans(user.id);
    if (!data || data.length === 0) {
      const seeded = await seedUserPlans(user.id);
      setPlans(seeded);
    } else {
      setPlans(data);
    }
    setLoading(false);
  }

  async function loadLastSessionData(plan) {
    const exercises = plan.plan_exercises || [];
    const { data: lastSession } = await getLastSession(user.id, plan.id);

    const newSets = {};
    const newMessages = {};

    for (const exercise of exercises) {
      const exId = exercise.id;

      // Get last sets for this exercise
      const lastSets = lastSession?.session_sets?.filter(
        (s) => s.plan_exercise_id === exId
      ) || [];

      if (exercise.progression_type) {
        // Use progression logic
        const result = calculateNextProgression(
          exercise.progression_type,
          lastSets,
          { increment: exercise.sets_config?.increment || 2.5 }
        );

        newSets[exId] = result.sets.map((s) => ({
          set_number: s.set_number,
          target_weight_kg: s.weight_kg,
          target_reps_min: s.target_reps_min,
          target_reps_max: s.target_reps_max,
          weight_kg: s.weight_kg || null,
          reps: null,
          notes: '',
          isCompleted: false,
        }));
        newMessages[exId] = result.message;
      } else {
        // Fixed schema
        const config = exercise.sets_config;
        if (config?.type === 'fixed' && config.sets) {
          const baseWeight = lastSets.length > 0 ? lastSets[0]?.weight_kg : null;

          newSets[exId] = config.sets.map((setConfig, idx) => {
            const lastSet = lastSets.find((s) => s.set_number === idx + 1);
            const targetWeight = lastSet
              ? lastSet.weight_kg
              : baseWeight
              ? baseWeight + (setConfig.weight_offset || 0)
              : null;

            return {
              set_number: idx + 1,
              target_weight_kg: targetWeight,
              target_reps_min: setConfig.min_reps,
              target_reps_max: setConfig.max_reps,
              weight_kg: targetWeight,
              reps: null,
              notes: '',
              isCompleted: false,
            };
          });
          newMessages[exId] = lastSets.length > 0
            ? '📋 Carichi dalla sessione precedente'
            : '🆕 Prima sessione — inserisci il tuo carico';
        }
      }
    }

    setExerciseSets(newSets);
    setProgressionMessages(newMessages);
  }

  async function handleStartWorkout() {
    if (!selectedPlanId) return;

    const { data: session, error } = await startSession(user.id, selectedPlanId);
    if (error) {
      console.error('Error starting session:', error);
      return;
    }
    setSessionId(session.id);
    setIsWorkoutActive(true);
    setElapsedSeconds(0);
  }

  function handleSetUpdate(exerciseId, setIdx, data) {
    setExerciseSets((prev) => {
      const updated = { ...prev };
      const sets = [...(updated[exerciseId] || [])];
      sets[setIdx] = {
        ...sets[setIdx],
        weight_kg: data.weight,
        reps: data.reps,
        notes: data.notes,
      };
      updated[exerciseId] = sets;
      return updated;
    });
  }

  const handleSetComplete = useCallback(
    async (exerciseId, setIdx, restSeconds) => {
      // Mark as completed locally
      setExerciseSets((prev) => {
        const updated = { ...prev };
        const sets = [...(updated[exerciseId] || [])];
        sets[setIdx] = { ...sets[setIdx], isCompleted: true };
        updated[exerciseId] = sets;
        return updated;
      });

      // Save to DB
      if (sessionId) {
        const set = exerciseSets[exerciseId]?.[setIdx];
        if (set) {
          await saveSetToDb({
            session_id: sessionId,
            plan_exercise_id: exerciseId,
            set_number: set.set_number,
            weight_kg: set.weight_kg || 0,
            reps: set.reps || 0,
            target_weight_kg: set.target_weight_kg,
            target_reps_min: set.target_reps_min,
            target_reps_max: set.target_reps_max,
            notes: set.notes || null,
            is_completed: true,
          });
        }
      }

      // Start rest timer
      if (restSeconds > 0) {
        timer.start(restSeconds);
      }
    },
    [sessionId, exerciseSets, timer]
  );

  async function handleFinishWorkout() {
    if (!sessionId) return;
    setSaving(true);

    await completeSession(sessionId, null);

    setSaving(false);
    setIsWorkoutActive(false);
    setSessionId(null);
    navigate('/', { replace: true });
  }

  function formatElapsed(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  // Count completed
  const totalSets = Object.values(exerciseSets).reduce((sum, sets) => sum + sets.length, 0);
  const completedSets = Object.values(exerciseSets).reduce(
    (sum, sets) => sum + sets.filter((s) => s.isCompleted).length,
    0
  );
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.5rem' }}>🏋️ Caricamento...</div>
      </div>
    );
  }

  // Plan selection if none chosen
  if (!selectedPlanId) {
    return (
      <div className="page">
        <div className="page-header animate-fade-in-up">
          <h1 className="page-title">Allenati</h1>
          <p className="page-subtitle">Scegli la scheda per iniziare</p>
        </div>

        <div className="stack stack-md stagger-children">
          {plans.map((plan) => {
            const planColor = PLAN_COLORS[plan.name];
            return (
              <div
                key={plan.id}
                className="plan-card"
                onClick={() => setSelectedPlanId(plan.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div
                      className="plan-card-letter"
                      style={{
                        background: planColor?.gradient || 'var(--accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '2rem',
                      }}
                    >
                      {plan.name.replace('Scheda ', '')}
                    </div>
                    <div style={{ fontWeight: 700 }}>{plan.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {plan.description} • {plan.plan_exercises?.length || 0} esercizi
                    </div>
                  </div>
                  <Play size={24} color="var(--accent-primary-light)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Timer overlay */}
      <Timer timer={timer} />

      {/* Workout header */}
      <div className="page-header animate-fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">{selectedPlan?.name || 'Allenamento'}</h1>
            <p className="page-subtitle">{selectedPlan?.description}</p>
          </div>
          {isWorkoutActive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: 'var(--color-success)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              <Clock size={16} />
              {formatElapsed(elapsedSeconds)}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {isWorkoutActive && (
        <div style={{ marginBottom: 16 }} className="animate-fade-in">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span>Progresso</span>
            <span className="font-mono">
              {completedSets}/{totalSets} serie
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'var(--accent-gradient)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Start button */}
      {!isWorkoutActive && (
        <button
          className="btn btn-primary btn-full btn-lg animate-fade-in-up"
          onClick={handleStartWorkout}
          style={{ marginBottom: 20 }}
          id="start-workout-btn"
        >
          <Play size={20} />
          Inizia Allenamento
        </button>
      )}

      {/* Exercise list */}
      <div className="stack stack-md">
        {selectedPlan?.plan_exercises?.map((exercise, idx) => {
          const sets = exerciseSets[exercise.id] || [];
          const allComplete = sets.length > 0 && sets.every((s) => s.isCompleted);
          const firstIncomplete = !sets.some((s) => s.isCompleted) && idx === 0;

          // Find first exercise with incomplete sets
          const currentExerciseIdx = selectedPlan.plan_exercises.findIndex((ex) => {
            const exSets = exerciseSets[ex.id] || [];
            return exSets.some((s) => !s.isCompleted);
          });

          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              sets={sets}
              progressionMessage={progressionMessages[exercise.id]}
              isActive={idx === currentExerciseIdx || firstIncomplete}
              onSetUpdate={(setIdx, data) => handleSetUpdate(exercise.id, setIdx, data)}
              onSetComplete={(setIdx) =>
                handleSetComplete(exercise.id, setIdx, exercise.rest_seconds)
              }
            />
          );
        })}
      </div>

      {/* Finish workout */}
      {isWorkoutActive && (
        <div style={{ marginTop: 24, paddingBottom: 20 }} className="animate-fade-in-up">
          <button
            className="btn btn-success btn-full btn-lg"
            onClick={handleFinishWorkout}
            disabled={saving}
            id="finish-workout-btn"
          >
            {saving ? (
              <span className="animate-pulse">Salvataggio...</span>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Termina Allenamento
              </>
            )}
          </button>

          {/* Cancel */}
          <button
            className="btn btn-ghost btn-full"
            onClick={() => {
              setIsWorkoutActive(false);
              setSessionId(null);
              setSelectedPlanId(null);
              setElapsedSeconds(0);
            }}
            style={{ marginTop: 8, color: 'var(--color-danger)' }}
          >
            <Square size={14} />
            Annulla allenamento
          </button>
        </div>
      )}
    </div>
  );
}
