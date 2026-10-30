import { MysteryCase, toClientSafePayload } from '../models/MysteryCase.js';
import { GameSession } from '../models/GameSession.js';
import { User, computeRank } from '../models/User.js';
import { generateMysteryFromAI } from '../services/geminiService.js';

export const generateMystery = async (req, res) => {
  try {
    const { mysteryName, scenarioPrompt, difficulty = 'medium' } = req.body;

    if (!scenarioPrompt || scenarioPrompt.trim().length === 0) {
      return res.status(400).json({ message: 'A scenario or story prompt is required to generate the mystery room.' });
    }

    if (scenarioPrompt.length > 600) {
      return res.status(400).json({ message: 'Scenario prompt must be 600 characters or fewer.' });
    }

    // Enforce authenticated user ID
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required to create a mystery.' });
    }
    const userId = req.user._id.toString();

    // Call Gemini / Procedural Engine
    const aiGeneratedMystery = await generateMysteryFromAI(scenarioPrompt.trim(), difficulty);

    // If custom mystery name is provided by user, use it; otherwise use AI-generated title
    const customName = (mysteryName || '').trim();
    const finalTitle = customName.length > 0 ? customName : aiGeneratedMystery.title;

    // Save in Database with strict user ownership
    const savedCase = await MysteryCase.create({
      createdBy: userId,
      promptScenario: scenarioPrompt.trim(),
      difficulty,
      title: finalTitle,
      mysteryName: finalTitle,
      briefing: aiGeneratedMystery.briefing,
      crimeDetails: aiGeneratedMystery.crimeDetails,
      suspects: aiGeneratedMystery.suspects,
      clues: aiGeneratedMystery.clues,
      solutionExplanation: aiGeneratedMystery.solutionExplanation,
    });

    // Create a game session strictly tied to this user
    await GameSession.create({
      userId,
      caseId: savedCase._id.toString(),
      caseTitle: finalTitle,
      mysteryName: finalTitle,
      status: 'in_progress',
      hasDeducted: false,
    });

    // Return sanitized case without culprit spoilers
    const safePayload = toClientSafePayload(savedCase);
    return res.status(201).json({
      message: 'Investigation initiated. All forensic evidence is loaded.',
      caseData: safePayload,
    });
  } catch (err) {
    console.error('[MysteryController] Generate mystery error:', err);
    return res.status(500).json({ message: 'Failed to generate mystery case. Please try again.' });
  }
};

export const getMysteryById = async (req, res) => {
  try {
    const { id } = req.params;
    const mystery = await MysteryCase.findById(id);
    if (!mystery) {
      return res.status(404).json({ message: 'Mystery case dossier not found.' });
    }

    // STRICT OWNERSHIP CHECK: Deny access if case belongs to another user
    const requesterId = req.user._id.toString();
    const caseOwnerId = (mystery.createdBy || '').toString();

    if (caseOwnerId && caseOwnerId !== requesterId) {
      return res.status(403).json({ 
        message: 'Access denied: This classified case file belongs to another investigator.' 
      });
    }

    return res.json({
      caseData: toClientSafePayload(mystery),
    });
  } catch (err) {
    console.error('[MysteryController] Get mystery error:', err);
    return res.status(500).json({ message: 'Failed to retrieve investigation data.' });
  }
};

