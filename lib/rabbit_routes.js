'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var models = require('./models/models.js');
var passport = require('passport');
var eatAuth = require('./eat_auth.js')(process.env.APP_SECRET);

//A simple handler for our REST api
var router = module.exports = exports = express.Router();

//Auth middleware first:
router.use(passport.initialize());
require('./passport_strat')(passport);

router.use(bodyParser.json());

//Auth routes:
require('./auth_routes.js')(router, passport);

//ROUTES:
router.get('/rabbits', function(req, res) {
  //Get every rabbit in the database, respond with a JSON
  models.Rabbit.find(function(err, rabbits) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }
    res.json(rabbits);
  });
});

router.post('/rabbits', function(req, res) {
  //Create a new rabbit
  var newRabbit = new models.Rabbit(req.body);
  newRabbit.save(function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }
    res.json(data);
  });
});

router.put('/rabbits', function(req, res) {
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
});

router.delete('/rabbits/:id', function(req, res) {
  models.Rabbit.remove({_id: req.params.id}, function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'internal server error'});
    }
    return res.json({msg: 'success', data: data});
  });
});
