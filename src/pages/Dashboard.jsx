import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Dumbbell, Calendar, Flame, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getUserPlans,
  getUserSessions,
  getExerciseHistory,
  getMainExerciseNames,
  getProfile,
} from '../lib/supabase';
import { seedUserPlans, getNextPlanIndex, PLAN_COLORS } from '../lib/seedData';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [exerciseNames, setExerciseNames] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [chartData, setChartData] = useState([]);
  const [nextPlan, setNextPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  useEffect(() => {
    if (selectedExercise && user) loadChartData();
  }, [selectedExercise, user]);

  async function loadData() {
    setLoading(true);

    // Load profile
    const { data: profileData } = await getProfile(user.id);
    setProfile(profileData);

    // Seed plans if needed
    let userPlans = [];
    const { data: existingPlans } = await getUserPlans(user.id);
    if (!existingPlans || existingPlans.length === 0) {
      userPlans = await seedUserPlans(user.id);
    } else {
      userPlans = existingPlans;
    }
    setPlans(userPlans);

    // Load sessions
    const { data: sessionsData } = await getUserSessions(user.id, 10);
    setSessions(sessionsData || []);

    // Determine next plan
    if (sessionsData && sessionsData.length > 0) {
      const lastSession = sessionsData[0];
      const lastPlan = userPlans.find((p) => p.id === lastSession.plan_id);
      const nextIdx = getNextPlanIndex(lastPlan?.sort_order);
      setNextPlan(userPlans[nextIdx] || userPlans[0]);
    } else {
      setNextPlan(userPlans[0]);
    }

    // Load exercise names for chart
    const { data: names } = await getMainExerciseNames(user.id);
    setExerciseNames(names || []);
    if (names && names.length > 0) {
      setSelectedExercise(names[0]);
    }

    setLoading(false);
  }

  async function loadChartData() {
    const { data } = await getExerciseHistory(user.id, selectedExercise, 20);
    if (data) {
      const formatted = data.map((d) => ({
        date: new Date(d.logged_at).toLocaleDateString('it-IT', {
          day: '2-digit',
          month: '2-digit',
        }),
        kg: d.weight_kg,
        reps: d.reps,
      }));
      setChartData(formatted);
    }
  }

  // Stats
  const totalSessions = sessions.length;
  const thisWeekSessions = sessions.filter((s) => {
    const d = new Date(s.started_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  const streak = (() => {
    if (sessions.length === 0) return 0;
    let count = 0;
    const now = new Date();
    // Simple streak: consecutive days with workouts
    for (let i = 0; i < sessions.length; i++) {
      const d = new Date(sessions[i].started_at);
      const daysDiff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      if (daysDiff <= count + 1) {
        count++;
      } else {
        break;
      }
    }
    return count;
  })();

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse" style={{ fontSize: '1.5rem' }}>🏋️ Caricamento...</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '0.8125rem',
          }}
        >
          <p className="font-mono" style={{ color: 'var(--accent-primary-light)', fontWeight: 600 }}>
            {payload[0].value} kg
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header animate-fade-in-up">
        <p className="page-subtitle">
          Ciao, {profile?.display_name || 'Atleta'} 👋
        </p>
        <h1 className="page-title">Dashboard</h1>
      </div>

      {/* Next workout CTA */}
      {nextPlan && (
        <div
          className="card animate-fade-in-up"
          onClick={() => navigate('/workout', { state: { planId: nextPlan.id } })}
          style={{
            cursor: 'pointer',
            background: PLAN_COLORS[nextPlan.name]?.gradient || 'var(--accent-gradient)',
            border: 'none',
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  opacity: 0.8,
                }}
              >
                Prossimo allenamento
              </p>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  marginTop: 4,
                }}
              >
                {nextPlan.name}
              </p>
              <p style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: 2 }}>
                {nextPlan.description}
              </p>
            </div>
            <ChevronRight size={28} style={{ opacity: 0.7 }} />
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }} className="stagger-children">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-primary-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dumbbell size={18} />
              {totalSessions}
            </div>
          </div>
          <div className="stat-label">Sessioni totali</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={18} />
              {thisWeekSessions}
            </div>
          </div>
          <div className="stat-label">Questa settimana</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={18} />
              {streak}
            </div>
          </div>
          <div className="stat-label">Streak</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="chart-container animate-fade-in-up" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="var(--accent-primary-light)" />
            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Progressione Carichi</span>
          </div>
        </div>

        {/* Exercise selector */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {exerciseNames.map((name) => (
            <button
              key={name}
              className={`badge ${selectedExercise === name ? 'badge-primary' : ''}`}
              onClick={() => setSelectedExercise(name)}
              style={{
                cursor: 'pointer',
                border: 'none',
                background:
                  selectedExercise === name
                    ? 'rgba(99,102,241,0.2)'
                    : 'var(--bg-secondary)',
                color:
                  selectedExercise === name
                    ? 'var(--accent-primary-light)'
                    : 'var(--text-secondary)',
                padding: '6px 12px',
                fontSize: '0.75rem',
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
                width={35}
                unit="kg"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="kg"
                stroke="#818cf8"
                strokeWidth={2.5}
                dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                activeDot={{ fill: '#a855f7', r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '0.875rem',
            }}
          >
            {exerciseNames.length > 0
              ? 'Completa qualche allenamento per vedere il grafico'
              : 'Nessun esercizio con progressione trovato'}
          </div>
        )}
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="section-title">Ultimi allenamenti</h2>
          <div className="stack stack-sm">
            {sessions.slice(0, 5).map((session) => {
              const planName = session.workout_plans?.name || 'Allenamento';
              const planColor = PLAN_COLORS[planName];
              return (
                <div key={session.id} className="history-item">
                  <div
                    className="history-icon"
                    style={{ background: planColor?.gradient || 'var(--bg-surface)' }}
                  >
                    {planColor?.emoji || '🏋️'}
                  </div>
                  <div className="history-details">
                    <div className="history-plan-name">{planName}</div>
                    <div className="history-date">
                      {new Date(session.started_at).toLocaleDateString('it-IT', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                  {session.duration_minutes && (
                    <div className="history-duration">
                      {session.duration_minutes}'
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
