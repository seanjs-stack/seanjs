'use strict';

angular.module('user.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function($scope, $state, Authentication, userResolve) {

    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function() {

      if (confirm('Are you sure you want to delete this user?')) {

        var user = $scope.user;
        user.$remove({
          'userId': user.id
        }, function() {
          $state.go('admin.users');
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });


      }
    };

    $scope.update = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      var user = $scope.user;

      user.$update({
        'userId': user.id
      }, function() {
        $state.go('admin.user', {
          userId: user.id
        });
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);