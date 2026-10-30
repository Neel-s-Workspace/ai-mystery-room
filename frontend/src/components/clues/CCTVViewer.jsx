import React, { useState } from 'react';
import { Video, Camera, Clock, Eye, AlertOctagon, ShieldCheck } from 'lucide-react';

export const CCTVViewer = ({ clue }) => {
  const cameraLogs = clue?.payload?.cameraLogs || [];
  const [selectedCamIdx, setSelectedCamIdx] = useState(0);

  const activeLog = cameraLogs[selectedCamIdx] || cameraLogs[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Evidence Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Video className="w-4 h-4" />
          <span className="font-bold uppercase">{clue.title || 'Security Surveillance Terminal'}</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>REC ARCHIVE ACTIVE</span>
          </span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {cameraLogs.length} Feeds Synced
          </span>
        </div>
      </div>

      {/* Main CCTV Monitor Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Monitor Viewport (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl bg-black border-2 border-slate-700 shadow-2xl overflow-hidden aspect-video flex flex-col justify-between p-4 group">
            {/* Scanline overlay */}
            <div className="absolute inset-0 cctv-scanlines z-10 pointer-events-none opacity-80" />

            {/* Simulated Surveillance Footage Still / Background */}
            {activeLog?.imageUrl ? (
              <img
                src={activeLog.imageUrl}
                alt="CCTV Frame"
                className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                <Camera className="w-16 h-16 text-slate-800 animate-pulse" />
              </div>
            )}

            {/* Top HUD Overlay */}
            <div className="relative z-20 flex items-center justify-between text-xs font-mono text-emerald-400 bg-black/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold">{activeLog?.camId || 'CAM-01'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">{activeLog?.location || 'Main Corridor'}</span>
              </div>
              <div className="text-cyan-300 font-bold">
                {activeLog?.timestamp || '23:30:00 UTC'}
              </div>
            </div>

            {/* Bounding Box / Detection HUD Indicator */}
            <div className="relative z-20 my-auto self-center p-3 rounded-lg border-2 border-dashed border-cyan-400/60 bg-cyan-950/30 backdrop-blur-xs text-center max-w-sm">
              <div className="flex items-center justify-center space-x-1.5 text-[11px] font-mono text-cyan-300 mb-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI OBJECT & GAIT IDENTIFICATION</span>
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                {activeLog?.detectedSubject || 'Movement Detected'}
              </p>
            </div>

            {/* Bottom HUD Overlay */}
            <div className="relative z-20 text-[11px] font-mono text-slate-300 bg-black/70 px-3 py-2 rounded-lg border border-slate-700 backdrop-blur-sm">
              <span className="text-amber-400 font-semibold">ACTION LOG: </span>
              {activeLog?.actionDescription || 'Subject captured on security camera frame.'}
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-500 text-center">
            Cross-reference camera location and exact timestamps with suspect alibis to detect fraudulent claims.
          </p>
        </div>

        {/* Right Camera Log Switcher (1 Column) */}
        <div className="space-y-3">
          <span className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Security Camera Switchboard
          </span>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {cameraLogs.map((log, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCamIdx(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedCamIdx === idx
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className={`font-bold ${selectedCamIdx === idx ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {log.camId}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium truncate">
                  {log.location}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {log.actionDescription}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
