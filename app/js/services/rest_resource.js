'use strict';

module.exports = function(app) {
  var handleError = function(callback) {
    return function(data) {
      console.log(data);
      callback(data);
    };
  };

  var handleSuccess = function(callback) {
    return function(data) {
      callback(null, data);
    };
  };

  //$http is how we make requests back to the server, like the jQuery AJAX request but more geared for angular
  //be wary, $http is a singleton.
  app.factory('RESTResource', ['$http', function($http) {
    //Create a constructor function inside of here, and THEN use that function to build our resource-manipulating functionality
    //(we'll be using Node-style callbacks instead of promises)
    return function(resourceName) {
      return {
        getAll: function(callback) {
          $http.get('/api/' + resourceName)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        create: function(resourceData, callback) {
          $http.post('/api/' + resourceName, resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        save: function(resourceData, callback) {
          $http.put('/api/' + resourceName, resourceData) //+ '/' + resourceData._id, resourceData)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        },

        remove: function(resourceData, callback) {
          $http.delete('/api/' + resourceName + '/' + resourceData._id)
            .success(handleSuccess(callback))
            .error(handleError(callback));
        }

      };
    };
  }]);
};
