myApp.controller("ownerBookingController", [
  "$scope",
  "$q",
  "IndexedDBService",
  "ToastService",
  "blobFactory",
  function ($scope, $q, IndexedDBService, ToastService,blobFactory) {
    $scope.bookings = []; // declare and initialize bookings
    $scope.selectedFilter = false; // selected filter is for 'in progress' bookings

    // hardcoded dropdown values
    $scope.filterBooking = {
      "In Progess": false,
      History: true,
    };

    // this will run when page is loaded
    $scope.init = function () {
      $scope.isLoading = true;
      getUserBookings()
        .then((allBookings) => {
          console.log(allBookings);
          $scope.bookings = allBookings;
          $scope.isLoading = false;
        })
        .catch(() => {
          ToastService.error("Unable to fetch bookings");
          $scope.isLoading = false;
        });
    };

    /**
     * @description - this will fetch bookings from database and filter it on the basis of accepted
     * then map image blob to url, update completed status, payment status
     * and then resolve bids
     */
    getUserBookings = function () {
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
                booking.car.isCompleted = true;
              }
              if (!("paymentStatus" in booking)) booking.paymentStatus = false;
              return booking;
            });
          deferred.resolve(filteredBookings);
        })
        .catch((e) => {
          deferred.reject(e);
        });
      return deferred.promise;
    };

    /**
     * @description - This function will check odometer value then calculate distance travelled,
     * total cost and update database
     * @param {Number} odometerReading
     * @param {Object} booking
     */
    $scope.uploadOdometerValue = function (odometerReading, booking) {
      if (odometerReading < booking.car.travelled) {
        ToastService.error("Wrong odometer reading");
        return;
      }
      //calculate total distance and cost
      let [distance, cost] = $scope.calculateTripDetails(
        odometerReading,
        booking
      );
      let carCopy=structuredClone(booking.car);
      blobFactory.getImage(carCopy.image).then(
        (image)=>{
          carCopy.image=image;
          let updateBooking = {
            id: booking.id,
            paymentStatus: true,
            distanceTravelled: distance,
            car: {
              ...carCopy,
              travelled: (booking.car.travelled || 0) + distance
            },
            totalAmount: cost,
          };
          //update biddings table in db
          //update car total distance
          return IndexedDBService.updateRecord("biddings", updateBooking);
        }
      )
      .then((updatedBooking) => {
          console.log("updated car travelled in booking",updatedBooking);
          booking.paymentStatus = true;
          booking.distanceTravelled=updatedBooking.distanceTravelled;
          booking.totalAmount=updatedBooking.totalAmount;
          let car = {
            id: updatedBooking.car.id,
            travelled: (updatedBooking.car.travelled || 0),
          };
          return IndexedDBService.updateRecord("cars", car);
        })
        .then((car) => {
          ToastService.success("Thank You",3000);
        })
        .catch((e) => {
          console.log(e);
          ToastService.error(e,3000);
        });
    };

    /**
     * @description - this function will calculate travelled distance and cost and then return it in array
     * @param {Number} odometerReading
     * @param {Object} booking
     * @returns - array[travelled,cost]
     */
    $scope.calculateTripDetails = function (odometerReading, booking) {
      let travelled = odometerReading - Number(booking.car.travelled || 0);

      let days =
        (booking.car.endDate - booking.car.startDate) / (1000 * 60 * 60 * 24);
      let cost =
        travelled * Number(booking.car.pricePerKm) +
        Number(booking.car.basePrice) * days;
      return [travelled, cost];
    };

    /**
     * @description - this will show invoice modal
     * @param {Object} booking
     */
    $scope.openInvoice = function (booking) {
      console.log(booking);
      booking.showInvoice = true;
      console.log("open invoice", booking.showInvoice);
    };

    /**
     * @description - this will hide invoice modal
     * @param {Object} booking
     */
    $scope.closeInvoice = function (booking) {
      booking.showInvoice = false;
    };

  },
]);
