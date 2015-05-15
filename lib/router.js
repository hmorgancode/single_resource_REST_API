'use strict';

//A simple handler for our REST api
var express = require('express');
var router = module.exports = exports = express.Router();
var EventEmitter = require('events').EventEmitter;
router.ee = new EventEmitter();
var bodyParser = require('body-parser');
var models = require('./models/models.js');
models.ee.once('all models synced', function() {
  console.log('router is ready');
  router.ee.emit('router is ready');
});

router.use(bodyParser.json());
router.use(function(req, res, next) {
  //Currently, no other middleware.
  next();
});

//ROUTES:
router.route('/rabbits')
.get(function(req, res) {
  //Get every rabbit in the database, respond with a JSON
  models.Rabbit.findAll().then(function(rabbits) {
    res.json(rabbits);
  });
})
.post(function(req, res) {
  //Create a new rabbit
  var newRabbit = models.Rabbit.create(req.body).then(function() {
    return res.json(newRabbit._boundTo.dataValues); //Is this safe/advisable?
  });
})
.put(function(req, res) {
  //Update a rabbit with the given ID
  var updatedRabbit = req.body;
  var id = updatedRabbit.id;
  delete updatedRabbit.id;

  models.Rabbit.update(
    {name: updatedRabbit.name, weight: updatedRabbit.weight}, {where: {id: id}})
  .then(function(affected) {
    if (affected[0] === 1) { //If we successfully updated the element with that ID
      res.json({msg: 'success'});
    } else {
      res.status(400).json({msg: 'rabbit not found'});
    }
  });
})
.delete(function(req, res) {
  //models.Rabbit.findAll().then(function(rabbits) { console.log(rabbits); });
  models.Rabbit.findOne({where: {id: req.body.id}}).then(function(rabbit) {
    rabbit.destroy().then(function() {
      res.json({msg: 'success'});
    });
  }).catch(function(err) {
    console.log(err);
    res.status(500).json({msg: 'internal server error'});
  });
});

//If we did not receive a valid request:
router.all('/*', function(req, res) {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({msg: 'Could not find page.'}));
  res.end();
});
