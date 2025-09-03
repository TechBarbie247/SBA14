const router = require('express').Router();
const passport = require('passport');
const User = require('../../models/User');
const { signToken } = require('../../utils/auth');

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ email, username, password });
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(400).json({ message: 'Registration failed', error: e.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user);
    res.json({ token, user });
  } catch (e) {
    res.status(400).json({ message: 'Login failed', error: e.message });
  }
});

// GET /api/users/auth/github
router.get('/auth/github',
  passport.authenticate('github', { session: false })
);

// GET /api/users/auth/github/callback
router.get('/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: process.env.OAUTH_FAILURE_REDIRECT }),
  (req, res) => {
    const token = require('../../utils/auth').signToken(req.user);
    // Option A: redirect to frontend with token in query (or fragment)
    const url = new URL(process.env.OAUTH_SUCCESS_REDIRECT);
    url.searchParams.set('token', token);
    return res.redirect(url.toString());

    // Option B (API only): return JSON
    // res.json({ token, user: req.user });
  }
);

module.exports = router;