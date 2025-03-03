myApp.service("AuthService", ["$q", "$state", function ($q, $state) {
  
  /**
   * @description - check session storage
   * @returns {Boolean}
   */
  this.isLoggedIn = function () {
    return !!sessionStorage.getItem("loginData");
  };

  /**
   * @description - this will fetch data from session storage
   * @returns {Object|null}
   */
  this.getUser = function () {
    let user = sessionStorage.getItem("loginData");
    return user ? JSON.parse(user) : null;
  };

  /**
   * @description - This will fetch user role
   * @returns {String|null}
   */
  this.getUserRole = function () {
    let user = this.getUser();
    return user?.role || null;
  };

  /**
   * @description - This will check user role and redirect to suitable page
   * @param {String} requiredRole
   */
  this.requireRole = function (requiredRole) {
    const deferred=$q.defer();
    let userRole = this.getUserRole();
    
    if (this.isLoggedIn() && userRole === requiredRole) {
      deferred.resolve();  // Instead of deferred
    } else {
      $state.go("auth");
      deferred.reject();
    }
    return deferred.promise;
  };

  /**
   * @description - This will clear session storage and send user to auth page
   */
  this.logout = function () {
    sessionStorage.removeItem("loginData");
    $state.go("auth");
  };

}]);
