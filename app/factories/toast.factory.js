myApp.factory("ToastService", ['$timeout', '$rootScope', function ($timeout, $rootScope) {
  $rootScope.toast = { show: false, message: "", type: "" };

  return {
    showToast: function (type, message) {
      console.log("Showing toast:", type, message);

      // Ensure AngularJS detects changes
      $rootScope.$applyAsync(() => {
        $rootScope.toast.type = type;
        $rootScope.toast.message = message;
        $rootScope.toast.show = true;
      });

      // Auto-hide after 3 seconds
      $timeout(function () {
        $rootScope.$applyAsync(() => {
          $rootScope.toast.show = false;
        });
      }, 3000);
    }
  };
}]);
