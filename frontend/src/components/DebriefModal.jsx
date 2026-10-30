import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  Shield, 
  FileText, 
  Quote, 
  ArrowRight, 
  MinusCircle, 
  AlertOctagon,
  TrendingUp,
  Flame,
  Compass
} from 'lucide-react';

export const DebriefModal = ({
  isOpen,
  onClose,
  resolutionData,
  onPlayAgain,
}) => {
  if (!isOpen || !resolutionData) return null;

  const { 
    isCorrect, 
    accusedSuspect, 
    trueCulprit, 
    solutionExplanation, 
    pointsAwarded, 
    verdictTitle, 
    difficulty,
    userStats,
    currentSession 
  } = resolutionData;

  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#10B981', '#F59E0B', '#6366F1'],
      });
    }
  }, [isCorrect]);

  const sessionPoints = currentSession?.pointsEarned ?? 0;
  const highestScore = userStats?.highestSessionScore ?? 0;
  const lifetimeScore = userStats?.lifetimeScore ?? userStats?.score ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Banner */}
        <div
          className={`p-6 text-center border-b ${
            isCorrect
              ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-800/60'
              : 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-800/60'
          }`}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-lg">
            {isCorrect ? (
              <div className="bg-emerald-950 border border-emerald-500/50 p-3 rounded-2xl text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="bg-rose-950 border border-rose-500/50 p-3 rounded-2xl text-rose-400">
                <AlertOctagon className="w-8 h-8" />
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase font-mono">
            {isCorrect ? 'CASE SOLVED • VERDICT UPHELD' : 'Wrong answer'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            {isCorrect ? (
              <span>
                Outstanding deduction! You successfully exposed <strong className="text-emerald-300">{trueCulprit?.name}</strong> as the true perpetrator.
              </span>
            ) : (
              <span>
                You charged <strong className="text-rose-300">{accusedSuspect?.name}</strong>, but the true culprit was <strong className="text-amber-300">{trueCulprit?.name}</strong> ({trueCulprit?.role})!
              </span>
            )}
          </p>

          {/* Points Pill (Shows Difficulty Points or -10 Points deduction) */}
          <div className="mt-3 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-950/90 border border-slate-800 text-xs font-mono">
            {isCorrect ? (
              <>
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">
                  +{pointsAwarded} Points Awarded ({difficulty ? difficulty.toUpperCase() : 'CASE'} SOLVED)
                </span>
              </>
            ) : (
              <>
                <MinusCircle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-400 font-bold">
                  {pointsAwarded} Points Deducted (-10 PTS)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Real-time Session & Lifetime Scoreboard */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Session Score</span>
              <span className="text-base sm:text-lg font-black text-cyan-400">{sessionPoints} pts</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Highest Score</span>
              <span className="text-base sm:text-lg font-black text-amber-400">{highestScore} pts</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lifetime Score</span>
              <span className="text-base sm:text-lg font-black text-emerald-400">{lifetimeScore} pts</span>
            </div>
          </div>

          {/* Revealed Culprit Info if Wrong */}
          {!isCorrect && trueCulprit && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-500/30 space-y-1">
              <span className="text-[11px] font-mono uppercase text-rose-400 font-bold block">
                Revealed Perpetrator Identity
              </span>
              <p className="text-sm font-bold text-white">
                {trueCulprit.name} <span className="text-slate-400 font-normal">({trueCulprit.role})</span>
              </p>
            </div>
          )}

          {/* Culprit Confession */}
          {trueCulprit?.confession && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 relative">
              <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase font-bold mb-2">
                <Quote className="w-4 h-4" />
                <span>Culprit’s Signed Confession ({trueCulprit.name})</span>
              </div>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed italic font-serif">
                "{trueCulprit.confession}"
              </p>
            </div>
          )}

          {/* Forensic Deduction Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase font-bold">
              <FileText className="w-4 h-4" />
              <span>Full Investigation Debrief & Deduction Chain</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {solutionExplanation}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs transition-colors"
          >
            Review Evidence Board
          </button>

          {/* Solve New Mystery Button */}
          <button
            onClick={onPlayAgain}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg shadow-cyan-950/50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Solve New Mystery</span>
          </button>
        </div>
      </div>
    </div>
  );
};
