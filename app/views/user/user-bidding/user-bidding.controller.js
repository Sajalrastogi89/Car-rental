myApp.controller("userBiddingController", [
  "$scope",
  "IndexedDBService",
  "$q",
  function ($scope, IndexedDBService, $q) {
    $scope.biddings = []; // declaration and initialization of biddings

    // hardcoded options for dropdown
    $scope.sortBid = {
      basePrice: "Base Price",
      pricePerKm: "Price per Km",
    };

    // hardcoded options for dropdown
    $scope.filterBid = {
      pending: "pending",
      rejected: "rejected",
    };
    $scope.selectedSort = "timestamp"; // Default sorting by timestamp
    $scope.selectedFilter = "pending"; // Default filting by pending


    /**
     * @description - executes when page will be loaded
     * and fetch all the biddings
     */

    $scope.init = function () {
      $scope.isLoading = true;
      $scope
        .getUserBiddings()
        .then((allBiddings) => {
          $scope.biddings = allBiddings;
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          $scope.isLoading = false;
        });
    };

    /**
     * @description - fetch all the bids from db and filter bids that are not accepted
     * and map blob to image url and then resolve the bids
     * @returns {promise}
     */
    $scope.getUserBiddings = function () {
      let deferred = $q.defer();
      const userEmail = JSON.parse(sessionStorage.getItem("loginData")).email;
      IndexedDBService.getRecordsUsingIndex("biddings", "user_id", userEmail)
        .then((allBiddings) => {
          const filteredBiddings = allBiddings
            .filter((bid) => bid.status !== "accepted") // Filter bids where isAccepted is false
            .map((bid) => {
              if (bid.car.image instanceof Blob) {
                bid.car.image = URL.createObjectURL(bid.car.image);
              }
              return bid;
            });
          deferred.resolve(filteredBiddings);
        })
        .catch((e) => {
          deferred.reject(e);
        });
      return deferred.promise;
    };

    
  },
]);
