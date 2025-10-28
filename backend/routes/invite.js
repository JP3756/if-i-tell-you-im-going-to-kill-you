// Invitation system routes
// QR-based invitation flow - the only way to access Clandestine

import express from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database.js';

const router = express.Router();

// Generate QR code for invitation (Admin Only)
// Only you (the admin) can create invitations
// Each QR code is single-use and can be shared with one person
router.post('/generate', (req, res) => {
  try {
    const { masterToken } = req.body;

    // Verify master token - ONLY the admin has this token
    if (masterToken !== process.env.MASTER_INVITE_TOKEN) {
      return res.status(403).json({ 
        error: 'Invalid admin token. Only the app creator can generate invitations.' 
      });
    }

    // Generate unique invite token (single-use)
    const inviteToken = uuidv4();
    const now = Date.now();

    // Store invite token in database
    const stmt = db.prepare('INSERT INTO invite_tokens (token, created_at, used) VALUES (?, ?, 0)');
    stmt.run(inviteToken, now);

    // Create invitation URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteUrl = `${frontendUrl}/invite/${inviteToken}`;

    // Generate QR code
    QRCode.toDataURL(inviteUrl, { width: 400, margin: 2 }, (err, qrDataUrl) => {
      if (err) {
        console.error('QR generation error:', err);
        return res.status(500).json({ error: 'Failed to generate QR code' });
      }

      res.json({
        success: true,
        inviteToken,
        inviteUrl,
        qrCode: qrDataUrl,
        message: 'Reusable QR invitation created. Share this with multiple people.',
        expiresAfterUse: false
      });
    });

  } catch (error) {
    console.error('Invite generation error:', error);
    res.status(500).json({ error: 'Failed to generate invitation' });
  }
});

// Validate invitation token
// Called when user scans QR and lands on invite page
router.post('/validate', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Invitation token required' });
    }

    // Check if token exists (REUSABLE - no longer checking if used)
    const stmt = db.prepare('SELECT * FROM invite_tokens WHERE token = ?');
    const invite = stmt.get(token);

    if (!invite) {
      return res.status(403).json({ 
        error: 'Invalid invitation token',
        valid: false 
      });
    }

    res.json({
      valid: true,
      message: 'Invitation is valid',
      token
    });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

// Get QR code image for existing token
// Useful for regenerating QR without creating new token
router.get('/qr/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token exists
    const stmt = db.prepare('SELECT * FROM invite_tokens WHERE token = ?');
    const invite = stmt.get(token);

    if (!invite) {
      return res.status(404).json({ error: 'Token not found' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteUrl = `${frontendUrl}/invite/${token}`;

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(inviteUrl, { width: 400, margin: 2 });

    res.json({
      success: true,
      qrCode: qrDataUrl,
      inviteUrl,
      used: invite.used === 1
    });

  } catch (error) {
    console.error('QR retrieval error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default router;
