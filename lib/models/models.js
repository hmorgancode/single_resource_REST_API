'use strict';

var Sequelize = require('sequelize');
var credentials = require('../../database/credentials.js');
var sequelize = new Sequelize('postgres://' + credentials.user + ':' +
  credentials.password + '@' + 'localhost:5432/');
var EventEmitter = require('events').EventEmitter;

exports.ee = new EventEmitter();
exports.Rabbit = require('./rabbit.js')(sequelize);
exports.Rabbit.ee.once('synced', function() {
  console.log('all models synced, database is ready');
  exports.ee.emit('all models synced');
});
