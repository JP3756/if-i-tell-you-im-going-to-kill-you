// Posts system routes
// Ephemeral posts that auto-delete after 24 hours
// Privacy-first: minimal metadata, no tracking

import express from 'express';
import { db, cleanupExpiredPosts } from '../database.js';

const router = express.Router();

// Middleware to verify session token
function authenticateUser(req, res, next) {
  const sessionToken = req.headers['x-session-token'];

  if (!sessionToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const stmt = db.prepare('SELECT id, username FROM users WHERE session_token = ?');
  const user = stmt.get(sessionToken);

  if (!user) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  req.user = user;
  next();
}

// Create new post
// Auto-expires in 24 hours
router.post('/', authenticateUser, (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Post content required' });
    }

    // Limit post length
    const maxLength = 500;
    if (content.length > maxLength) {
      return res.status(400).json({ error: `Post must be ${maxLength} characters or less` });
    }

    const now = Date.now();
    const expiresAt = now + (24 * 60 * 60 * 1000); // 24 hours from now

    const stmt = db.prepare(`
      INSERT INTO posts (user_id, content, created_at, expires_at)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(req.user.id, content.trim(), now, expiresAt);

    res.status(201).json({
      success: true,
      post: {
        id: result.lastInsertRowid,
        content: content.trim(),
        username: req.user.username,
        createdAt: now,
        expiresAt
      }
    });

  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all active posts (non-expired)
// Returns posts from all users
router.get('/', authenticateUser, (req, res) => {
  try {
    // Clean up expired posts first
    cleanupExpiredPosts();

    const now = Date.now();
    const stmt = db.prepare(`
      SELECT 
        posts.id,
        posts.content,
        posts.created_at,
        posts.expires_at,
        users.username
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.expires_at > ?
      ORDER BY posts.created_at DESC
      LIMIT 100
    `);

    const posts = stmt.all(now);

    res.json({
      success: true,
      posts: posts.map(post => ({
        id: post.id,
        content: post.content,
        username: post.username,
        createdAt: post.created_at,
        expiresAt: post.expires_at,
        timeRemaining: post.expires_at - now
      })),
      total: posts.length
    });

  } catch (error) {
    console.error('Posts retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Delete own post
router.delete('/:postId', authenticateUser, (req, res) => {
  try {
    const { postId } = req.params;

    // Verify post belongs to user
    const checkStmt = db.prepare('SELECT user_id FROM posts WHERE id = ?');
    const post = checkStmt.get(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete post
    const deleteStmt = db.prepare('DELETE FROM posts WHERE id = ?');
    deleteStmt.run(postId);

    res.json({ success: true, message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Post deletion error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Get stats (for info display)
router.get('/stats', authenticateUser, (req, res) => {
  try {
    const now = Date.now();

    const activePostsStmt = db.prepare('SELECT COUNT(*) as count FROM posts WHERE expires_at > ?');
    const activePosts = activePostsStmt.get(now);

    const totalUsersStmt = db.prepare('SELECT COUNT(*) as count FROM users');
    const totalUsers = totalUsersStmt.get();

    res.json({
      activePosts: activePosts.count,
      totalUsers: totalUsers.count,
      expirationTime: '24 hours'
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

export default router;
