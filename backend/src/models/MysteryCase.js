import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isUsingMemoryStore } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const CASES_FILE = path.join(DATA_DIR, 'cases.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const suspectSchema = new mongoose.Schema({
  suspectId: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  statedAlibi: { type: String, required: true },
  motive: { type: String, required: true },
  isCulprit: { type: Boolean, required: true, default: false },
  confession: { type: String, default: '' },
});

const clueSchema = new mongoose.Schema({
  clueId: { type: String, required: true },
  type: {
    type: String,
    enum: ['whatsapp', 'cctv', 'photo', 'document'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  payload: {
    messages: [
      {
        sender: String,
        text: String,
        timestamp: String,
        isDeleted: Boolean,
      },
    ],
    cameraLogs: [
      {
        camId: String,
        location: String,
        timestamp: String,
        detectedSubject: String,
        actionDescription: String,
        imageUrl: String,
      },
    ],
    imageUrl: String,
    documentText: String,
  },
  isRedHerring: { type: Boolean, default: false },
});

const mysteryCaseSchema = new mongoose.Schema(
  {
    createdBy: { type: String, required: true, index: true },
    promptScenario: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    title: { type: String, required: true },
    mysteryName: { type: String, required: true },
    briefing: { type: String, required: true },
    crimeDetails: {
      victimName: { type: String, required: true },
      timeOfCrime: { type: String, required: true },
      location: { type: String, required: true },
      causeOfDeath: { type: String, required: true },
    },
    suspects: [suspectSchema],
    clues: [clueSchema],
    solutionExplanation: { type: String, required: true },
  },
  { timestamps: true }
);

export const toClientSafePayload = (mysteryCaseDoc) => {
  const caseObj = mysteryCaseDoc.toObject ? mysteryCaseDoc.toObject() : { ...mysteryCaseDoc };
  
  const safeSuspects = (caseObj.suspects || []).map((s) => ({
    suspectId: s.suspectId,
    name: s.name,
    role: s.role,
    avatarUrl: s.avatarUrl,
    statedAlibi: s.statedAlibi,
    motive: s.motive,
  }));

  const safeClues = (caseObj.clues || []).map((c) => ({
    clueId: c.clueId,
    type: c.type,
    title: c.title,
    description: c.description,
    payload: c.payload,
  }));

  const finalName = caseObj.mysteryName || caseObj.title;

  return {
    _id: caseObj._id,
    title: finalName,
    mysteryName: finalName,
    promptScenario: caseObj.promptScenario,
    difficulty: caseObj.difficulty,
    briefing: caseObj.briefing,
    crimeDetails: caseObj.crimeDetails,
    suspects: safeSuspects,
    clues: safeClues,
    createdAt: caseObj.createdAt,
    createdBy: caseObj.createdBy,
  };
};

const MongooseMysteryCaseModel = mongoose.model('MysteryCase', mysteryCaseSchema);

// File helper functions for zero-loss persistent storage
const readCasesFromFile = () => {
  try {
    if (fs.existsSync(CASES_FILE)) {
      return JSON.parse(fs.readFileSync(CASES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('[MysteryCaseStore] Read error:', err.message);
  }
  return [];
};

const writeCasesToFile = (cases) => {
  try {
    fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2), 'utf-8');
  } catch (err) {
    console.error('[MysteryCaseStore] Write error:', err.message);
  }
};

export const MysteryCase = {
  async create(data) {
    if (!isUsingMemoryStore()) {
      return MongooseMysteryCaseModel.create(data);
    }
    const cases = readCasesFromFile();
    const newCase = {
      _id: 'case_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      mysteryName: data.mysteryName || data.title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    cases.push(newCase);
    writeCasesToFile(cases);
    return newCase;
  },

  async findById(id) {
    if (!isUsingMemoryStore()) {
      return MongooseMysteryCaseModel.findById(id);
    }
    const cases = readCasesFromFile();
    return cases.find((c) => c._id.toString() === id.toString()) || null;
  },

  async find(query = {}) {
    if (!isUsingMemoryStore()) {
      return MongooseMysteryCaseModel.find(query).sort({ createdAt: -1 });
    }
    let list = readCasesFromFile();
    if (query.createdBy) {
      list = list.filter((c) => c.createdBy && c.createdBy.toString() === query.createdBy.toString());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};
