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

  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null); //make this async
  };

  userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.basic.password);
  };

  userSchema.methods.generateToken = function(secret, callback) {
    eat.encode({id: this._id}, secret, callback);
  };

  return mongoose.model('User', userSchema);
};
