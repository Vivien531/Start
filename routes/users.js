const passport = require('passport');
const express = require('express');
const bcrypt = require('bcryptjs');

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

const User = require('../models/User');

const router = express.Router();

router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login')
});

router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {
  user: req.user
}));

router.post('/register', (req, res) => {
  const {
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!email || !password || !password2) {
    errors.push({
      msg: 'Veuillez compléter tous les champs.'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Les mots de passe ne correspondent pas.'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Le mot de passe doit faire au moins 6 caractères.'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      user: req.user,
      errors,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Cet email est déjà associé à un compte.'
        });
        res.render('register', {
          user: req.user,
          errors,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Vous êtes maintenant enregistré, vous pouvez vous connecter.'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Vous êtes déconnecté.');
  req.session.destroy((err) => res.redirect('/users/login'));
});

module.exports = router;
