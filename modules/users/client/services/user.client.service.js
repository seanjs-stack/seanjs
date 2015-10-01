'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('user').factory('User', ['$resource',
  function($resource) {
    return $resource('api/user', {}, {
      get: {
        method: 'GET'
      },
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('user.admin').factory('Admin', ['$resource',
  function($resource) {
    return $resource('api/user/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);