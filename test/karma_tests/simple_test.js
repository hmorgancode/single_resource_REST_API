'use strict';

describe('simple test', function() {
  //Jasmine will give us an 'expect' at the global level.
  //(if you're jshinting these files, you will also have to add expect to your list of globals)
  //((have a separate .jshintrc and globals for your karma tests))
  it('should be true', function() {
    expect(true).toBe(true);
  });
});
