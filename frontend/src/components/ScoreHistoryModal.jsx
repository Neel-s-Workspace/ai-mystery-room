import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { 
  X, 
  Award, 
  Trophy, 
  Calendar, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  Flame, 
  Star,
  CheckCircle2
} from 'lucide-react';

export const ScoreHistoryModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const res = await authAPI.getScoreHistory();
          setData(res.data);
        } catch (err) {
          console.error('Failed to load score history:', err);
          // Fallback to user context state
          if (user) {
            setData({
              currentSession: user.currentSession || { sessionNumber: 1, pointsEarned: 0, loginAt: new Date() },
              sessionHistory: user.sessionHistory || [],
              lifetimeScore: user.stats?.lifetimeScore ?? user.stats?.score ?? 0,
              highestSessionScore: user.stats?.highestSessionScore ?? 0,
            });
          }
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const currentSession = data?.currentSession || user?.currentSession || { sessionNumber: 1, pointsEarned: 0, loginAt: new Date() };
  const history = data?.sessionHistory || user?.sessionHistory || [];
  const lifetimeScore = data?.lifetimeScore ?? user?.stats?.lifetimeScore ?? user?.stats?.score ?? 0;
  const highestSessionScore = data?.highestSessionScore ?? user?.stats?.highestSessionScore ?? 0;

  // Combine past sessions + active current session for complete chronological table
  const allSessions = [
    ...history,
    {
      sessionNumber: currentSession.sessionNumber,
      pointsEarned: currentSession.pointsEarned,
      date: currentSession.loginAt,
      isCurrent: true,
      highestSessionScore: highestSessionScore,
    },
  ].sort((a, b) => (b.sessionNumber || 0) - (a.sessionNumber || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/50">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                  PERFORMANCE ARCHIVES
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-0.5">
                Session & Lifetime Score History
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="p-6 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/40 border-b border-slate-800/80">
          {/* Current Session Points */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>CURRENT SESSION</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                #{currentSession.sessionNumber || 1}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {currentSession.pointsEarned || 0} <span className="text-xs font-normal text-slate-400">PTS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Resets to 0 at every new login
            </p>
          </div>

          {/* Lifetime Score */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span>LIFETIME POINTS</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {lifetimeScore} <span className="text-xs font-normal text-slate-400">PTS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Preserved forever across logins
            </p>
          </div>

          {/* Highest Session Score */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>PERSONAL BEST</span>
              <Star className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {highestSessionScore} <span className="text-xs font-normal text-slate-400">PTS</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Highest single session score
            </p>
          </div>
        </div>

        {/* Score History Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <p className="text-xs font-mono">Loading score records...</p>
            </div>
          ) : allSessions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              No session records found. Complete a case to record your first score!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] pb-2">
                    <th className="py-2.5 px-3">Session</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Points Earned</th>
                    <th className="py-2.5 px-3 text-center">Status / Best</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allSessions.map((s, idx) => {
                    const isBest = s.pointsEarned > 0 && s.pointsEarned >= highestSessionScore;
                    return (
                      <tr 
                        key={idx}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          s.isCurrent ? 'bg-cyan-950/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          <span className="flex items-center space-x-1.5">
                            <span>Session #{s.sessionNumber}</span>
                            {s.isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                ACTIVE
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{new Date(s.date || Date.now()).toLocaleDateString()}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-white">
                          <span className={s.pointsEarned > 0 ? 'text-emerald-400' : s.pointsEarned < 0 ? 'text-rose-400' : 'text-slate-300'}>
                            {s.pointsEarned > 0 ? `+${s.pointsEarned}` : s.pointsEarned} PTS
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {isBest ? (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/40 text-[10px]">
                              <Trophy className="w-3 h-3 text-amber-400" />
                              <span>Personal Best</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">
                              High: {highestSessionScore} pts
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <p className="text-[11px] font-mono text-slate-400">
            Personal best updates automatically whenever you reach a new highest score.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
