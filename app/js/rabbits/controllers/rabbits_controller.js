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
      $scope.rabbits.push($scope.newRabbit);
      var newRabbitIndex = $scope.rabbits.indexOf($scope.newRabbit); //In case we fail and need to remove it
      $http.post('/rabbits', $scope.newRabbit)
        .success(function(data) {
          $scope.newRabbit = null;
          $scope.rabbits[newRabbitIndex] = data;
        })
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'could not create new rabbit.'});
          $scope.rabbits.splice(newRabbitIndex, 1); //remove our wrongly-created rabbit
        });
    };

    $scope.removeRabbit = function(rabbit) {
      var rabbitIndex = $scope.rabbits.indexOf(rabbit);
      $scope.rabbits.splice(rabbitIndex, 1); //We immediately remove the rabbit from our list, to be responsive
                                                                //(If the request fails, we'll go back and inform the user.)
      $http.delete('/rabbits/' + rabbit._id)//, {params: {id: rabbit._id}})
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'could not remove rabbit: ' + rabbit.name});
          $scope.rabbits.splice(rabbitIndex, 0, rabbit); //Add the rabbit back to our list
      });
    };

    $scope.saveRabbit = function(rabbit) {
      rabbit.editing = false; //Send it back to our database to be saved, the extra property (editing) will be ignored.

      $http.put('/rabbits', rabbit)
        .success(function(data) {
          rabbit.origRabbit = null;
        })
        .error(function(data) {
          console.log(data);
          $scope.errors.push({msg: 'could not update rabbit'});
          $scope.cancelEdit(rabbit); //Can I do this? Apparently!
        });
    };

    $scope.editRabbit = function(rabbit) {
      rabbit.editing = true;
      rabbit.origRabbit = angular.copy(rabbit);
    };

    $scope.cancelEdit = function(rabbit) {
      rabbit.editing = false;
      rabbit.name = rabbit.origRabbit.name;
      rabbit.weight = rabbit.origRabbit.weight;
      rabbit.origRabbit = null;
    };

    $scope.clearErrors = function() {
      $scope.errors = []; //same result as when we just had this line (errors = []) in html instead of calling clearErrors
      //If you change objects inside of the view, it won't call $scope.apply
      //But if we modify $scope (meaning, we're OUTSIDE of the view, i.e. here, it'll call $scope.apply
        //and redraw the entire screen. This is one of the reasons Angular is considered slow, and one of what React is reacting to.)
      $scope.getAll();
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