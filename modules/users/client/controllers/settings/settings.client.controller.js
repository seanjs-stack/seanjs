'use strict';

angular.module('user').controller('SettingsController', ['$scope', 'Authentication',
  function($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);