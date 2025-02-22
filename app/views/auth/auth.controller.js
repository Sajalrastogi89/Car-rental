myApp.controller('AuthController', ['$scope', 'IndexedDBService', 'AuthService',function($scope,IndexedDBService,AuthService) {
  
  // Default active tab
  $scope.activeTab = 'login';
  
  // Models for login and signup
  $scope.loginData = {};
  $scope.user = {};
  $scope.loginData.role = 'user';
  $scope.user.role = 'user';

  // Login function
  $scope.login =function() {
    console.log("Login data:", $scope.loginData);
    // Implement login logic here

  };

  // Register function
  $scope.register = async function addUserAsync() {
    try {
      console.log(12);
      if ($scope.user.role === 'user') {
        $scope.user.verified = true;
      } else if ($scope.user.role === 'owner') {
        $scope.user.verified = false;
      }
      
      const successMessage = await IndexedDBService.addRecord('users',$scope.user);
      console.log(successMessage);
      // If you notice the view not updating, you might need to call:
      // $scope.$apply();
    } catch (error) {
      console.error('Error adding user:', error);
      // Similarly, call $scope.$apply(); here if necessary.
    }
  };

}]);
