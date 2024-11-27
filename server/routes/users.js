const express = require('express');
const { db } = require('../database/setup');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

router.post('/upgrade', authMiddleware, (req, res) => {
  db.run(
    'UPDATE users SET tier = ? WHERE id = ?',
    ['premium', req.userId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Upgraded to premium successfully' });
    }
  );
});

module.exports = router;