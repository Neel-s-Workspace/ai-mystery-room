import React from 'react';
import { Users, User, ShieldAlert, Target, HeartHandshake, HelpCircle } from 'lucide-react';

export const SuspectsViewer = ({ suspects = [], onNominateSuspect }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Users className="w-4 h-4" />
          <span className="font-bold uppercase">Prime Suspect Dossiers ({suspects.length} Persons of Interest)</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          One suspect committed the crime; their alibi will collapse under evidence
        </span>
      </div>

      {/* Suspect Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suspects.map((suspect, idx) => {
          const avatar = suspect.avatarUrl || `https://images.unsplash.com/photo-${1534528741775 + idx}?w=400&auto=format&fit=crop&q=80`;

          return (
            <div
              key={suspect.suspectId || idx}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
            >
              <div>
                {/* Header: Photo + Name/Role */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-950">
                    <img
                      src={avatar}
                      alt={suspect.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                      SUSPECT #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                      {suspect.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {suspect.role}
                    </p>
                  </div>
                </div>

                {/* Stated Alibi */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Stated Alibi</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans italic">
                      "{suspect.statedAlibi}"
                    </p>
                  </div>

                  {/* Uncovered Motive */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-rose-400 uppercase font-bold mb-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>Investigative Motive</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {suspect.motive}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: Nominate / Accuse */}
              <button
                type="button"
                onClick={() => onNominateSuspect(suspect.suspectId)}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 hover:border-rose-500 text-rose-300 hover:text-white font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center space-x-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>ACCUSE AS CULPRIT</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
