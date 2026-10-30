import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Terminal, 
  MessageSquare, 
  Video, 
  Image as ImageIcon, 
  Users, 
  Target, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Compass,
  AlertTriangle
} from 'lucide-react';

const GUIDE_STEPS = [
  {
    step: '01',
    title: 'Enter Any Story Premise',
    subtitle: 'Generate a unique custom investigation with Google Gemini',
    icon: Terminal,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgColor: 'bg-cyan-950/20',
    content: (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          You don't need pre-made puzzles! Simply type any crime scenario into the prompt box. For example:
        </p>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono italic">
          "A famous jazz pianist is found murdered in his dressing room during intermission at a vintage 1950s Chicago club..."
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <span className="text-cyan-400 font-bold">Tip:</span> Or click one of the 4 ready-to-play archetype cards like <strong className="text-white">Cyberpunk Lab</strong> or <strong className="text-white">Alpine Chalet</strong>.
        </div>
      </div>
    ),
  },
  {
    step: '02',
    title: 'Explore the 5 Forensic Clue Desks',
    subtitle: 'Correlate testimonies, chats, and surveillance recordings',
    icon: Compass,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-950/20',
    content: (
      <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <p>Once generated, you enter the <strong>Investigation Room</strong> with 5 interactive evidence tabs:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2">
            <span className="text-cyan-400">📁</span>
            <div>
              <strong className="text-white font-mono">1. Briefing:</strong>
              <p className="text-slate-400 text-[11px]">Victim details, exact time of death, and cause of death.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2">
            <span className="text-emerald-400">💬</span>
            <div>
              <strong className="text-white font-mono">2. WhatsApp Chats:</strong>
              <p className="text-slate-400 text-[11px]">Simulated smartphone chats with timestamps and deleted texts.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2">
            <span className="text-rose-400">📹</span>
            <div>
              <strong className="text-white font-mono">3. CCTV Surveillance:</strong>
              <p className="text-slate-400 text-[11px]">Security camera feeds with exact timecodes of who walked where.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2">
            <span className="text-indigo-400">🔍</span>
            <div>
              <strong className="text-white font-mono">4. Forensic Photos:</strong>
              <p className="text-slate-400 text-[11px]">Click-to-zoom physical evidence and lab chemical swabs.</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-2 sm:col-span-2">
            <span className="text-amber-400">👥</span>
            <div>
              <strong className="text-white font-mono">5. Suspect Lineup:</strong>
              <p className="text-slate-400 text-[11px]">Every suspect's stated alibi ("where they claim they were") and motive.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: '03',
    title: 'Spot the Fatal Contradiction',
    subtitle: 'Cross-examine timestamps to catch the liar',
    icon: AlertTriangle,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgColor: 'bg-rose-950/20',
    content: (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          The true culprit will always have a <strong>contradiction</strong> between what they claimed and what the evidence records:
        </p>
        <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/40 space-y-2 text-xs font-mono">
          <div className="flex items-center space-x-2 text-amber-300">
            <span>❌ Suspect Claims:</span>
            <span className="italic text-slate-300">"I was asleep in my room after 10:00 PM."</span>
          </div>
          <div className="flex items-center space-x-2 text-rose-400">
            <span>👁️ CCTV Evidence:</span>
            <span className="text-slate-200">Camera CAM-02 spots them sneaking down the hallway at 10:14 PM!</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <span>💬 WhatsApp Clue:</span>
            <span className="text-slate-200">A deleted message was sent from their terminal at 10:18 PM!</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          When a suspect's alibi breaks against the CCTV and WhatsApp timestamps, you have found your perpetrator!
        </p>
      </div>
    ),
  },
  {
    step: '04',
    title: 'Lodge Accusation & Climb Ranks',
    subtitle: 'Reveal the truth, hear the confession & earn detective points',
    icon: Target,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-950/20',
    content: (
      <div className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          Click the red <strong className="text-rose-400 font-mono">"ACCUSE CULPRIT"</strong> button:
        </p>
        <ul className="space-y-1.5 text-xs text-slate-300 font-mono list-disc list-inside">
          <li>Select the guilty suspect from the lineup.</li>
          <li>Write your deduction notes explaining how you caught them.</li>
          <li>Submit the charge to the court!</li>
        </ul>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-amber-400 font-bold">+100 to +150 Points per Win</span>
            <p className="text-slate-400 text-[11px]">Rank up: Rookie Sleuth ➔ Master Sleuth ➔ Chief Inspector</p>
          </div>
          <Award className="w-6 h-6 text-amber-400" />
        </div>
      </div>
    ),
  },
  {
    step: '05',
    title: 'Ask "Detective Sentinel" for Guidance',
    subtitle: 'Your resident AI assistant that helps without giving spoilers',
    icon: ShieldCheck,
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    bgColor: 'bg-indigo-950/20',
    content: (
      <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <p>
          Need help during an active case? Click the floating <strong className="text-cyan-400 font-mono">"Detective Sentinel"</strong> button at the bottom-right corner of your screen!
        </p>
        <p className="text-slate-400 text-xs">
          Sentinel can explain rules, suggest scenarios, or give subtle investigation advice. But don't try asking it to name the killer—it is hardcoded with a <strong>strict anti-spoiler shield</strong>!
        </p>
      </div>
    ),
  },
];

export const HowToPlayModal = ({ isOpen, onClose, onStartPlaying }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-900/40 border border-cyan-500/30 text-cyan-300">
                  OFFICIAL FIELD MANUAL
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-0.5">
                How to Play AI Mystery Room
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

        {/* Step Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 overflow-x-auto scrollbar-none p-2 gap-1.5">
          {GUIDE_STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${s.borderColor} ${s.bgColor} ${s.color} font-bold shadow-md`
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="text-[10px] opacity-75">#{s.step}</span>
                <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-900/60">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`text-2xl font-black font-mono ${GUIDE_STEPS[activeTab].color}`}>
              {GUIDE_STEPS[activeTab].step}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                {GUIDE_STEPS[activeTab].title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {GUIDE_STEPS[activeTab].subtitle}
              </p>
            </div>
          </div>

          <div className="pt-2">
            {GUIDE_STEPS[activeTab].content}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {activeTab > 0 && (
              <button
                onClick={() => setActiveTab(activeTab - 1)}
                className="px-3.5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs transition-colors"
              >
                Previous
              </button>
            )}
            {activeTab < GUIDE_STEPS.length - 1 && (
              <button
                onClick={() => setActiveTab(activeTab + 1)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
              >
                Next Step
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              if (onStartPlaying) onStartPlaying();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-lg shadow-cyan-950/50"
          >
            <span>Got It, Let's Investigate!</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
