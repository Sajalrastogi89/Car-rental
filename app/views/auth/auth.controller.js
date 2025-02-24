myApp.controller('AuthController', ['$scope','$state', 'IndexedDBService', 'AuthService','ToastService',function($scope,$state,IndexedDBService,AuthService,ToastService) {
  
  // Default active tab
  $scope.activeTab = 'login';
  
  // Models for login and signup
  $scope.loginData = {};
  $scope.user = {};
  $scope.loginData.role = 'user';
  $scope.user.role = 'user';

  // Login function
  $scope.login = async function () {
    try {
      let result = await AuthService.checkEmail($scope.loginData.email.toLowerCase());
      if (!result) {
        throw new Error("User does not exist",result);
      }
  
      let passwordValid = await AuthService.checkPassword($scope.loginData.password);
      if (!passwordValid) {
        throw new Error("Password is incorrect");
      }

      let roleValid = await AuthService.checkRole($scope.loginData.role);
      if(!roleValid) {
        console.log($scope.loginData.role);
        throw new Error(`You are not ${$scope.loginData.role}`);
      }

      let userData = AuthService.getUserData();

      if ($scope.loginData.role === 'owner') {
        sessionStorage.setItem('loginData',JSON.stringify(userData));
        $state.go('owner');  
      } 
      else if ($scope.loginData.role === 'user') {
        sessionStorage.setItem('loginData',JSON.stringify(userData));
        $state.go('user');  
      }
      
      console.log("Login data:", $scope.loginData);
      // Implement login logic here
    } catch (e) { // <-- Ensure 'e' is used correctly
      ToastService.showToast("error", e.message);
      console.log(e);
    }
  };
  

  // Register function
  $scope.register = async function () {
    try {
      console.log(12);
      if ($scope.user.role === 'user') {
        $scope.user.verified = true;
      } else if ($scope.user.role === 'owner') {
        $scope.user.verified = false;
      }
      $scope.user.email=$scope.user.email.toLowerCase();
      const successMessage = await IndexedDBService.addRecord('users',$scope.user);
      console.log(successMessage);
      // If you notice the view not updating, you might need to call:
      // $scope.$apply();
    } catch (error) {
      //add toast


      console.error('Error adding user:', error);
      console.error(10);
      // Similarly, call $scope.$apply(); here if necessary.
      ToastService.showToast("error","User Already Exists");
    }
  };

}]);
