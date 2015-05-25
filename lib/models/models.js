'use strict';

var mongoose = require('mongoose');

exports.Rabbit = require('./rabbit.js')(mongoose);
exports.User = require('./User.js')(mongoose); //I regret this structure a bit, now
