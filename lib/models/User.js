'use strict';

var bcrypt = require('bcrypt-nodejs');
var eat = require('eat');

module.exports = function(mongoose) {
  var userSchema = mongoose.Schema({
    username: String,
    basic: {
      email: {type: String, unique: true},
      password: String
    }
  });

  userSchema.methods.generateHash = function(password, callback) {
    bcrypt.hash(password, bcrypt.genSaltSync(8), null, callback);
  };

  userSchema.methods.checkPassword = function(password, callback) {
    bcrypt.compare(password, this.basic.password, callback);
  };

  userSchema.methods.generateToken = function(secret, callback) {
    eat.encode({id: this._id}, secret, callback);
  };

  return mongoose.model('User', userSchema);
};
