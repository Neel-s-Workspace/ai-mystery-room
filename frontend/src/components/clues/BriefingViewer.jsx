import React from 'react';
import { User, Clock, MapPin, Skull, FileText, AlertTriangle } from 'lucide-react';

export const BriefingViewer = ({ crimeDetails, briefing, title }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Skull className="w-48 h-48 text-cyan-500" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>CLASSIFIED INCIDENT DOSSIER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            {title}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl whitespace-pre-line font-sans">
            {briefing}
          </p>
        </div>
      </div>

      {/* Forensic Fact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Victim */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <User className="w-4 h-4" />
            <span>Victim Identity</span>
          </div>
          <p className="text-base font-bold text-white">
            {crimeDetails?.victimName || 'Unknown Individual'}
          </p>
          <span className="text-xs text-slate-400 font-mono">Deceased at Scene</span>
        </div>

        {/* Time */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" />
            <span>Estimated Time of Crime</span>
          </div>
          <p className="text-base font-bold text-white">
            {crimeDetails?.timeOfCrime || 'Undetermined'}
          </p>
          <span className="text-xs text-slate-400 font-mono">Coroner Assessment</span>
        </div>

        {/* Location */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4" />
            <span>Crime Scene Location</span>
          </div>
          <p className="text-base font-bold text-white">
            {crimeDetails?.location || 'Secured Perimeter'}
          </p>
          <span className="text-xs text-slate-400 font-mono">Forensically Sealed</span>
        </div>

        {/* Cause */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Cause of Death</span>
          </div>
          <p className="text-base font-bold text-white">
            {crimeDetails?.causeOfDeath || 'Under Examination'}
          </p>
          <span className="text-xs text-slate-400 font-mono">Toxicology & Trauma</span>
        </div>
      </div>

      {/* Investigation Tips Callout */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs font-mono text-slate-400">
        <span className="text-cyan-400 text-lg">💡</span>
        <div>
          <strong className="text-slate-200">Investigator Protocol:</strong> Compare each suspect's stated alibi against the time recorded on CCTV surveillance camera logs and the recovered WhatsApp message timestamps. One suspect will have a fatal contradiction in their timeline.
        </div>
      </div>
    </div>
  );
};
