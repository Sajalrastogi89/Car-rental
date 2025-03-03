myApp.controller('userBookingController',["IndexedDBService","$scope","$rootScope","$q",function(IndexedDBService,$scope,$rootScope,$q){


  $scope.bookings=[]; // declaration and initialization for storing bookings
$scope.selectedSort = "car.startDate"
$scope.sortBid={
  startDate: "recent",
  basePrice: "base price"
}

  /**
   * @description - this will run when page loaded
   */
  $scope.init = function(){
  $rootScope.isLoading=true;
  $scope.getUserBookings().then(
    (allBookings)=>{
      console.log(allBookings);
      $scope.bookings=allBookings;
      $rootScope.isLoading=false;
    }
  ).catch((e)=>{
    console.log(e);
    $rootScope.isLoading=false;
  });
  }


  /**
   * @description - this will fetch all the bookings from database
   * and convert image blob to temporary image url
   */
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