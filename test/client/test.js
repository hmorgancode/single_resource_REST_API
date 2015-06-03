'use strict';

var expect = require('chai').expect;
var greet = require('../../app/js/greet.js');

describe('greet module', function() {
  it('should return a greeting', function() {
    expect(greet()).to.eql(
      'Why keep a database of rabbits\' names? Good question! You see, ...');
  });
});
