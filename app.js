const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
// const https = require('https');
// const http = require('http');
const path = require('path');
const ejs = require('ejs');
// const fs = require('fs');

// const options = {
//   key: fs.readFileSync('certificate/private.key'),
//   cert: fs.readFileSync('certificate/certificate.crt'),
// };

const app = express()

require('./config/passport')(passport);
const db = require('./config/keys').mongoURI;

const PORT = process.env.PORT || 80;

mongoose
  .connect(
    db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout extractScripts", true)

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, '/views')));

app.use(
  session({
    secret: 'dtdjguyfghdytduy',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/app.js'));
app.use('/users', require('./routes/users.js'));

// https.createServer(options, app).listen(443)

// http.createServer(function(req, res) {
//   console.log('req.body');
//   console.log(req.body);
//   res.redirect('https://avkservices.fr/' + req.url);
// }).listen(80);

app.listen(PORT, console.log(`Server started on port ${PORT}`));
