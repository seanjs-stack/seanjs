'use strict';

//Contact form service
angular.module('core').factory('ContactForm', ['$resource',
  function($resource) {
    return $resource('api/contact', {}, {
      update: {
        method: 'POST'
      }
    });
  }
]);
