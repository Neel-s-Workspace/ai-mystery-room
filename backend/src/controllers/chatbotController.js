import { askMysteryAssistant } from '../services/chatbotService.js';
import { GameSession } from '../models/GameSession.js';

export const chatWithSentinel = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required.' });
    }

    let userContext = null;
    if (req.user) {
      const u = req.user;
      let lastGame = null;
      try {
        const sessions = await GameSession.find({ userId: u._id.toString() });
        if (sessions && sessions.length > 0) {
          lastGame = sessions[sessions.length - 1];
        }
      } catch (e) {
        // Ignored
      }

      userContext = {
        username: u.username,
        lifetimeScore: u.stats?.lifetimeScore ?? u.stats?.score ?? 0,
        highestSessionScore: u.stats?.highestSessionScore ?? 0,
        currentSessionScore: u.currentSession?.pointsEarned ?? 0,
        currentSessionNumber: u.currentSession?.sessionNumber ?? 1,
        casesPlayed: u.stats?.casesPlayed ?? 0,
        casesSolved: u.stats?.casesSolved ?? 0,
        rank: u.stats?.rank || 'Rookie Detective',
        lastGame: lastGame ? {
          title: lastGame.mysteryName || lastGame.caseTitle || 'Recent Mystery',
          scoreAwarded: lastGame.scoreAwarded ?? 0,
          status: lastGame.status,
        } : null,
      };
    }

    const reply = await askMysteryAssistant(message.trim(), chatHistory, userContext);

    return res.json({ reply });
  } catch (err) {
    console.error('[ChatbotController] Error:', err);
    return res.status(500).json({
      reply: 'Mystery Assistant is momentarily offline. Please check your evidence board or try again shortly.',
    });
  }
};
