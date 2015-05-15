'use strict';

var express = require('express');
var app = express();
var credentials = require('../database/credentials.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://' + credentials.user + ':' +
  credentials.password + '@' + 'localhost:5432/rabbits_dev');
var EventEmitter = require('events').EventEmitter;

var router = require('./router.js');
app.use('/', router);

//Prepare our emitter (to notify Mocha that we're ready to accept connections)
var serverEmitter = module.exports = exports = new EventEmitter();

var server = app.listen(3000, function() {
  console.log('server is ready, waiting for router');
});

router.ee.once('router is ready', function() {
  console.log('Server started.');
  serverEmitter.emit('started');
});
