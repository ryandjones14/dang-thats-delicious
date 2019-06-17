const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', {title: 'login'});
};

exports.registerForm = (req, res) => {
  res.render('register', {title: 'register'});
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'give us a name').notEmpty();
  req.checkBody('email', 'give us an actual email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'give us a password').notEmpty();
  req.checkBody('password-confirm', 'confirm yo password').notEmpty();
  req.checkBody('password-confirm', 'passwords dont match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {title: 'register', body: req.body, flashes: req.flash()});
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.account = async (req, res) => {
  res.render('account', { title: `edit ur acct` });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: updates },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );
  req.flash('success', `u just updated urself`);
  res.redirect('back');
};