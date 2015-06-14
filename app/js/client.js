'use strict';

//webpack's entry point

//'angular' will technically be undefined, need to add it to our exceptions in .jshintrc
require('angular/angular');

var greet = require('./greet'); //old test

var rabbitsApp = angular.module('rabbitsApp', []);

//services
require('./services/deep_copy.js')(rabbitsApp);
require('./services/rest_resource.js')(rabbitsApp);

//controllers
require('./rabbits/controllers/rabbits_controller.js')(rabbitsApp);

//directives
require('./directives/simple_directive.js')(rabbitsApp);
require('./rabbits/directives/rabbit_form_directive.js')(rabbitsApp);
