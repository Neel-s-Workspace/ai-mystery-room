import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Flame, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  MessageSquare, 
  Video, 
  Users, 
  Target,
  FileSignature
} from 'lucide-react';

const PRESET_SCENARIOS = [
  {
    name: 'Neon Requiem: Quantum Lab Heist',
    label: 'Cyberpunk Lab Heist',
    prompt: 'A brilliant quantum cryptographer is found poisoned inside an impenetrable 88th-floor neon laboratory. A flash drive with quantum keys is missing, and the biometric door records show only three colleagues entered.',
    difficulty: 'medium',
  },
  {
    name: 'Blood on the Powder: Alpine Chalet',
    label: 'Isolated Alpine Chalet',
    prompt: 'During a blizzard in Aspen, an aviation tycoon is found dead beside his hearth by blunt force trauma. The only three guests in the locked lodge claim they never left their rooms.',
    difficulty: 'easy',
  },
  {
    name: 'Shadows at Blackwood Manor',
    label: 'Museum Antiquities Poisoning',
    prompt: 'An eccentric antiquities collector collapses during a private evening toast in his manor conservatory. Rare wolfsbane poison is detected on his crystal glass, but his decanter is untouched.',
    difficulty: 'medium',
  },
  {
    name: 'Abyssal Silence: Submarine Sabotage',
    label: 'Deep-Sea Submarine Sabotage',
    prompt: 'At 4,000 meters depth in the Mariana Trench, the chief oceanographer is locked inside the airlock chamber as emergency sirens sound. Someone manipulated the manual ballast valves.',
    difficulty: 'hard',
  },
];

const LOADING_STEPS = [
  'Initializing Gemini 3.5 Neural Forensic Core...',
  'Constructing suspects, deceptive motives, and hidden alibis...',
  'Synthesizing encrypted WhatsApp chat logs & deleted messages...',
  'Correlating CCTV surveillance timecodes & camera angles...',
  'Rendering physical crime scene evidence & forensic swabs...',
  'Establishing logical deduction pathways and culprit confession...',
];

export const CaseGenerator = ({ onGenerate, loading, onOpenHowToPlay }) => {
  const [mysteryName, setMysteryName] = useState('');
  const [scenarioPrompt, setScenarioPrompt] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scenarioPrompt.trim() || loading) return;
    onGenerate(mysteryName.trim(), scenarioPrompt.trim(), difficulty);
  };

  const handleApplyPreset = (preset) => {
    setMysteryName(preset.name);
    setScenarioPrompt(preset.prompt);
    setDifficulty(preset.difficulty);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 animate-in fade-in duration-300 space-y-10">
      {/* Hero Badge */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Generative AI Detective Engine (Google Gemini)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Enter Your Scenario. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
            Unravel The Mystery.
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Type any custom crime scenario or murder mystery premise. The AI will weave a web of suspects, 
          WhatsApp chat records, CCTV surveillance logs, and photographic evidence. Inspect the clues, uncover 
          the contradictions, and identify the true culprit.
        </p>

        {/* Quick Guide Trigger Pill */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono transition-all hover:scale-105 shadow-md shadow-cyan-950/30"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>First time playing? Click here to see How to Play</span>
          </button>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mystery Name Field (Prominently Visible) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                <FileSignature className="w-4 h-4 text-cyan-400" />
                <span>Mystery Case Name (Optional — Auto-generated if blank)</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {mysteryName.length}/100 chars
              </span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={mysteryName}
              onChange={(e) => setMysteryName(e.target.value)}
              placeholder="e.g. The Midnight Express Poisoning (or leave empty for AI title)"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-sans"
            />
          </div>

          {/* Scenario Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Crime Premise / Story Scenario</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {scenarioPrompt.length}/600 chars
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={600}
              required
              value={scenarioPrompt}
              onChange={(e) => setScenarioPrompt(e.target.value)}
              placeholder="e.g. A world-renowned jazz saxophonist is discovered murdered backstage during intermission at a vintage 1950s Chicago club. Only the manager, the trumpet soloist, and his ex-wife were seen near the dressing room..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm sm:text-base resize-none font-sans"
            />
          </div>

          {/* Quick Preset Scenario Chips */}
          <div>
            <span className="text-xs font-mono text-slate-400 mb-2 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Or Choose a Classified Case Archetype:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {PRESET_SCENARIOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 text-xs transition-all flex items-center justify-between group"
                >
                  <span className="text-slate-300 group-hover:text-cyan-300 font-medium">
                    {preset.label}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 group-hover:border-cyan-500/30">
                    {preset.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-3">
              Forensic Complexity / Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'easy', label: 'EASY', desc: '3 Suspects • Direct contradiction', icon: Compass },
                { id: 'medium', label: 'MEDIUM', desc: '4 Suspects • Red herrings & CCTV checks', icon: ShieldAlert },
                { id: 'hard', label: 'HARD', desc: '5 Suspects • Complex timelines & alibis', icon: Flame },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDifficulty(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    difficulty === item.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 font-bold font-mono text-xs">
                    <item.icon className={`w-3.5 h-3.5 ${difficulty === item.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug hidden sm:block">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || !scenarioPrompt.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-300 text-black font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all shadow-xl shadow-cyan-950/50 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span>Synthesizing Mystery Dossier...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Generate Mystery Room</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>
        </form>

        {/* Loading Progress State Display */}
        {loading && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center space-x-3 animate-pulse">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
            <div className="text-xs font-mono text-cyan-300">
              <p className="font-semibold">{LOADING_STEPS[loadingStepIdx]}</p>
              <p className="text-[10px] text-slate-500">Cross-referencing timeline nodes with Google Gemini API</p>
            </div>
          </div>
        )}
      </div>

      {/* Visual In-Real-View Field Guide Section */}
      <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase font-bold">
            <BookOpen className="w-4 h-4" />
            <span>How This Mystery Room Works In Real View</span>
          </div>
          <button
            type="button"
            onClick={onOpenHowToPlay}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
          >
            Open Interactive Manual ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-bold">
              <span>1. Prompt Input</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enter any story and custom mystery name. Gemini constructs a custom case with suspects and clues.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-bold">
              <span>2. WhatsApp & CCTV</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Inspect timestamped messages, deleted texts, and camera feeds to check suspect locations.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-rose-400 font-mono font-bold">
              <span>3. Find the Lie</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The real culprit's stated alibi will directly contradict the CCTV timecode or chat record.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-mono font-bold">
              <span>4. Accuse & Rank Up</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Charge the suspect, hear their confession, and gain points to reach Chief Inspector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
