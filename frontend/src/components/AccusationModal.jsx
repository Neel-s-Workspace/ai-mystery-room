import React, { useState, useEffect } from 'react';
import { X, Target, AlertTriangle, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

export const AccusationModal = ({
  isOpen,
  onClose,
  suspects = [],
  preselectedSuspectId = null,
  onSubmitAccusation,
  submitting,
}) => {
  const [selectedSuspectId, setSelectedSuspectId] = useState(preselectedSuspectId || '');
  const [playerNotes, setPlayerNotes] = useState('');

  // Sync selected suspect whenever modal opens or preselected suspect changes
  useEffect(() => {
    if (isOpen) {
      if (preselectedSuspectId) {
        setSelectedSuspectId(preselectedSuspectId);
      } else {
        setSelectedSuspectId(''); // Do not automatically select or focus on the first option!
      }
    }
  }, [isOpen, preselectedSuspectId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSuspectId) return;
    onSubmitAccusation(selectedSuspectId, playerNotes);
  };

  const currentSuspect = suspects.find((s) => s.suspectId === selectedSuspectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-red-900/60 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Top Warning Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 bg-slate-950/60">
          <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-3 shadow-lg shadow-red-950/50">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Lodge Formal Accusation
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            This will conclude the investigation and submit your evidence to the court.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Suspect Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2">
              Select Prime Perpetrator
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {suspects.map((suspect) => {
                const isSelected = selectedSuspectId === suspect.suspectId;
                return (
                  <button
                    key={suspect.suspectId}
                    type="button"
                    onClick={() => setSelectedSuspectId(suspect.suspectId)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500 text-white shadow-md shadow-red-950/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                      <img
                        src={suspect.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={suspect.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-100 truncate">
                        {suspect.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {suspect.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Player Deduction Notes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2">
              Investigative Deductions & Evidence Chain (Optional)
            </label>
            <textarea
              rows={3}
              value={playerNotes}
              onChange={(e) => setPlayerNotes(e.target.value)}
              placeholder="Explain how you caught them (e.g. CCTV showed them at 11:28 PM entering the emergency stairs, breaking their alibi)..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 text-xs resize-none font-sans"
            />
          </div>

          {/* Warning Banner */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-start space-x-2.5 font-mono">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
            <span>
              Once accused, the full truth will be revealed and your detective score will be permanently calculated.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !selectedSuspectId}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-950/60 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Issuing Arrest Warrant...</span>
              </>
            ) : (
              <span>Confirm & Charge {currentSuspect ? currentSuspect.name : 'Suspect'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
