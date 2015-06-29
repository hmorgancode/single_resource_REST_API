'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var EventEmitter = require('events').EventEmitter;

app.use(express.static('./build'));

//(This is a bad structure that I would refactor)
var router = require('./rabbit_routes.js');
app.use('/api/', router);

//404 page (again, bad structure)
var fourohfour = express.Router();
fourohfour.all('/*', function(req, res) {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({msg: 'Could not find page.'}));
  res.end();
});
app.use('/', fourohfour);

//Prepare our emitter (to notify Mocha that we're ready to accept connections)
var serverEmitter = module.exports = exports = new EventEmitter();
var server;

process.env.APP_SECRET = process.env.APP_SECRET || 'change me, use nf & a .env';

//Connect to mongo
console.log('Connecting to mongo...');
mongoose.connect('mongodb://localhost/database');
//console.log(process.env.APP_SECRET);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Once we're connected to mongo, share the connection and start our server
db.once('open', function(callback) {
  console.log('Connected to mongo');
  server = app.listen(3000, function() {
    console.log('Server started.');
    serverEmitter.emit('started');
  });
});
