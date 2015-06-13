'use strict';

module.exports = function(app) {
  app.directive('newRabbitFormDirective', function() {
    return {
      restrict: 'A', //main options, again, are ECMA. Element, Class, coMments, and Attributes
      replace: true, //this will get rendered to the DOM as a form! whatever we include this directive in
      //(i.e. a <div>) will get replaced. Good if we want our HTML to keep its semantic meaning,
      //and not just be full of wrappers.
      templateUrl: '/templates/directives/new_rabbit_form.html',
      scope: {
        createNewRabbit: '&' //the & binding allows a directive to trigger evaluation of an
        //expression in the context of the original scope.
        //(we pass createNewRabbit INTO this directive as we create it, whenever we declare the directive)
      }, //isolate scope!
      transclude: true //allows us to use the scope above this one, or rather,
      //include the parent scope in this one. Thus, we'll be able to access createNewRabbit

      //new_rabbit_form.html: We can create html files that we can statically serve.
      //The application will find these html files and use them as templates.
      //(They must contain a single element if you're using replace.
      //<form></form><!--comment---> will break! Because otherwise, you could
      //replace a single element (the directive) with multiple elements/nodes,
      //which is unsupported and not commonly needed in practice.
    };
  });
};

//Passing a function from the parent scope into this scope: in index.html:
//<div data-new-rabbit-form-directive data-create-new-rabbit="createNewRabbit(rabbit)"></div>
//(We indicate both the function name, AND the arguments' names)
//Then, in new_rabbit_form.html:
//<form name="newRabbitForm" data-ng-submit="createNewRabbit({rabbit: newRabbit})">
//We indicate the function, now registered within this directive's scope, that we want to call.
//And we call it, *SPECIFYING EACH PARAMETER WE WANT TO PASS TO IT BY NAME*,
//and it'll be evaluated in the original scope.
//(Why specify the parameter names? The parameters aren't deeply copied, so I assume
//it's just Angular being Angular., since Tyler

//Three ways to pass something into a directive:
//& is one, = is another, @ is another
