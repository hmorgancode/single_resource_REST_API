'use strict';

//webpack's entry point

//var angular; //will be assigned a value by requiring angular/angular.js.
             //(without this, jshint won't like angular suddenly being defined.)

//require('angular/angular'); //run the angular.js file inside angular, NOT index.js inside angular
                            //(this way we get everything in angular.js within this file's scope)

//Simpler, but keeping the old notes around for now:
var angular = require('angular');

var greet = require('./greet');

var rabbitsApp = angular.module('rabbitsApp', []); //this is what'll be referred to.
                                               //This array is how we'll get our dependencies into the module.
