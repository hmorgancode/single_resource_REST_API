'use strict';

//webpack's entry point

//'angular' will technically be undefined, need to add it to our exceptions in .jshintrc
//(we require angular/angular so everything's in the global namespace)
require('angular/angular');

var greet = require('./greet');

var rabbitsApp = angular.module('rabbitsApp', []);

require('./rabbits/controllers/rabbits_controller.js')(rabbitsApp);
