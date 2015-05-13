'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var models = require('./models/models.js');

//A simple handler for our REST api
var router = module.exports = exports = express.Router();

router.use(bodyParser.json());
router.use(function(req, res, next) {
  //Currently, no other middleware.
  next();
});

//ROUTES:
router.route('/rabbits')
.get(function(req, res) {
  //Get every rabbit in the database, respond with a JSON
  models.Rabbit.find(function(err, rabbits) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }
    res.json(rabbits);
  });
})
.post(function(req, res) {
  //Create a new rabbit
  var newRabbit = new models.Rabbit(req.body);
  newRabbit.save(function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }
    res.json(data);
  });
})
.put(function(req, res) {
  //Update a rabbit with the given ID
  var updatedRabbit = req.body;
  var id = updatedRabbit._id;
  delete updatedRabbit._id;

  models.Rabbit.update({_id: id}, updatedRabbit,
    function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: 'success'});
    });
})
.delete(function(req, res) {
  models.Rabbit.remove({_id: req.params.id}, function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }
    res.json({msg: 'success'});
  });
});

//If we did not receive a valid request:
router.all('/*', function(req, res) {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.write(JSON.stringify({msg: 'Could not find page.'}));
  res.end();
});
