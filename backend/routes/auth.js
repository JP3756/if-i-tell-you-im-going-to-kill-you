// Authentication routes
// Username-only system - NO email, NO phone, NO verification
// The invitation IS the verification

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database.js';

const router = express.Router();

// Create account with username only
// Called after user validates their invitation token
router.post('/signup', (req, res) => {
  try {
    const { username, inviteToken } = req.body;

    // Validate input
    if (!username || !inviteToken) {
      return res.status(400).json({ error: 'Username and invitation token required' });
    }

    // Username validation: 3-20 characters, alphanumeric + underscore
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Username must be 3-20 characters (letters, numbers, underscore only)' 
      });
    }

    // Check if invite token is valid and unused
    const inviteStmt = db.prepare('SELECT * FROM invite_tokens WHERE token = ? AND used = 0');
    const invite = inviteStmt.get(inviteToken);

    if (!invite) {
      return res.status(403).json({ error: 'Invalid or already used invitation' });
    }

    // Check if username is already taken
    const userCheckStmt = db.prepare('SELECT id FROM users WHERE username = ?');
    const existingUser = userCheckStmt.get(username);

    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Create user account
    const now = Date.now();
    const sessionToken = uuidv4();

    const insertUserStmt = db.prepare(`
      INSERT INTO users (username, invite_token, created_at, session_token)
      VALUES (?, ?, ?, ?)
    `);
    const result = insertUserStmt.run(username, inviteToken, now, sessionToken);

    // Mark invitation as used
    const markUsedStmt = db.prepare('UPDATE invite_tokens SET used = 1, used_at = ? WHERE token = ?');
    markUsedStmt.run(now, inviteToken);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.lastInsertRowid,
        username
      },
      sessionToken,
      manifesto: 'No names. No tracking. No footprints.'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Account creation failed' });
  }
});

// Verify session token and return user info
// Used to maintain logged-in state
router.post('/verify', (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token required' });
    }

    const stmt = db.prepare('SELECT id, username, created_at FROM users WHERE session_token = ?');
    const user = stmt.get(sessionToken);

    if (!user) {
      return res.status(401).json({ error: 'Invalid session', authenticated: false });
    }

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        memberSince: user.created_at
      }
    });

  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Logout (optional - clears session token)
router.post('/logout', (req, res) => {
  try {
    const { sessionToken } = req.body;

    if (sessionToken) {
      const stmt = db.prepare('UPDATE users SET session_token = NULL WHERE session_token = ?');
      stmt.run(sessionToken);
    }

    res.json({ success: true, message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
