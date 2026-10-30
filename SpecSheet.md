# Specification Document (Spec Sheet)
## Project: AI Mystery Room (Spec-Driven Development — Single Source of Truth)

---

## 1. Project Overview & Product Vision

### 1.1 Executive Summary
**AI Mystery Room** is an interactive, AI-driven detective investigation web application. The player inputs a custom premise, scenario, or theme (e.g., *"A billionaire dies at a secluded snowed-in mountain chalet"* or *"A cybernetic scientist disappears from a neon Tokyo lab"*). Powered by **Google Gemini**, the backend dynamically crafts an investigation case featuring suspects, motives, alibis, a designated culprit, and simulated forensic evidence (WhatsApp/SMS chat logs, AI-generated photos/evidence images, and surveillance/CCTV camera transcripts & logs). 

The player investigates clues inside a dark-themed virtual investigation room, correlates alibis with evidence, interrogates suspects, and formally accuses the culprit. The platform includes full user authentication (to track solved cases and detective rank) and an in-app AI assistant chatbot (**"Detective Sentinel"**) to guide users on platform usage, rules, and game mechanics.

### 1.2 Target Audience
- Mystery, puzzle, and true-crime simulation fans.
- Casual gamers seeking bite-sized interactive murder-mystery experiences.
- Escape room and RPG enthusiasts looking for endless replayability via generative AI.

---

## 2. Technology Stack & Architecture

| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18+ (Vite), Tailwind CSS, Lucide Icons | Responsive detective/noir interface, evidence viewers, audio-visual feedback. |
| **Backend** | Node.js (v20+) & Express.js | REST APIs, authentication middleware, prompt orchestration, rate limiting. |
| **Database** | MongoDB & Mongoose ORM (with in-memory fallback) | Persistent storage for users, generated mystery cases, user game sessions, stats. |
| **AI Engine** | Google Gemini API (`@google/genai` SDK) | Deterministic Structured Outputs (JSON Schema) for mystery generation, clue generation, and the helper chatbot. |
| **Auth & Security** | JWT (JSON Web Tokens), bcryptjs | Secure password hashing, stateless token-based authorization. |

---

## 3. Data Models & Database Schemas

### 3.1 `User`
- `_id`, `username`, `email`, `password` (hashed with bcrypt).
- `stats`: `casesPlayed`, `casesSolved`, `score`, `rank` (Rookie Detective -> Junior Investigator -> Senior Detective -> Master Sleuth -> Chief Inspector).

### 3.2 `MysteryCase`
- `createdBy`: User ID or 'guest'.
- `promptScenario`: Original user scenario.
- `difficulty`: `'easy' | 'medium' | 'hard'`.
- `title`, `briefing`, `crimeDetails` (victimName, timeOfCrime, location, causeOfDeath).
- `suspects`: Array of `{ suspectId, name, role, avatarUrl, statedAlibi, motive, isCulprit, confession }`.
- `clues`: Array of WhatsApp logs, CCTV surveillance feeds, photo exhibits.
- `solutionExplanation`: Full deduction chain.

### 3.3 `GameSession`
- `userId`, `caseId`, `status` ('in_progress' | 'solved' | 'failed'), `accusedSuspectId`, `accusedSuspectName`, `isCorrect`, `playerNotes`, `scoreAwarded`, `completedAt`.

---

## 4. Anti-Cheat Integrity
1. **Server-Side Masking**: During active gameplay, `isCulprit`, `confession`, and `solutionExplanation` are strictly stripped by `toClientSafePayload()` before transmitting to the client.
2. **Server-Side Verification**: Culprit accuracy is evaluated solely upon `POST /api/mysteries/:id/accuse`.
3. **Chatbot Guardrail**: "Detective Sentinel" has system prompt guardrails preventing it from spoiling the active case solution or answering "Who is the killer?".
