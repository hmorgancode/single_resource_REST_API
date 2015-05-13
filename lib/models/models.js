'use strict';

var mongoose = require('mongoose');

exports.Rabbit = require('./rabbit.js')(mongoose);
