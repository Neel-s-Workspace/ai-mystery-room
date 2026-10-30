import React, { useState, useEffect } from 'react';
import { BriefingViewer } from './clues/BriefingViewer';
import { WhatsAppViewer } from './clues/WhatsAppViewer';
import { CCTVViewer } from './clues/CCTVViewer';
import { PhotosViewer } from './clues/PhotosViewer';
import { SuspectsViewer } from './clues/SuspectsViewer';
import { 
  FileText, 
  MessageSquare, 
  Video, 
  Image as ImageIcon, 
  Users, 
  Target, 
  Clock, 
  ShieldAlert,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const InvestigationRoom = ({ caseData, onOpenAccusation, onBackToGenerator }) => {
  const [activeTab, setActiveTab] = useState('briefing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const mysteryName = caseData?.title || caseData?.mysteryName || 'Classified Investigation';

  // Segregate clues by type
  const whatsappClue = caseData?.clues?.find((c) => c.type === 'whatsapp');
  const cctvClue = caseData?.clues?.find((c) => c.type === 'cctv');
  const photoClues = caseData?.clues?.filter((c) => c.type === 'photo') || [];

  const tabs = [
    { id: 'briefing', label: 'Briefing & Scene', icon: FileText, count: null },
    { id: 'whatsapp', label: 'WhatsApp Chats', icon: MessageSquare, count: whatsappClue?.payload?.messages?.length || 1 },
    { id: 'cctv', label: 'CCTV Feeds', icon: Video, count: cctvClue?.payload?.cameraLogs?.length || 1 },
    { id: 'photos', label: 'Evidence Photos', icon: ImageIcon, count: photoClues.length },
    { id: 'suspects', label: 'Suspect Lineup', icon: Users, count: caseData?.suspects?.length || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Intelligence Header Bar with Clear Mystery Name */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 opacity-70" />

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToGenerator}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Return to Mystery Creation"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 font-bold">
                ACTIVE MYSTERY
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-semibold">
                DIFFICULTY: {caseData?.difficulty || 'MEDIUM'}
              </span>
            </div>
            {/* Prominently displayed Mystery Name */}
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
              {mysteryName}
            </h1>
          </div>
        </div>

        {/* Action Controls & Clock */}
        <div className="flex items-center space-x-3 sm:space-x-4 self-end md:self-auto">
          {/* Investigation Timer */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>TIME: <strong className="text-white">{formatTimer(elapsedSeconds)}</strong></span>
          </div>

          {/* Red Accusation CTA Button */}
          <button
            onClick={() => onOpenAccusation()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-950/50 hover:border-glow-crimson"
          >
            <Target className="w-4 h-4" />
            <span>ACCUSE CULPRIT</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="font-semibold">{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl min-h-[500px]">
        {activeTab === 'briefing' && (
          <BriefingViewer
            crimeDetails={caseData?.crimeDetails}
            briefing={caseData?.briefing}
            title={mysteryName}
          />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppViewer
            clue={whatsappClue || { payload: { messages: [] } }}
            victimName={caseData?.crimeDetails?.victimName}
          />
        )}

        {activeTab === 'cctv' && (
          <CCTVViewer
            clue={cctvClue || { payload: { cameraLogs: [] } }}
          />
        )}

        {activeTab === 'photos' && (
          <PhotosViewer photoClues={photoClues} />
        )}

        {activeTab === 'suspects' && (
          <SuspectsViewer
            suspects={caseData?.suspects || []}
            onNominateSuspect={(id) => onOpenAccusation(id)}
          />
        )}
      </div>
    </div>
  );
};
