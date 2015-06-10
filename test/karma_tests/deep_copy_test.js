'use strict';

require('../../app/js/client.js');
require('angular-mocks');

describe('copy service', function() {
  beforeEach(angular.mock.module('rabbitsApp'));

  //Again, we don't need an array specifying 'deepCopy' because we're not uglifying/minifying
  it('should deep copy an object', angular.mock.inject(function(deepCopy) {
    var testObj = {test: 'value'};
    var copiedObj = deepCopy(testObj);
    testObj = null;
    expect(copiedObj.test).toBe('value');
    expect(testObj).toBe(null);
  }));
});
