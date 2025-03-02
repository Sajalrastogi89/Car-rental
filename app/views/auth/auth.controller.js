myApp.controller("AuthController", [
  "$scope",
  "$state",
  "IndexedDBService",
  "ToastService",
  function ($scope, $state, IndexedDBService, ToastService) {

    $scope.activeTab = "login";
    $scope.loginData = {};
    $scope.user = {};
    $scope.loginData.role = "user";
    $scope.user.role = "user";
    // $scope.loginData.password="";
    // Login function
    $scope.login = function () {
      $scope.checkEmail($scope.loginData.email.toLowerCase())
        .then((user) => {
          if(!user){
            throw new Error("User does not exsist");
          }
          console.log(1);
          if (user.password !== $scope.loginData.password) {
            throw new Error("Password is not valid");
          }
          console.log(2);
          if (user.role !== $scope.loginData.role) {
            console.log(user.role, $scope.loginData.role);
            throw new Error("Role is not valid");
          }
          sessionStorage.setItem("loginData", JSON.stringify(user));
          $state.go(user.role);
        })
        .catch((e) => {
          ToastService.showToast("error", e.message);
          console.log("User does not exist");
        });
    };

    // Register function
    $scope.register = function () {
      if ($scope.user.role === "user") {
        $scope.user.verified = true;
      } else if ($scope.user.role === "owner") {
        $scope.user.verified = false;
      }
      $scope.user.email = $scope.user.email.toLowerCase();

      $scope.checkEmail($scope.user.email)
        .then((user) => {
          if(user){
            throw new Error("User already registered");
          }
          console.log($scope.user, 1);
          return IndexedDBService.addRecord("users", $scope.user);
        })
        .then(() => {
          console.log("User added");
          ToastService.showToast("success", "User Registered");
        })
        .catch((error) => {
          console.error("Error:", error);
          ToastService.showToast("error", "User Already Exists");
        });
    };

    $scope.checkEmail = function (email) {
      return IndexedDBService.getRecord("users", email)
    };
  },
]);
