myApp.controller("ownerBookingController", [
  "$scope",
  "$rootScope",
  "$q",
  "IndexedDBService",
  "BookingService",
  function ($scope, $rootScope, $q, IndexedDBService, BookingService) {
    $scope.bookings = [];
    $scope.selectedFilter = false;
    $scope.filterBooking = {
      "In Progess": false,
      "History": true,
    };

    $scope.init = function () {
      $rootScope.isLoading = true;
      $scope
        .getUserBookings()
        .then((allBookings) => {
          $scope.bookings = allBookings;
          console.log(allBookings);
          $rootScope.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          $rootScope.isLoading = false;
        });
    };

    $scope.getUserBookings = function () {
      let deferred = $q.defer();
      const ownerEmail = JSON.parse(sessionStorage.getItem("loginData")).email;
      IndexedDBService.getRecordsUsingIndex("biddings", "owner_id", ownerEmail)
        .then((allBookings) => {
          const filteredBookings = allBookings
            .filter((booking) => booking.status === "accepted")
            .map((booking) => {
              if (booking.car.image instanceof Blob) {
                booking.car.image = URL.createObjectURL(booking.car.image);
              }
              if (booking.car.endDate < Date.now()) {
                console.log(booking.car.endDate, Date.now());
                booking.car.isCompleted = true;
              }
              booking.paymentStatus=false;
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

    $scope.uploadOdometerValue = function (odometerReading, booking) {
      odometerReading = Number(odometerReading);
      //calculate total distance and cost
      let [distance, cost] = $scope.calculateTripDetails(
        odometerReading,
        booking
      );
      let updateBooking = {
        id: booking.id,
        paymentStatus: true,
        distanceTravelled: distance,
        totalAmount: cost,
      };
      //update biddings table in db
      //update car total distance
      IndexedDBService.updateRecord("biddings", updateBooking)
        .then((updatedRecord) => {
          booking.paymentStatus = true;
          console.log(updatedRecord);
          let car = {
            id: booking.car.id,
            travelled: (booking.car.travelled || 0) + distance,
          };
          console.log("car object", car, "tavelled", booking.car.travelled);
          return IndexedDBService.updateRecord("cars", car);
        })
        .then((car) => {
          console.log("car response", car);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    $scope.calculateTripDetails = function (odometerReading, booking) {
      let travelled = odometerReading - Number(booking.car.travelled || 0);
      let days =
        (booking.car.endDate - booking.car.startDate) / (1000 * 60 * 60 * 24);
      let cost =
        travelled * Number(booking.car.pricePerKm) +
        Number(booking.car.basePrice) * days;
      return [travelled, cost];
    };

    $scope.openInvoice = function (booking) {
      booking.showInvoice = true;
      console.log("open invoice", booking.showInvoice);
    };
    $scope.closeInvoice = function (booking) {
      booking.showInvoice = false;
    };

    $scope.init();
  },
]);
