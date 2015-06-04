'use strict';

module.exports = function(app) { //app === an angular module
  app.controller('rabbitsController', ['$scope', '$http', function($scope, $http) {
    $scope.errors = []; //so you can just throw errors in here as they happen 
    $scope.rabbits = []; //(we need these to be $scope. so that we can access them in the view)

    //$http is how we make requests back to the server, like the jQuery AJAX request but more geared for angular
    //be wary, $http is a singleton.
    $scope.getAll = function() {
      $http.get('/rabbits') //returns a promise!
        .success(function(data) { //(callback has more params, check docs. headers and config will be good to check in case of bugs)
          $scope.rabbits = data;
        })
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'error retrieving rabbits'});
        });
    };

    $scope.createNewRabbit = function() {
      $http.post('/rabbits', $scope.newRabbit)
        .success(function(data) {
          $scope.rabbits.push(data);
          $scope.newRabbit = null;
        })
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'could not create new rabbit.'});
        });
    };

    $scope.removeRabbit = function(rabbit) {
      $scope.rabbits.splice($scope.rabbits.indexOf(rabbit), 1); //We immediately remove the rabbit from our list, to be responsive
                                                                //(If the request fails, we'll go back and inform the user.)
      $http.delete('/rabbits/' + rabbit._id)//, {params: {id: rabbit._id}})
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'could not remove rabbit ' + rabbit.name});
      });
    };
  }]);
};

//Design Patterns: Elements of Reusable Object-Oriented Software, by the gang of four

//Anything that starts with a $ is a piece of angular, defined by angular.
//Don't name anything you build with a leading $
//(also, you shouldn't mix jQuery and Angular)


/* //The equivalent of a for-loop: We display a list tag for each element in the array we created
<ul data-ng-repeat="rabbit in rabbits"> //Whereas other frameworks might preprocess everything server-side into HTML,
  <li>{{rabbit.rabbitBody}}</li>        //this processes directly. Hence the quotes- makes it valid HTML
</ul>
*/