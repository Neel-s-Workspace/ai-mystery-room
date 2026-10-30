import React from 'react';
import { Shield, Sparkles, CheckCircle2, ArrowRight, BookOpen, Compass, Target } from 'lucide-react';

export const WelcomeModal = ({ isOpen, onClose, username, onOpenGuide }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col">
        {/* Top Accent Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500" />

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Badge & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-950/60">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">
              WELCOME TO YOUR HEADQUARTERS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome, Investigator {username || 'Detective'}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-md mx-auto">
              Your classified detective account is active. Here is everything you need to know to solve your first AI-generated mystery:
            </p>
          </div>

          {/* Quick Steps Overview */}
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 flex-shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Create or Select a Mystery</h4>
                <p className="text-[11px] text-slate-400">
                  Type any custom crime scenario or choose a prebuilt archetype card (like Cyberpunk Lab or Alpine Chalet).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-mono font-bold text-indigo-400 flex-shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Examine 5 Forensic Evidence Desks</h4>
                <p className="text-[11px] text-slate-400">
                  Inspect Crime Briefings, WhatsApp chats, CCTV surveillance logs, zoomable forensic photos, and suspect dossiers.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center justify-center text-xs font-mono font-bold text-amber-400 flex-shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Spot the Alibi Contradiction</h4>
                <p className="text-[11px] text-slate-400">
                  Cross-reference timestamps between camera feeds and messages to catch which suspect is lying about their alibi.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-lg bg-rose-950 border border-rose-500/30 flex items-center justify-center text-xs font-mono font-bold text-rose-400 flex-shrink-0 mt-0.5">
                4
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Lodge Accusations & Score Points</h4>
                <p className="text-[11px] text-slate-400">
                  Earn +10 (Easy), +20 (Medium), or +30 (Hard) points for a correct verdict. Wrong answers deduct 10 points once.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {onOpenGuide && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGuide();
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Open Full Field Manual</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center space-x-2"
            >
              <span>Start Investigating</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
