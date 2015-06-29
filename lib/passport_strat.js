'use strict';

var Basic = require('passport-http').BasicStrategy;
var User = require('./models/models.js').User;
//var EventEmitter = require('events').EventEmitter;

module.exports = function(passport) {
  passport.use('basic', new Basic({}, function(email, password, done) {
    User.findOne({'basic.email': email}, function(err, user) {
      if (err) return done('database error');

      if (!user) return done('no such user');

      //var ee = new EventEmitter();
      user.checkPassword(password, finalizeAuth);// return done('wrong password');

      function finalizeAuth(err, authorized) {
        if (!authorized) return done('wrong password');

        //Authorized!
        return done(null, user);
      }
    });
  }));
};
