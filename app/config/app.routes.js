myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  // Define the state for the login/sign-up page
  $stateProvider
    .state('auth', {
      url: '/auth',
      templateUrl: 'app/views/auth/auth.html',
      controller: 'AuthController'
    })
    .state('owner', {
      url: '/owner-dashboard',
      templateUrl: 'app/views/owner/owner-dashboard.html',
      controller: 'OwnerController'
    })
    .state('user', {
      url: '/user-dashboard',
      templateUrl: 'app/views/user/user-dashboard.html',
      controller: 'UserController'
    });

  // Set the default route
  $urlRouterProvider.otherwise('/auth');

}]);
