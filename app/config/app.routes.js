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
      templateUrl: 'app/views/owner/owner-dashboard/owner-dashboard.html',
      controller: 'OwnerDashboardController'
    })
    .state('user', {
      url: '/user-dashboard',
      templateUrl: 'app/views/user/user-dashboard/user-dashboard.html',
      controller: 'UserController'
    })
    .state('addCar',{
      url: '/addCar',
      templateUrl: 'app/views/owner/owner-addCar/owner-addCar.html',
      controller: 'AddCar'
    })
    .state('carDetails',{
      url: "/car-details/:id",
      templateUrl: 'app/views/user/user-car/user-car.html',
      controller: 'carController'
    })
    .state('userBiddings',{
      url: "/user-biddings",
      templateUrl: "app/views/user/user-bidding/user-bidding.html",
      controller: 'userBiddingController'
    })
    .state('ownerBiddings',{
      url: "/owner-biddings",
      templateUrl: "app/views/owner/owner-Bidding/owner-bidding.html",
      controller: 'ownerBiddingController'
    })
    .state('userBooking',{
      url: "/user-bookings",
      templateUrl: "app/views/user/user-bookings/user-bookings.html",
      controller: "userBookingController"
    })
    .state('ownerBooking',{
      url: "/owner-bookings",
      templateUrl: "app/views/owner/owner-booking/owner-booking.html",
      controller: "ownerBookingController"
    })
    .state('ownerProfile',{
      url: "/owner-profile",
      templateUrl: "app/views/owner/owner-profile/owner-profile.html",
      controller: "ownerProfileController"
    })
    .state('userProfile',{
      url: "/user-profile",
      templateUrl: "app/views/user/user-profile/user-profile.html",
      controller: "userProfileController"
    })
    .state('userChat',{
      url: "/user-chat",
      templateUrl: "app/views/user/user-chat/user-chat.html",
      controller: "userChatController"
    })
    .state('ownerChat',{
      url: "/owner-chat",
      templateUrl: "app/views/owner/owner-chat/owner-chat.html",
      controller: "ownerChatController"
    })
  // Set the default route
  $urlRouterProvider.otherwise('/auth');

}]);
