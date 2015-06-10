'use strict';

//Unit tests for JUST the controller in our Angular app
//(we don't need to do end-to-end testing, i.e. test that Angular itself is working/rendering)

require('../../app/js/client.js'); //load up all the different bits & pieces from our client (all the code we copy into our bundle)
require('angular-mocks'); //npm install this as well
                          //- lets us delve into the internal working pieces of Angular and grab specific chunks to test JUST our stuff
                          //(we'll use it to grab a constructor for new scopes, and the controller constructor)
describe('rabbits controller', function() {
  var $cc; //Controller constructor
  var $httpBackend; //this will allow us to catch REST requests and 'respond' with data, without us needing to actually make requests
  //unit testing: mocks (stands in the place of something and replaces its functionality),
  //stubs (stands in the place of something, but does not replace its functionality. will track, will call the functions.),
  //spies (let us spy on (usually) a function, determine if it was called/with what parameters, without actually calling the function)
  var $scope;

  //So that we run through all the rabbitsApp functionality and register that controller on the rabbitsApp
  beforeEach(angular.mock.module('rabbitsApp')); //(and set that to the angular mock app that we're mocking out)

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    //(^^no bracket notation, because we're never going to minify test code)
    $scope = $rootScope.$new(); //(angular does this when you create a controller)
    $cc = $controller;
  }));

  //Before anything else, verify that our tests will work
  it('should be able to create a new controller', function() {
    //Something almost exactly like this is being called internally in Angular on your front end:
    var rabbitsController = $cc('rabbitsController', {$scope: $scope});
    expect(typeof rabbitsController).toBe('object');
    expect(Array.isArray($scope.rabbits));
    expect(typeof $scope.getAll).toBe('function');
  });

  //a separate describe block, to have a different beforeEach and guaranteeing that these are nested
  describe('REST functionality', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) { //the underscores are for clarity, we could just say $httpBackend
      $httpBackend = _$httpBackend_;
      this.rabbitsController = $cc('rabbitsController', {$scope: $scope}); //gives us access to $scope.getAll
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a get request on index', function() {
      $httpBackend.expectGET('/api/rabbits').respond(200, [{_id: '1', name: 'Jon Stewart', weight: 4}]);
      $scope.getAll(); //this will actually make the request that we're expecting
      $httpBackend.flush(); //will actually send all our responses that we've set up
                            //(this is when our callbacks in getAll, etc... will get called)
      expect($scope.rabbits[0].name).toBe('Jon Stewart');
      expect($scope.rabbits[0]._id).toBe('1');
      expect($scope.rabbits[0].weight).toBe(4);
    });

    //We can do error testing here much more easily than in our integration tests
    it('should correctly handle errors', function() {
      $httpBackend.expectGET('/api/rabbits').respond(500, {msg: 'server error'});
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('error retrieving rabbits');
    });

    it('should be able to save a new rabbit', function() {
      $httpBackend.expectPOST('/api/rabbits').respond(200, {_id: '2', name: 'Drax, The Destroyer', weight: 10});
      $scope.newRabbit = {name: 'Drax, The Destroyer', weight: 10};
      $scope.createNewRabbit();
      $httpBackend.flush();
      expect($scope.rabbits[0].name).toBe('Drax, The Destroyer');
      expect($scope.rabbits[0].weight).toBe(10);
      expect($scope.newRabbit).toBe(null);
    });

    it('should delete a rabbit', function() {
      $httpBackend.expectDELETE('/api/rabbits/3').respond(200, {msg: 'success'});
      var rabbit = {_id: '3', name: 'Ben', weight: 3}; //for the record, these ARE getting wiped every test.
      $scope.rabbits.push(rabbit);                      //(we just increment the ID every test for clarity)
      expect($scope.rabbits.indexOf(rabbit)).not.toBe(-1);
      $scope.removeRabbit(rabbit);
      expect($scope.rabbits.indexOf(rabbit)).toBe(-1);
      $httpBackend.flush();
      //We don't actually check anything after this!
      //We just wanted to make sure our rabbit was getting removed before getting a response.
    });

    it('should handle errors when deleting a rabbit', function() {
      $httpBackend.expectDELETE('/api/rabbits/4').respond(500, {msg: 'womp'});
      var rabbit = {_id: '4', name: 'Jerry', weight: 3};
      $scope.rabbits.push(rabbit); 
      //expect($scope.rabbits.indexOf(rabbit)).not.toBe(-1);
      $scope.removeRabbit(rabbit);
      //expect($scope.rabbits.indexOf(rabbit)).toBe(-1);
      $httpBackend.flush();
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('could not remove rabbit: Jerry');
      expect($scope.rabbits.length).toBe(1);
      expect($scope.rabbits[0].name).toBe('Jerry');
      expect($scope.rabbits[0].weight).toBe(3);
      expect($scope.rabbits[0]._id).toBe('4');
    });

    it('should update a rabbit', function() {
      $httpBackend.expectPUT('/api/rabbits').respond(200, {msg: 'success'});
      //Create a rabbit, first
      $scope.rabbits.push({name: 'Drax, The Destroyer', weight: 10, _id: '1'});
      var testRabbit = $scope.rabbits[0];

      //Now, attempt to edit the rabbit
      $scope.editRabbit(testRabbit);
      testRabbit.name = 'Groot';
      testRabbit.weight = 8;
      $scope.saveRabbit(testRabbit);
      $httpBackend.flush();

      //Verify that the rabbit was successfully edited
      expect(testRabbit.name).toBe('Groot');
      expect(testRabbit.weight).toBe(8);
      expect(testRabbit.origRabbit).toBe(null);
      expect($scope.rabbits.length).toBe(1);
    });

    it('should non-destructively cancel edits', function() {
      //Create a rabbit, first
      $scope.rabbits.push({name: 'Rocket', weight: 1, _id: '1'});
      var testRabbit = $scope.rabbits[0];

      //Verify that we set up non-destructive edits correctly
      $scope.editRabbit(testRabbit);
      expect(testRabbit.editing).toBe(true);
      expect(testRabbit.origRabbit.name).toBe('Rocket');
      expect(testRabbit.origRabbit.weight).toBe(1);

      //Verify that we cancel edits correctly
      testRabbit.name = 'Gamora';
      testRabbit.weight = 6;
      $scope.cancelEdit(testRabbit);
      expect(testRabbit.editing).toBe(false);
      expect(testRabbit.name).toBe('Rocket');
      expect(testRabbit.weight).toBe(1);
      expect(testRabbit.origRabbit).toBe(null);
      expect($scope.rabbits.length).toBe(1);
    });

    it('should handle errors when updating a rabbit', function() {
      $httpBackend.expectPUT('/api/rabbits').respond(500, {msg: 'internal server error'});
      //Create a rabbit, first
      $scope.rabbits.push({name: 'Rocket', weight: 1, _id: '1'});
      var testRabbit = $scope.rabbits[0];

      //Verify that we revert failed edits correctly
      $scope.editRabbit(testRabbit);
      testRabbit.name = 'Gamora';
      testRabbit.weight = 6;
      $scope.saveRabbit(testRabbit);
      $httpBackend.flush();
      expect(testRabbit.editing).toBe(false);
      expect(testRabbit.name).toBe('Rocket');
      expect(testRabbit.weight).toBe(1);
      expect(testRabbit.origRabbit).toBe(null);
      expect($scope.rabbits.length).toBe(1);

      //And verify that the error was noted
      expect($scope.errors.length).toBe(1);
      expect($scope.errors[0].msg).toBe('could not update rabbit');
    });

    it('should not allow a rabbit\'s ID to change', function() {
      //Should we watch out for this if it's never supposed to be allowed (ever) on the client side?
      //(...or does the fact that it's never allowed, ever, mean we should definitely watch for it?)
    });

  }); //end REST functionality test
}); //end rabbits controller test
