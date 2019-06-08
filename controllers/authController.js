const passport = require('passport');

exports.login = passport.authenticate('local', { 
  failureRedirect: '/login',
  failureFlash: 'failed to log u in',
  successRedirect: '/',
  successFlash: 'u r logged in',
});