'use strict';

angular.module('user').controller('EditProfileController', ['$scope', '$http', '$location', 'User', 'Authentication',
  function($scope, $http, $location, User, Authentication) {
    $scope.user = Authentication.user;

    $scope.getProfile = function() {
      User.get(function(data) {
        $scope.user = data;
      });
    };

    // Update a user profile
    $scope.updateUserProfile = function(isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new User($scope.user);

      user.$update(function(response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function(response) {
        $scope.error = response.data.message;
      });
    };
  }
]);