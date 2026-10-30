1. Project Overview & Product Vision
1.1 Executive Summary

AI Mystery Room is an interactive, AI-driven detective investigation web application. The player inputs a custom premise, scenario, or theme (e.g., "A billionaire dies at a secluded snowed-in mountain chalet" or "A cybernetic scientist disappears from a neon Tokyo lab"). Powered by Google Gemini, the backend dynamically crafts an investigation case featuring suspects, motives, alibis, a designated culprit, and simulated forensic evidence (WhatsApp/SMS chat logs, AI-generated photos/evidence images, and surveillance/CCTV camera transcripts & logs).

The player investigates clues inside a dark-themed virtual investigation room, correlates alibis with evidence, interrogates suspects, and formally accuses the culprit. The platform includes full user authentication (to track solved cases and detective rank) and an in-app AI assistant chatbot ("Detective Sentinel") to guide users on platform usage, rules, and game mechanics.

1.2 Target Audience
Mystery, puzzle, and true-crime simulation fans.
Casual gamers seeking bite-sized interactive murder-mystery experiences.
Escape room and RPG enthusiasts looking for endless replayability via generative AI.
1.3 Core Gameplay Loop
2. Technology Stack & Architecture
Tier	Technology	Purpose
Frontend	React 18+ (Vite), Tailwind CSS, Lucide Icons	Responsive detective/noir interface, evidence viewers, audio-visual feedback.
Backend	Node.js (v20+) & Express.js	REST APIs, authentication middleware, prompt orchestration, rate limiting.
Database	MongoDB & Mongoose ORM	Persistent storage for users, generated mystery cases, user game sessions, stats.
AI Engine	Google Gemini API (@google/genai SDK)	Deterministic Structured Outputs (JSON Schema) for mystery generation, clue generation, and the helper chatbot.
Image Generation	Google Imagen 3 (via Gemini API) or Gemini Multimodal Clues	Generates crime scene snapshots, evidence photos, and suspect portraits.
Auth & Security	JWT (JSON Web Tokens), bcryptjs	Secure password hashing, stateless token-based authorization.
3. System Architecture & Data Flow
4. Detailed Feature Specifications
4.1 Module 1: Authentication & User Profiles
User Registration:
Fields: username, email, password.
Passwords hashed with bcryptjs (salt rounds: 10).
Validation: Email format check, password minimum 8 characters.
User Login:
Authenticates credentials and returns a signed JWT token (expires in 7 days).
Client stores token in localStorage or HttpOnly cookie.
User Profile & Stats:
Track: totalCasesPlayed, casesSolved, winRate, detectiveRank (e.g., Rookie, Sleuth, Detective Inspector, Master Sleuth).
Case History: List of past played cases with timestamps and outcomes.
4.2 Module 2: AI Mystery Generation Engine
Input:
User scenario text input (1 to 200 words).
Difficulty selector:
Easy: 3 suspects, 3 clear corroborating clues, obvious contradiction.
Medium: 4 suspects, 5 clues, red herrings, subtle time-alibi mismatch.
Hard: 5 suspects, 7 clues, multiple alibis, layered evidence, requires deep deduction.
Backend Orchestration with Gemini:
Uses Gemini API with Structured Outputs (responseSchema) to enforce strict JSON compliance.
The model generates:
Case Title & Briefing Narrative.
Crime Details (Time of incident, location, victim profile, weapon/cause).
Suspect Profiles (Names, occupations, relations, stated alibis, hidden motives, and isCulprit: boolean).
Evidence Proofs (WhatsApp chats, CCTV transcripts/stills, photographic clues).
Truth & Culprit Confession breakdown.
Data Privacy at Query Time:
The server strips isCulprit, confession, and solutionBreakdown before sending the case payload to the frontend so users cannot inspect the solution in browser DevTools.
4.3 Module 3: Multi-Format Clue & Evidence Room

The core gameplay screen is styled like a modern forensic intelligence desk.

