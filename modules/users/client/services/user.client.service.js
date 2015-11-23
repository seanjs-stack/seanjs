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

angular.module('user.admin').factory('Admin', ['$resource',
  function($resource) {
    return $resource('api/admin/user/:userId', {
      userId: '@_id'
    }, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      },
      update: {
        method: 'PUT'
      }
    });
  }
]);