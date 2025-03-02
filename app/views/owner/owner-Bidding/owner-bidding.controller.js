myApp.controller("ownerBiddingController", [
  "$scope",
  "IndexedDBService",
  "$rootScope",
  "$q",
  "BiddingService",
  function ($scope, IndexedDBService, $rootScope, $q, BiddingService) {
    $scope.biddings = [];
    $scope.selectedSort = "car.name";
    $scope.init = function () {
      $rootScope.isLoading = true;
      $scope
        .getAllBidding()
        .then((allOwnerBiddings) => {
          $scope.biddings = allOwnerBiddings;
          console.log($scope.biddings, allOwnerBiddings);
          $rootScope.isLoading = false;
        })
        .catch(() => {
          $rootScope.isLoading = false;
        });
    };

    $scope.getAllBidding = function () {
      let deferred = $q.defer();
      const owner_id = JSON.parse(sessionStorage.getItem("loginData")).email;
      IndexedDBService.getRecordsUsingIndex("biddings", "owner_id", owner_id)
        .then((allOwnerBiddings) => {
          allOwnerBiddings
            .filter((bid) => {
              return bid.status === "pending";
            })
            .map((bid) => {
              if (bid.car.image instanceof Blob) {
                bid.car.image = URL.createObjectURL(bid.car.image);
              }
              return bid;
            });
          deferred.resolve(allOwnerBiddings);
        })
        .catch((e) => {
          deferred.reject(e);
        });
      return deferred.promise;
    };

    $scope.acceptBid = function (bid) {
      let deferred = $q.defer();
      let updatedBid = {
        id: bid.id,
        status: "accepted",
      };
      IndexedDBService.updateRecord("biddings", updatedBid)
        .then(() => {
          bid.status = "accepted";
          let updateCarApprovedFeild = {
            id: bid.car.id,
            approved: [
              ...(bid.car.approved || []),
              { startDate: bid.car.startDate, endDate: bid.car.endDate },
            ],
          };
          BiddingService.updateCarApproved(updateCarApprovedFeild);
          return BiddingService.rejectOverlappingBids(
            bid.car.id,
            bid.car.startDate,
            bid.car.endDate
          );
        })
        .then((allRejectedBids)=>{
          console.log(allRejectedBids,123);
            $scope.updateBiddingStatusInView(allRejectedBids);
            deferred.resolve();
        })
        .catch((e) => {
          console.log("Error updating status", e);
          deferred.reject();
        });
      return deferred.promise;
    };

    $scope.rejectBid = function (bid) {
      let deferred = $q.defer();
      let updatedBid = {
        id: bid.id,
        status: "rejected",
      };
      IndexedDBService.updateRecord("biddings", updatedBid)
        .then(() => {
          (bid.status = "rejected"), deferred.resolve();
        })
        .catch((e) => {
          console.log("Error updating status", e);
          deferred.reject();
        });
    };


    $scope.updateBiddingStatusInView = function (rejectedBids) {
      rejectedBids.forEach(rejectedBid => {
          let bid = $scope.biddings.find(b => b.id === rejectedBid.id);
          if (bid) {
              bid.status = "rejected";
          }
      });
  };
  

    $scope.init();
  },
]);
