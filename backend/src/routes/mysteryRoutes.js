import express from 'express';
import {
  generateMystery,
  getMysteryById,
  accuseCulprit,
  getUserHistory,
} from '../controllers/mysteryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Enforce strict authentication on all mystery routes
router.post('/generate', requireAuth, generateMystery);
router.get('/history/my', requireAuth, getUserHistory);
router.get('/:id', requireAuth, getMysteryById);
router.post('/:id/accuse', requireAuth, accuseCulprit);

export default router;
