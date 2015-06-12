'use strict';

module.exports = function(app) {
  app.directive('newRabbitFormDirective', function() {
    return {
      restrict: 'A', //main options, again, are ECMA. Element, Class, coMments, and Attributes
      replace: true, //this will get rendered to the DOM as a form! whatever we include this directive in
      //(i.e. a <div>) will get replaced. Good if we want our HTML to keep its semantic meaning,
      //and not just be full of wrappers.
      templateUrl: '/templates/directives/new_rabbit_form.html'
      //scope: {} //isolate scope!

      //new_rabbit_form.html: We can create html files that we can statically serve.
      //The application will find these html files and use them as templates.
      //(They must contain a single element if you're using replace.
      //<form></form><!--comment---> will break! Because otherwise, you could
      //replace a single element (the directive) with multiple elements/nodes,
      //which is unsupported and not commonly needed in practice.
    };
  });
};
