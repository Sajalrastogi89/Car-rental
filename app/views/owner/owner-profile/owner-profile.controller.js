myApp.controller('ownerProfileController',['$scope',function($scope){

  $scope.owner=JSON.parse(sessionStorage.getItem('loginData'));
  console.log($scope.owner);
}])