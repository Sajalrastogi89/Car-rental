myApp.controller("carController", [
  "$stateParams",
  "$state",
  "IndexedDBService",
  "$scope",
  "$rootScope",
  "ToastService",
  "blobFactory",
  "chatService",
  function (
    $stateParams,
    $state,
    IndexedDBService,
    $scope,
    $rootScope,
    ToastService,
    blobFactory,
    chatService
  ) {
    $scope.car = {};
    $scope.isUnavailable = false;
    $scope.today = new Date().toISOString().split("T")[0];

    $scope.init = function () {
      $rootScope.isLoading = true;
      getCarById()
        .then((car) => {
          $scope.car = car;
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          $rootScope.isLoading = false;
        });
    };

    function getCarById() {
      let carId = parseInt($stateParams.id);
      return IndexedDBService.getRecord("cars", carId)
        .then((car) => {
          if (car.image instanceof Blob && car.image.size > 0)
            car.image = URL.createObjectURL(car.image);
          return car;
        })
        .catch((e) => {
          ToastService.showToast("error", e);
        });
    }

    $scope.checkDates = function () {
      if ($scope.car.startDate) {
        if ($scope.car.endDate && $scope.car.endDate < $scope.car.startDate) {
          $scope.car.endDate = "";
          ToastService.showToast(
            "error",
            "End date must be greater than Start Date"
          );
        }
        $scope.minEndDate = $scope.car.startDate;
      }
    };

    $scope.checkAvailability = function () {
      const start = new Date($scope.car.startDate);
      const end = new Date($scope.car.endDate);
      if ($scope.car.approved) {
        for (const dateRange of $scope.car.approved) {
          let minDate = dateRange.startDate;
          let maxDate = dateRange.endDate;
          if (start < maxDate && end > minDate) {
            ToastService.showToast("error", "booking is not available");
            return;
          }
        }
      }
      const user = JSON.parse(sessionStorage.getItem("loginData"));
      const biddingCar = structuredClone($scope.car);
      return blobFactory
        .getImage(biddingCar.image)
        .then((imageBlob) => {
          console.log(121);
          biddingCar.image = imageBlob;
          const biddingObject = {
            car: biddingCar,
            user: user,
            timestamp: Date.now(),
            status: "pending",
          };
          return IndexedDBService.addRecord("biddings", biddingObject);
        })
        .then(() => {
          ToastService.showToast("success", "bid successfully added");
          $state.go("userBiddings");
        })
        .catch(() => {
          ToastService.showToast("error", e);
        });
    };

    $scope.chat = function (owner_id, car) {
      const user_id = JSON.parse(sessionStorage.getItem("loginData")).email;
      chatService
        .addChat(owner_id, user_id, car)
        .then(() => {
          $state.go("userChat");
        })
        .catch((e) => {
          ToastService.showToast("error", e);
        });
    };

    $scope.init();
  },
]);
