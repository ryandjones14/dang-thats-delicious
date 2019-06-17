const passport = require('passport');

exports.login = passport.authenticate('local', { 
  failureRedirect: '/login',
  failureFlash: 'failed to log u in',
  successRedirect: '/',
  successFlash: 'u r logged in',
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'you r now logged out');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
    return;
  } else {
    req.flash('error', 'u need 2 log in 1st')
    res.redirect('/login');
  }
};