import express from 'express';
import { chatWithSentinel } from '../controllers/chatbotController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', optionalAuth, chatWithSentinel);

export default router;
