myApp.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
  
   // Enable HTML5 mode
  //  $locationProvider.html5Mode(true);

  // Define the state for the login/sign up page
  $stateProvider
    .state('auth', {
      url: '/auth',
      templateUrl: 'app/views/auth/auth.html',
      controller: 'AuthController as authCtrl'
    });
  
  // Set the default route
  $urlRouterProvider.otherwise('/auth');
}]);
