// Clandestine Backend Server
// Privacy-first, invitation-only social app for Don Bosco Technical College
// NO tracking, NO analytics, NO third-party scripts

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { db, cleanupExpiredPosts } from './database.js';
import inviteRoutes from './routes/invite.js';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Security headers - no tracking, no external scripts
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  // Strict CSP - no external resources allowed
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  next();
});

// Minimal request logging (no IP storage, no analytics)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/invite', inviteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'operational',
    message: 'Clandestine backend running',
    privacy: 'No tracking. No logging. No footprints.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Cleanup expired posts on startup
cleanupExpiredPosts();

// Start server
app.listen(PORT, () => {
  console.log(`\n🔒 Clandestine Backend Server`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔐 Privacy Mode: Active - No tracking, no analytics\n`);
});

export default app;
