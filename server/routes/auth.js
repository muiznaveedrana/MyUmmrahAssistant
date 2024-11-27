const express = require('express');
const { db } = require('../database/setup');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/google/callback', async (req, res) => {
  const { code } = req.body;
  
  // In a real implementation, verify the Google OAuth code
  // For demo, create a mock user
  const userId = uuidv4();
  const user = {
    id: userId,
    email: 'demo@example.com',
    name: 'Demo User',
    tier: 'free',
    dailyCalls: 0
  };

  db.run(
    'INSERT OR REPLACE INTO users (id, email, name, tier, daily_calls) VALUES (?, ?, ?, ?, ?)',
    [user.id, user.email, user.name, user.tier, user.dailyCalls],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
      res.json({ user, token });
    }
  );
});

module.exports = router;