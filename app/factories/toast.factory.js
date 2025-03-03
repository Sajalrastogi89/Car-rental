myApp.factory("ToastService", ['$q', '$rootScope','$timeout', function ($q, $rootScope,$timeout) {
  $rootScope.toast = { show: false, message: "", type: "" };

  return {
    showToast: function (type, message) {

      let deferred = $q.defer();

      // Set toast properties
      $rootScope.toast.type = type;
      $rootScope.toast.message = message;
      $rootScope.toast.show = true;

      
      let hideToast = new Promise((resolve) => {
        $timeout(() => {
          $rootScope.toast.show = false;
          resolve();
        }, 3000);
      });

      hideToast.then(() => deferred.resolve()); // Resolve promise after hiding toast

      return deferred.promise; // Return the promise
    }
  };
}]);
