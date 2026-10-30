import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { cancelPendingSessionTermination } from '../controllers/authController.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_noir_detective_key_2026');
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or user no longer exists.' });
    }

    // Check if session was terminated via explicit logout or tab close
    if (user.lastLogoutAt && (decoded.iat * 1000 < new Date(user.lastLogoutAt).getTime())) {
      return res.status(401).json({ message: 'Session has expired or was terminated. Please log in again.' });
    }

    // Keep session active and cancel reload termination
    cancelPendingSessionTermination(user._id);

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid token. Please log in again.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_noir_detective_key_2026');
    const user = await User.findById(decoded.id);
    if (user && (!user.lastLogoutAt || (decoded.iat * 1000 >= new Date(user.lastLogoutAt).getTime()))) {
      cancelPendingSessionTermination(user._id);
      req.user = user;
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }
  next();
};
