const express = require('express');
const { db } = require('../database/setup');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/message', authMiddleware, (req, res) => {
  const { message } = req.body;
  
  db.get('SELECT tier, daily_calls FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (user.tier === 'free' && user.daily_calls >= 20) {
      return res.status(403).json({ error: 'Daily limit reached' });
    }

    const response = `AI response to: ${message}`; // Mock AI response
    const chatId = uuidv4();

    db.run(
      'INSERT INTO chat_history (id, user_id, message, response) VALUES (?, ?, ?, ?)',
      [chatId, req.userId, message, response],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.run(
          'UPDATE users SET daily_calls = daily_calls + 1 WHERE id = ?',
          [req.userId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ response });
          }
        );
      }
    );
  });
});

router.get('/history', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.userId],
    (err, history) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(history);
    }
  );
});

module.exports = router;