import React, { useState, useEffect } from 'react';
import { mysteryAPI } from '../services/api';
import { X, History, CheckCircle2, XCircle, Award, Calendar, Loader2, FileText } from 'lucide-react';

export const CaseHistoryModal = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const res = await mysteryAPI.getHistory();
          setHistory(res.data.history || []);
        } catch (err) {
          console.error('Failed to load history', err);
          setHistory([]);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Case Archives & Investigation Logs
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Your personal classified case records and verdicts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <p className="text-xs font-mono">Decrypting archive records...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              <p>No recorded case files found in your dossier yet.</p>
              <p className="text-slate-400 mt-1">Generate a mystery scenario to start your first inquiry!</p>
            </div>
          ) : (
            history.map((item) => {
              const displayName = item.mysteryName || item.caseTitle || 'Classified Case';
              return (
                <div
                  key={item._id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>{displayName}</span>
                      </span>
                      {item.status === 'solved' ? (
                        <span className="flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SOLVED</span>
                        </span>
                      ) : item.status === 'failed' ? (
                        <span className="flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
                          <XCircle className="w-3 h-3" />
                          <span>UNSOLVED</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.createdAt || item.completedAt || Date.now()).toLocaleDateString()}</span>
                      </span>
                      {item.accusedSuspectName && (
                        <span>Accused: <strong className="text-slate-400">{item.accusedSuspectName}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm font-bold font-mono justify-end">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className={item.scoreAwarded > 0 ? 'text-emerald-400' : item.scoreAwarded < 0 ? 'text-rose-400' : 'text-slate-400'}>
                        {item.scoreAwarded > 0 ? `+${item.scoreAwarded}` : item.scoreAwarded || 0} PTS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
