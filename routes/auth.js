const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// 1. Create a User using: POST '/api/auth/createuser'
// No login required
router.post('/createuser', [
  body('email').isEmail().withMessage('Please provide a valid email'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'This user already exists' });
    }

    user = await User.create({ email });
    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, secret);
    res.json({ success: true, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Backend error');
  }
});

// 2. Authenticate a User using: POST '/api/auth/login'
// No login required
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, secret);
    res.json({ success: true, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Backend error');
  }
});

// 3. Get logged-in User details using: POST '/api/auth/getuser'
// Login required
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Backend error');
  }
});

module.exports = router;
