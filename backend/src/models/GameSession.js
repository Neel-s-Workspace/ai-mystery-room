import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isUsingMemoryStore } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const gameSessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    caseId: { type: String, required: true, index: true },
    caseTitle: { type: String, default: 'Classified Investigation' },
    mysteryName: { type: String, default: 'Classified Investigation' },
    status: {
      type: String,
      enum: ['in_progress', 'solved', 'failed'],
      default: 'in_progress',
    },
    accusedSuspectId: { type: String, default: null },
    accusedSuspectName: { type: String, default: null },
    isCorrect: { type: Boolean, default: false },
    playerNotes: { type: String, default: '' },
    scoreAwarded: { type: Number, default: 0 },
    hasDeducted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const MongooseGameSessionModel = mongoose.model('GameSession', gameSessionSchema);

const readSessionsFromFile = () => {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('[GameSessionStore] Read error:', err.message);
  }
  return [];
};

const writeSessionsToFile = (sessions) => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.error('[GameSessionStore] Write error:', err.message);
  }
};

export const GameSession = {
  async create(data) {
    if (!isUsingMemoryStore()) {
      return MongooseGameSessionModel.create(data);
    }
    const sessions = readSessionsFromFile();
    const session = {
      _id: 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      caseTitle: data.mysteryName || data.caseTitle,
      mysteryName: data.mysteryName || data.caseTitle,
      hasDeducted: data.hasDeducted || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sessions.push(session);
    writeSessionsToFile(sessions);
    return session;
  },

  async findOne(query) {
    if (!isUsingMemoryStore()) {
      return MongooseGameSessionModel.findOne(query);
    }
    const sessions = readSessionsFromFile();
    return (
      sessions.find((s) => {
        if (query.userId && s.userId?.toString() !== query.userId.toString()) return false;
        if (query.caseId && s.caseId?.toString() !== query.caseId.toString()) return false;
        if (query._id && s._id?.toString() !== query._id.toString()) return false;
        return true;
      }) || null
    );
  },

  async find(query = {}) {
    if (!isUsingMemoryStore()) {
      return MongooseGameSessionModel.find(query).sort({ createdAt: -1 });
    }
    let list = readSessionsFromFile();
    if (query.userId) {
      list = list.filter((s) => s.userId && s.userId.toString() === query.userId.toString());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findByIdAndUpdate(id, update, options = {}) {
    if (!isUsingMemoryStore()) {
      return MongooseGameSessionModel.findByIdAndUpdate(id, update, options);
    }
    const sessions = readSessionsFromFile();
    const idx = sessions.findIndex((s) => s._id.toString() === id.toString());
    if (idx === -1) return null;
    Object.assign(sessions[idx], update, { updatedAt: new Date() });
    writeSessionsToFile(sessions);
    return sessions[idx];
  },
};
