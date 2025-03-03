myApp.service("AuthService", ["$q", "$state", function ($q, $state) {
  
  this.isLoggedIn = function () {
    return !!sessionStorage.getItem("loginData");
  };

  this.getUser = function () {
    let user = sessionStorage.getItem("loginData");
    return user ? JSON.parse(user) : null;
  };

  this.getUserRole = function () {
    let user = this.getUser();
    return user?.role || null;
  };

  this.requireRole = function (requiredRole) {
    const deferred=$q.defer();
    let userRole = this.getUserRole();
    
    console.log(userRole,requiredRole);
    
    if (this.isLoggedIn() && userRole === requiredRole) {
      deferred.resolve();  // Instead of deferred
    } else {
      $state.go("auth");
      deferred.reject();
    }
    return deferred.promise;
  };

  this.logout = function () {
    sessionStorage.removeItem("loginData");
    $state.go("auth");
  };

}]);
