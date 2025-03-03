myApp.controller('ownerProfileController',['$scope','AuthService',function($scope,AuthService){

  $scope.owner=AuthService.getUser();

  $scope.logout = function(){
    AuthService.logout();
  }

}])