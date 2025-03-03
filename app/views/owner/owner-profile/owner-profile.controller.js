myApp.controller('ownerProfileController',['$scope','AuthService',function($scope,AuthService){

  $scope.owner=AuthService.getUser(); // fetch owner details


  /**
   * @description - remove user data fromsession storage and redirect to auth page
   */
  $scope.logout = function(){
    AuthService.logout();
  }

}])