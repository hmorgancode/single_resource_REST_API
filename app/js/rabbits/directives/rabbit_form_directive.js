'use strict';

module.exports = function(app) {
  app.directive('rabbitFormDirective', function() {
    return {
      restrict: 'A', //main options, again, are ECMA. Element, Class, coMments, and Attributes
      replace: true, //this will get rendered to the DOM as a form! whatever we include this directive in
      //(i.e. a <div>) will get replaced. Good if we want our HTML to keep its semantic meaning,
      //and not just be full of wrappers.
      templateUrl: '/templates/directives/rabbit_form.html',
      scope: {
        save: '&',
        buttonText: '=',
        labelText: '@',
        rabbit: '='
      }, //isolate scope!
      transclude: true //allows us to  wrap some html outside of the directive's contents.
      //(Everything will be placed wherever data-ng-transclude is in our form.
      //(Everything within the DOM element where our directive is an attribute, will be transcluded.)
    };
  });
};
