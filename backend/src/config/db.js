import dns from 'dns';
import mongoose from 'mongoose';

// Ensure reliable SRV DNS resolution on Windows for MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Graceful fallback
}

let isConnected = false;
let useMemoryStore = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_mystery_room';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    useMemoryStore = false;
    console.log(`[Database] MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    isConnected = false;
    useMemoryStore = true;
    console.warn(`[Database] MongoDB Atlas connection error: ${err.message}`);
    if (err.message.includes('whitelist') || err.message.includes('Could not connect to any servers')) {
      console.warn(`[Database Alert] MongoDB Atlas blocked the connection because your current IP is not in Atlas Network Access.`);
      console.warn(`[Database Action] In MongoDB Atlas -> Network Access -> Add IP Address -> Add '0.0.0.0/0' (Allow access from anywhere).`);
    } else if (err.message.includes('bad auth') || err.message.includes('authentication failed')) {
      console.warn(`[Database Alert] MongoDB Atlas rejected the username or password. Please verify Database Access credentials in MongoDB Atlas.`);
    }
    console.info(`[Database] Running with Persistent Local Database Storage fallback. User accounts, scores, and sessions will be fully persisted across restarts!`);
  }
};

export const isDbConnected = () => isConnected && mongoose.connection.readyState === 1;
export const isUsingMemoryStore = () => !isConnected || useMemoryStore || mongoose.connection.readyState !== 1;
