myApp.controller('userBookingController',["IndexedDBService","$scope","$rootScope","$q",function(IndexedDBService,$scope,$rootScope,$q){


  $scope.bookings=[];


  $scope.init = function(){
  $rootScope.isLoading=true;
  $scope.getUserBookings().then(
    (allBookings)=>{
      $scope.bookings=allBookings;
      $rootScope.isLoading=false;
    }
  ).catch((e)=>{
    console.log(e);
    $rootScope.isLoading=false;
  });
  }

  $scope.getUserBookings = function () {
    let deferred = $q.defer();
    const userEmail = JSON.parse(sessionStorage.getItem("loginData")).email;
    IndexedDBService.getRecordsUsingIndex("biddings", "user_id", userEmail)
      .then((allBookings) => {
        const filteredBookings = allBookings
          .filter((booking) => booking.status === "accepted") 
          .map((booking) => {
            if (booking.car.image instanceof Blob) {
              booking.car.image = URL.createObjectURL(booking.car.image);
            }
            return booking;
          });
        deferred.resolve(filteredBookings);
      })
      .catch((e) => {
        deferred.reject(e);
        console.log(e.message);
      });
    return deferred.promise;
  };

  $scope.init();

}])