myApp.controller('userProfileController',['$scope',function($scope){

  $scope.user=JSON.parse(sessionStorage.getItem('loginData'));
  console.log($scope.user);
}])