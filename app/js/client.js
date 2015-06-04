'use strict';

//webpack's entry point
//require('angular/angular'); //run the angular.js file inside angular, NOT index.js inside angular
                            //(this way we get everything in angular.js within this file's scope)

//This avoids a jshint error where angular is undefined, but keeping the old notes around for now:
var angular = require('angular');

var greet = require('./greet');

var rabbitsApp = angular.module('rabbitsApp', []); //this is what'll be referred to.
                                               //This array is how we'll get our dependencies into the module.
                                               //(without these two square brackets, it's going to look for
                                                //an already-defined module named rabbitsApp and give you a ref to it)
                                              //(this becomes important once you've got everything in different files)

//rabbitsApp. //these modules, i.e. rabbitsApp, will most often be used to namespace your app

//General convention in Angular: the name of the thing we're creating, and then the list of dependencies
  //(the array also has a function that gets run when instantiated)
  //scope is a javascript object that we can access, both in our view and in our controller, VERY important in angular
  //(function($scope) would actually get parsed just fine, but we minify later and turn $scope into something like 'a',
    //hence needing '$scope' as a string.)
rabbitsApp.controller('rabbitsController', ['$scope', function($scope) {
  $scope.greeting = 'hello world!'; //will set scope.greeting to 'hello world'
                                    //This is how we bind things (controllers and directives) with the view
  $scope.displayGreeting = function() {
    alert($scope.greeting); //if scope.greeting changes in the view, it'll affect the scope in the controller that it corresponds to!
                            //(two-way data binding! when we update one, we update the other)
                            //(becomes messy, quickly, when you have a lot in the same view)
  };
}]);

//MVC: model view controller
//model: where you store all the data (plain old javascript and javascript objects)
//view: what the user actually sees
//controller: the glue between our models and the view

//$scope is shared between the controller and the view


rabbitsApp.controller('oneMoreController', ['$scope', function($scope) {
  //We pull in $scope.greeting from the closest scope, since we don't define it here
  //We check up the scope chain, etc..., and if we never find it, create it with a blank value
  //So, $scope.greeting here will be "hello world" from the main scope it's nested in.  
}]);

rabbitsApp.controller('anotherController', ['$scope', function($scope) {
  $scope.greeting = 'another greeting'; //This 'greeting' is within a different scope in the .html file,
                                        //so it won't affect the earlier greeting.
}]);

//AngularJS plugin for chrome/chromium (there are two, batarang's 'kinda garbage now', pick ng-Inspector)
//Gives you a lot of useful information, PARTICULARLY your different scoping layers, valuable for debugging where your data's going.

//Generally, don't touch/modify root scope. It's like setting a global variable- occasionally you'll have a good reason, but not often.


