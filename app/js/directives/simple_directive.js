'use strict';

module.exports = function(app) {
  app.directive('simpleDirective', function() {
    //return the metadata involving our directive
    //Restrict with:
    //Element
    //Class -so that you can style your directives the same way, 'grab' your directive in css
    //coMments
    //Attribute- i.e. data-ng- is an attribute
    //(remember as 'ECMA' ala ECMAScript)
    return {
      restrict: 'AC',
      //It's usually better to have an entire .html file as your template
      template: '<h2>{{someVal}}</h2>' +
                '<input type="text" data-ng-model="someVal">',
      //the way we can create an isolate scope:
      scope: {} //We immediately have a scope object for each and every instance of this directive.\
    };
  });
};