1. WhatsApp / SMS Clue Simulator
Realistic mobile chat UI displaying conversation threads between victim and suspects or between suspects.
Contains timestamps, message status (read receipts, deleted messages), voice note mock transcripts, and attachments.
Clues contain subtle inconsistencies (e.g., time of message vs. suspect's claimed alibi).
2. CCTV / Camera Surveillance Simulator
Video monitor / security console UI with timestamp overlays, camera location tag (e.g., CAM-02: North Wing Corridor), and noise/scanline visual filter.
Presents chronological camera log events and freeze-frame security camera snapshots with visual descriptions or AI-generated camera stills.
Shows timestamped movements exposing contradictory alibis.
3. Forensic Photo / Physical Clue Viewer
High-resolution crime scene photos, recovered items (e.g., muddy footprints, torn receipts, poisoned glass, forged documents).
Click-to-zoom modal with detailed forensic notes and timestamps.
4.4 Module 4: Accusation, Verdict & Resolution
Suspect Lineup:
Photo cards of all suspects with their alibis and stated relations.
Accusation Action:
Player selects 1 suspect as the perpetrator.
Player provides optional deduction notes ("How you figured it out").
Verdict Resolution:
Backend verifies if the suspect is indeed the true culprit.
Reveals the Resolution Screen:
Victory/Defeat Banner.
Culprit's Confession: A dramatically rendered statement by the culprit explaining how they committed the crime.
Full Timeline Breakdown: Explanation of every clue, highlighting which clues were red herrings and which proved guilt.
XP / Score: Updates user detective score.
4.5 Module 5: In-App AI Helper Chatbot ("Detective Sentinel")
Purpose:
Floating chat widget accessible on all screens.
Answers user questions about:
Website navigation & features.
How mystery rooms work and rules of deduction.
How to write good prompt scenarios for custom mysteries.
General troubleshooting (e.g., account settings, difficulty levels).
Guardrails:
Strict Anti-Spoiler Policy: The chatbot is explicitly instructed never to spoil the culprit or analyze specific active game clues to give away answers. If asked "Who is the killer?", it responds in-character: "A true detective must rely on their own wits. Check the CCTV logs and cross-examine the WhatsApp messages!"
5. Database Schema Specifications (MongoDB / Mongoose)
5.1 User Schema
typescript
interface IUser {
  _id: ObjectId;
  username: string;          // unique, trimmed, min 3 chars
  email: string;             // unique, lowercase, indexed
  passwordHash: string;      // bcrypt hashed
  stats: {
    casesPlayed: number;     // default 0
    casesSolved: number;     // default 0
    score: number;           // total detective points
    rank: string;            // 'Rookie', 'Sleuth', 'Inspector', 'Master Detective'
  };
  createdAt: Date;
  updatedAt: Date;
}
5.2 MysteryCase Schema
typescript
interface ISuspect {
  suspectId: string;         // e.g. "suspect_1"
  name: string;              // "Dr. Marcus Vance"
  role: string;              // "Head of Research"
  avatarUrl?: string;        // AI-generated face portrait
  statedAlibi: string;       // "Was in the server room from 9 PM to 10 PM"
  motive: string;            // "Victim threatened to expose his embezzlement"
  isCulprit: boolean;        // Server-side only! True culprit indicator
  confession: string;        // Server-side only! Revealed post-game
}
interface IClue {
  clueId: string;            // e.g. "clue_whatsapp_1"
  type: "whatsapp" | "cctv" | "photo" | "document";
  title: string;             // "Deleted Chat between Marcus & Victim"
  description: string;       // Contextual note
  payload: {
    // For WhatsApp:
    messages?: Array<{
      sender: string;
      text: string;
      timestamp: string;
      isDeleted?: boolean;
    }>;
    // For CCTV:
    cameraLogs?: Array<{
      camId: string;
      location: string;
      timestamp: string;
      detectedSubject: string;
      actionDescription: string;
      imageUrl?: string;
    }>;
    // For Photo/Document:
    imageUrl?: string;
    documentText?: string;
  };
  isRedHerring: boolean;     // Whether clue is intentional distraction
}
interface IMysteryCase {
  _id: ObjectId;
  createdBy: ObjectId;       // Reference to User
  promptScenario: string;    // Original scenario prompt
  difficulty: "easy" | "medium" | "hard";
  title: string;             // Case Title
  briefing: string;          // Crime briefing
  crimeDetails: {
    victimName: string;
    timeOfCrime: string;
    location: string;
    causeOfDeath: string;
  };
  suspects: ISuspect[];
  clues: IClue[];
  solutionExplanation: string; // Server-side only!
  createdAt: Date;
}
5.3 GameSession Schema
typescript
interface IGameSession {
  _id: ObjectId;
  userId: ObjectId;          // User ref
  caseId: ObjectId;          // MysteryCase ref
  status: "in_progress" | "solved" | "failed";
  accusedSuspectId?: string; // The suspect chosen by user
  playerNotes?: string;      // User's deduction notes
  scoreAwarded: number;      // Points earned
  startedAt: Date;
  completedAt?: Date;
}
6. REST API Endpoints Specification
6.1 Authentication (/api/auth)
Method	Endpoint	Access	Request Body	Response Payload
POST	/api/auth/register	Public	{ username, email, password }	{ message, token, user }
POST	/api/auth/login	Public	{ email, password }	{ message, token, user }
GET	/api/auth/me	Private	Headers: Bearer JWT	{ user: IUser }
6.2 Mystery Management (/api/mysteries)
Method	Endpoint	Access	Request Body	Response Payload
POST	/api/mysteries/generate	Private	{ scenarioPrompt, difficulty }	{ caseId, title, briefing, crimeDetails, suspects (masked), clues }
GET	/api/mysteries/:id	Private	None	Safe case details (culprit masked)
POST	/api/mysteries/:id/accuse	Private	{ suspectId, playerNotes }	{ isCorrect, culprit, confession, solutionExplanation, scoreEarned }
GET	/api/mysteries/history/my	Private	None	List of past cases played by logged-in user
6.3 Chatbot Support (/api/bot)
Method	Endpoint	Access	Request Body	Response Payload
POST	/api/bot/chat	Public	{ message, chatHistory }	{ reply: string }
7. AI System Prompts & Structured Schemas
7.1 Mystery Case Generation Prompt & Schema
Model: gemini-2.5-flash
Configuration:
temperature: 0.7
responseMimeType: "application/json"
responseSchema: (Strict JSON Schema enforcing the structure of suspects, clues, timestamps, WhatsApp logs, and CCTV logs).
System Instruction for Mystery Generation
text
You are an award-winning mystery novelist and forensic puzzle architect.
Given a user's scenario and difficulty level, construct an immersive, solvable murder mystery.
STRICT PUZZLE RULES:
1. Exactly ONE suspect must be the true culprit.
2. The culprit's guilt MUST be logically provable using the provided evidence (e.g., a timestamp mismatch in CCTV footage, a contradiction in WhatsApp messages, or physical evidence).
3. At least one other suspect must have a plausible motive or suspicious alibi that is disproved by the clues (red herring).
4. WhatsApp messages must sound natural, realistic, and contain subtle forensic clues (timestamps, suspicious tone, deleted texts).
5. CCTV logs must include specific camera IDs, locations, and exact timestamps that correlate with the timeline.
6. Return output strictly conforming to the requested JSON schema.
7.2 Support Chatbot ("Detective Sentinel") System Instruction
text
You are 'Detective Sentinel', the helpful AI concierge and resident guide for AI Mystery Room.
Your duties:
1. Explain how to play the game: Players enter a story premise, explore clues (WhatsApp chats, CCTV feeds, forensic photos), and accuse the culprit.
2. Explain how to write great mystery prompts (e.g., cyberpunk heist, Victorian manor, locked-room laboratory).
3. Answer technical and account questions (how scoring works, user ranks, how authentication protects game history).
STRICT SAFETY AND GAMEPLAY GUARDRAIL:
- NEVER reveal the culprit or solve an ongoing mystery for the player.
- If a player asks who the killer is, politely refuse and provide an encouraging detective tip instead (e.g., "A good detective always checks if the CCTV timestamps contradict the suspect's WhatsApp messages!").
- Keep your tone sharp, witty, noir-themed, yet welcoming and helpful.
8. Frontend UI / UX & Design System
8.1 Visual Aesthetic & Theme
Style: High-tech Cyber Noir / Forensic Terminal.
Palette:
Background: Deep Slate & Charcoal (#0B0F17, #111827).
Card/Panel Surface: Semi-transparent backdrop-blur slate (#1E293B with 80% opacity).
Accent / Primary: Neon Cyan (#06B6D4) for technical cues; Amber / Warning (#F59E0B) for critical clues; Crimson (#EF4444) for culprit accusations.
Typography: Clean sans-serif (Inter or Space Grotesk) paired with a monospace font (JetBrains Mono) for CCTV timestamps and terminal logs.
8.2 Screen Hierarchy
Landing & Prompt Entry Page:
Hero banner with crime-scene aesthetic.
Text area for custom story/scenario.
Difficulty selector pills (Easy, Medium, Hard).
"Generate Mystery Room" CTA button with animated loading pulse.
Investigation Dashboard (The Room):
Header: Case title, case timer, victim briefing badge, "Make Accusation" red button.
Main Area Tabs:
📁 Case Briefing: Victim details, crime scene overview, timeline tracker.
💬 WhatsApp Chats: Interactive mobile phone frame with conversation bubbles and timestamps.
📹 CCTV Feeds: Security terminal with multi-camera log viewer and footage stills.
🔍 Forensic Photos: Interactive photo gallery with zoom inspection.
👥 Suspect Dossiers: Grid of suspect cards displaying alibis and motives.
Accusation Modal:
Radio selection of suspects.
"Deduction Notes" textarea.
"Submit Formal Charge" confirmation button.
Debrief / Victory Screen:
Solved vs Unsolved status.
Full narrative debrief & culprit confession playback.
Score & rank update.
Floating Chatbot Widget:
Bottom-right corner toggle icon (🛡️ Detective Sentinel).
Quick prompt suggestions: "How does this work?", "Tips for hard mode", "Rules of evidence".
9. Non-Functional & Security Requirements
Anti-Cheat Integrity:
The culprit identifier (isCulprit), culprit's confession, and full solution string must never be sent to the client during the active investigation phase.
Verification of the accusation is performed exclusively server-side upon receiving POST /api/mysteries/:id/accuse.
Rate Limiting & Abuse Prevention:
Rate limit /api/mysteries/generate to max 5 requests per 10 minutes per user to prevent Gemini quota exhaustion.
Limit scenario prompts to 500 characters max to prevent prompt injection and token overflow.
Responsive Design:
Mobile-first adaptive layout for evidence inspection (e.g., WhatsApp view renders naturally on mobile phones; CCTV layout stacks into chronological cards).
Error Handling & Fallbacks:
If Gemini API generation fails or encounters transient network errors, provide automated exponential retry (up to 2 attempts) and fallback error alerts to the user.
10. Phased Development Roadmap for Codex
Phase 1: Foundation & Auth
├── Initialize Vite + React (Tailwind) & Node + Express backend.
├── Configure MongoDB connection via Mongoose.
└── Build User Auth (Register, Login, JWT verification middleware).
Phase 2: Gemini AI Mystery Engine
├── Setup @google/genai SDK on backend.
├── Define strict JSON Schema for mystery generation.
├── Implement POST /api/mysteries/generate with prompt sanitation and difficulty levels.
└── Secure mystery storage in MongoDB with solution masking.
Phase 3: Evidence UI & Investigation Room
├── Build Evidence Dashboard (Tabs: Briefing, WhatsApp, CCTV, Photos, Suspects).
├── Implement WhatsApp Chat UI simulator with realistic styling.
├── Implement CCTV Camera surveillance logs and mock timeline viewer.
└── Build Forensic Photo inspection modal.
Phase 4: Accusation, Scoring & Resolution
├── Build Accusation modal & POST /api/mysteries/:id/accuse endpoint.
├── Implement scoring algorithm and rank progression (Rookie -> Sleuth -> Master).
└── Design post-game Victory/Defeat screen with culprit confession and clue breakdown.
Phase 5: Support Chatbot & Polish
├── Build floating "Detective Sentinel" chatbot UI.
├── Implement POST /api/bot/chat connected to Gemini with guardrail system instructions.
└── Final end-to-end playtesting, sound effects, animations, and edge-case validation.