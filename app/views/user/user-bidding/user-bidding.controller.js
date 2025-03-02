myApp.controller("userBiddingController", [
  "$scope",
  "IndexedDBService",
  "$rootScope",
  "$q",
  function ($scope, IndexedDBService, $rootScope, $q) {
    $scope.biddings = [];

    $scope.sortBid = {
      basePrice: "Base Price",
      pricePerKm: "Price per Km",
    };
    $scope.filterBid = {
      pending: "pending",
      rejected: "rejected",
    };
    $scope.selectedSort = "timestamp"; // Default sorting by timestamp
    $scope.selectedFilter = "pending";
    $scope.init = function () {
      $rootScope.isLoading = true;
      $scope
        .getUserBiddings()
        .then((allBiddings) => {
          $scope.biddings = allBiddings;
          console.log($scope.biddings);
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          $rootScope.isLoading = false;
        });
    };

    $scope.getUserBiddings = function () {
      let deferred = $q.defer();
      const userEmail = JSON.parse(sessionStorage.getItem("loginData")).email;
      IndexedDBService.getRecordsUsingIndex("biddings", "user_id", userEmail)
        .then((allBiddings) => {
          const filteredBiddings = allBiddings
            .filter((bid) => bid.status === "pending") // Filter bids where isAccepted is false
            .map((bid) => {
              if (bid.car.image instanceof Blob) {
                bid.car.image = URL.createObjectURL(bid.car.image);
              }
              return bid;
            });
          deferred.resolve(allBiddings);
        })
        .catch((e) => {
          deferred.reject(e);
          console.log(e.message);
        });
      return deferred.promise;
    };

    $scope.init();
  },
]);
