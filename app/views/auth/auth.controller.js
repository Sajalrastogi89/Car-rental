myApp.controller("AuthController", [
  "$scope",
  "$state",
  "IndexedDBService",
  "ToastService",
  "$q",
  function ($scope, $state, IndexedDBService, ToastService,$q) {

    $scope.activeTab = "login"; // set default page as login page

    $scope.loginData = {}; // declaraction and initialization of loginData for login page
    $scope.user = {}; // declaraction and initialization of user for sign up page

    $scope.loginData.role = "user"; // default selected role for login page
    $scope.user.role = "user"; // default selected role for signup page
    


    /**
     * @description - this function checks email -> password -> role
     * then store fetched data inside session storage and redirect user to user page
     * and owner to owner page
     */
    $scope.login = function () {
      // check email exsists or not in database
      $scope.checkEmail($scope.loginData.email.toLowerCase())
        .then((user) => {
          if(!user){
            throw new Error("User does not exsist");
          }
          // check user provided password from stored password
          if (user.password !== $scope.loginData.password) {
            throw new Error("Password is not valid");
          }
          // check selected role
          // if (user.role !== $scope.loginData.role) {
          //   console.log(user.role, $scope.loginData.role);
          //   throw new Error("Role is not valid");
          // }
          // store details inside session storage
          sessionStorage.setItem("loginData", JSON.stringify(user));
          // redirect user according to role
          $state.go(user.role);
        })
        .catch((e) => {
          ToastService.error(e.message,3000);
        });
    };

    // Register function
    /**
     * @description - this will validate user credentials and then store it in database
     */
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
          return IndexedDBService.addRecord("users", $scope.user);
        })
        .then(() => {
          ToastService.success("User Registered",3000);
        })
        .catch(() => {
          ToastService.error("User Already Exists",3000);
        });
    };

    /**
     * @description - this will fetch record from database
     * @param {String} email 
     * @returns {Promise}
     */
    $scope.checkEmail = function (email) {
      let deferred=$q.defer();
      IndexedDBService.getRecord("users", email).then((user)=>{
        deferred.resolve(user)
      }).catch((e)=>{
        deferred.reject(e);
      })
      return deferred.promise;
    };
  },
]);
