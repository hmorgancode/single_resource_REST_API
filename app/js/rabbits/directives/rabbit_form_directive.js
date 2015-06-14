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

//Passing a function from the parent scope into this scope: in index.html:
//<div data-new-rabbit-form-directive data-create-new-rabbit="createNewRabbit(rabbit)"></div>
//(We indicate both the function name, AND the arguments' names)
//Then, in rabbit_form.html:
//<form name="newRabbitForm" data-ng-submit="createNewRabbit({rabbit: newRabbit})">
//We indicate the function, now registered within this directive's scope, that we want to call.
//And we call it, *SPECIFYING EACH PARAMETER WE WANT TO PASS TO IT BY NAME*,
//and it'll be evaluated in the original scope.
//(Why specify the parameter names? The parameters aren't deeply copied, so I assume
//it's just Angular being Angular., since Tyler

//Three ways to pass something into a directive:
//& is one, = is another, @ is another
//@ will read the HTML directly, i.e. "My Label Text"
//= wants javascript to parse, i.e. "'My Label Text' + myLabelName"
//Look up & more thoroughly later.
