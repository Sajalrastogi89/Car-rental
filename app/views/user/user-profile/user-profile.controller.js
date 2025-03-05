myApp.controller("userProfileController", [
  "$scope",
  "AuthService",
  function ($scope, AuthService) {

    //  Retrieving user details from session data - 'loginData'
    $scope.init = function(){
      $scope.user = AuthService.getUser();
    }

    /**
     * @description - Remove session data and redirect user to auth page
     */
    $scope.logout = function () {
      AuthService.logout();
    };
  },
]);
