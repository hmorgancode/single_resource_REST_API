'use strict';

//webpack's entry point

//This avoids a jshint error where angular is undefined, but keeping the old notes around for now:
var angular = require('angular');

var greet = require('./greet');

var rabbitsApp = angular.module('rabbitsApp', []);

require('./rabbits/controllers/rabbits_controller.js')(rabbitsApp);
