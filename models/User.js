const mongoose = require('mongoose');
const Schema = mongoose.schema;
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('password-local-mongoose');

cosnt userSchema = new Schema ({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'invalid email address'],
    required: 'Please supply an email',

  },
  name: {
    type: String,
    required: 'please supply an email',
    trim: true,
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler); 

module.exports = mongoose.model('User', userSchema);