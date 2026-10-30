import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, FileText, CheckCircle } from 'lucide-react';

export const PhotosViewer = ({ photoClues = [] }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (photoClues.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 font-mono text-xs">
        No photographic evidence currently processed by the lab.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <ImageIcon className="w-4 h-4" />
          <span className="font-bold uppercase">Forensic Evidence Gallery ({photoClues.length} Items Tagged)</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Click any exhibit to inspect forensic details
        </span>
      </div>

      {/* Grid of Photo Clues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {photoClues.map((clue, idx) => {
          const imgUrl = clue.payload?.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80';
          const description = clue.description || clue.payload?.documentText || '';

          return (
            <div
              key={clue.clueId || idx}
              onClick={() => setSelectedPhoto({ ...clue, imgUrl, description })}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-all"
            >
              {/* Image Container */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={imgUrl}
                  alt={clue.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                {/* Top Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 border border-slate-700 text-[10px] font-mono text-cyan-400 backdrop-blur-sm">
                  EXHIBIT #{idx + 1}
                </div>

                {/* Zoom Hint */}
                <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {clue.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspection Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full bg-black relative">
              <img
                src={selectedPhoto.imgUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 space-y-3 bg-slate-950 border-t border-slate-800">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>LABORATORY FORENSIC ANALYSIS</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {selectedPhoto.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
