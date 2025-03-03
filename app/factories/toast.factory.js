myApp.factory("ToastService", ['$q', '$rootScope', function ($q, $rootScope) {
  $rootScope.toast = { show: false, message: "", type: "" };

  return {
    showToast: function (type, message) {
      console.log("Showing toast:", type, message);

      let deferred = $q.defer();

      // Set toast properties
      $rootScope.toast.type = type;
      $rootScope.toast.message = message;
      $rootScope.toast.show = true;

      // Hide toast after 3 seconds using Promise-based delay
      let hideToast = new Promise((resolve) => {
        setTimeout(() => {
          $rootScope.toast.show = false;
          resolve();
        }, 3000);
      });

      hideToast.then(() => deferred.resolve()); // Resolve promise after hiding toast

      return deferred.promise; // Return the promise
    }
  };
}]);