export const accuseCulprit = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspectId, playerNotes = '' } = req.body;

    if (!suspectId) {
      return res.status(400).json({ message: 'You must select a suspect to lodge an accusation.' });
    }

    const mystery = await MysteryCase.findById(id);
    if (!mystery) {
      return res.status(404).json({ message: 'Investigation record not found.' });
    }

    const userId = req.user._id.toString();
    const caseOwnerId = (mystery.createdBy || '').toString();

    // STRICT OWNERSHIP CHECK
    if (caseOwnerId && caseOwnerId !== userId) {
      return res.status(403).json({ 
        message: 'Access denied: You cannot accuse suspects in another investigator’s case.' 
      });
    }

    // Prevent repeated deductions or repeated accusations on the same case
    let session = await GameSession.findOne({ caseId: mystery._id.toString(), userId });
    if (session && session.status !== 'in_progress') {
      return res.status(400).json({ 
        message: 'This case has already been resolved. Repeated accusations are not permitted.' 
      });
    }

    const trueCulprit = mystery.suspects.find((s) => s.isCulprit === true) || mystery.suspects[0];
    const accusedSuspect = mystery.suspects.find((s) => s.suspectId === suspectId);

    if (!accusedSuspect) {
      return res.status(400).json({ message: 'Selected suspect is not listed in this case dossier.' });
    }

    const isCorrect = suspectId === trueCulprit.suspectId;

    // Scoring logic according to difficulty:
    // Easy: +10 points
    // Medium: +20 points
    // Hard: +30 points
    // Wrong answer: -10 points (deducted once)
    const diff = (mystery.difficulty || 'medium').toLowerCase();
    let points = 0;
    if (isCorrect) {
      if (diff === 'hard') points = 30;
      else if (diff === 'medium') points = 20;
      else points = 10;
    } else {
      points = -10; // Exact 10 points deduction for wrong accusation
    }

    // Update user stats & session points
    const user = req.user;
    user.stats = user.stats || {};
    user.currentSession = user.currentSession || { sessionNumber: 1, pointsEarned: 0, loginAt: new Date() };

    user.stats.casesPlayed = (user.stats.casesPlayed || 0) + 1;
    if (isCorrect) {
      user.stats.casesSolved = (user.stats.casesSolved || 0) + 1;
    }

    // Update Lifetime Score (minimum 0)
    const prevLifetime = user.stats.lifetimeScore ?? user.stats.score ?? 0;
    user.stats.lifetimeScore = Math.max(0, prevLifetime + points);
    user.stats.score = user.stats.lifetimeScore;

    // Update Current Session Points
    user.currentSession.pointsEarned = (user.currentSession.pointsEarned || 0) + points;

    // Update Highest Session Score if a new personal best is reached
    if (user.currentSession.pointsEarned > (user.stats.highestSessionScore || 0)) {
      user.stats.highestSessionScore = user.currentSession.pointsEarned;
    }

    // Compute rank
    user.stats.rank = typeof user.calculateRank === 'function' ? user.calculateRank() : computeRank(user.stats.lifetimeScore);

    if (typeof user.save === 'function') {
      await user.save();
    }

    // Update Game Session
    if (session) {
      await GameSession.findByIdAndUpdate(session._id, {
        status: isCorrect ? 'solved' : 'failed',
        accusedSuspectId: suspectId,
        accusedSuspectName: accusedSuspect.name,
        isCorrect,
        playerNotes,
        scoreAwarded: points,
        hasDeducted: true,
        completedAt: new Date(),
      });
    } else {
      await GameSession.create({
        userId,
        caseId: mystery._id.toString(),
        caseTitle: mystery.title,
        mysteryName: mystery.title,
        status: isCorrect ? 'solved' : 'failed',
        accusedSuspectId: suspectId,
        accusedSuspectName: accusedSuspect.name,
        isCorrect,
        playerNotes,
        scoreAwarded: points,
        hasDeducted: true,
        completedAt: new Date(),
      });
    }

    return res.json({
      verdict: isCorrect ? 'SOLVED' : 'FAILED',
      verdictTitle: isCorrect ? 'CASE SOLVED • VERDICT UPHELD' : 'Wrong answer',
      isCorrect,
      accusedSuspect: {
        suspectId: accusedSuspect.suspectId,
        name: accusedSuspect.name,
        role: accusedSuspect.role,
      },
      trueCulprit: {
        suspectId: trueCulprit.suspectId,
        name: trueCulprit.name,
        role: trueCulprit.role,
        confession: trueCulprit.confession || 'I never thought you would connect the clues...',
      },
      solutionExplanation: mystery.solutionExplanation,
      difficulty: mystery.difficulty || 'medium',
      pointsAwarded: points,
      userStats: user.stats,
      currentSession: user.currentSession,
    });
  } catch (err) {
    console.error('[MysteryController] Accuse culprit error:', err);
    return res.status(500).json({ message: 'Error processing formal accusation.' });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const sessions = await GameSession.find({ userId });
    return res.json({ history: sessions });
  } catch (err) {
    console.error('[MysteryController] Get user history error:', err);
    return res.status(500).json({ message: 'Failed to retrieve case history.' });
  }
};
