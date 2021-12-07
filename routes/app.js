const express = require('express');

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

const User = require('../models/User');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', { extractScripts: true });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { extractScripts: true });
});

module.exports = router
