myApp.controller("userBookingController", [
  "IndexedDBService",
  "$scope",
  "$q",
  function (IndexedDBService, $scope, $q) {
    $scope.bookings = []; // declaration and initialization for storing bookings
    $scope.selectedSort = "car.startDate";
    $scope.sortBid = {
      startDate: "recent",
      basePrice: "base price",
    };

    /**
     * @description - this will run when page loaded
     */
    $scope.init = function () {
      $scope.isLoading = true;
      $scope
        .getUserBookings()
        .then((allBookings) => {
          $scope.bookings = allBookings;
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(()=>{
          $scope.isLoading = false;
        })
    };

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
        });
      return deferred.promise;
    };
  },
]);
