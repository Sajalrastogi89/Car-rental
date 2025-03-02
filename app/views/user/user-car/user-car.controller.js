myApp.controller("carController", [
  "$stateParams",
  "$state",
  "IndexedDBService",
  "$timeout",
  "$scope",
  "$rootScope",
  "ToastService",
  "$q",
  "blobFactory",
  "chatService",
  function (
    $stateParams,
    $state,
    IndexedDBService,
    $timeout,
    $scope,
    $rootScope,
    ToastService,
    $q,
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
          console.log(e.message);
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
          if (
            start < maxDate && end > minDate
          ) {
            console.log("booking is not available");
            return;
          }
        }
      }
      const user = JSON.parse(sessionStorage.getItem("loginData"));
      const biddingCar=structuredClone($scope.car);
      return blobFactory
        .getImage(biddingCar.image)
        .then((imageBlob) => {
          console.log(121);
          biddingCar.image = imageBlob;
          const biddingObject = {
            car: biddingCar,
            user: user,
            timestamp: Date.now(),
            status: 'pending'
          };
          return IndexedDBService.addRecord("biddings", biddingObject);
        })
        .then(() => {
          ToastService.showToast("success", "bid successfully added");
          $state.go("userBiddings");
          console.log(1234);
        })
        .catch(() => {
          console.log("error adding bid");
        });
    };

    $scope.chat = function(owner_id,car){
      const user_id=JSON.parse(sessionStorage.getItem('loginData')).email;
      console.log(owner_id,user_id);
      chatService.addChat(owner_id,user_id,car).then(()=>{
          console.log("chat added");
      }).catch((e)=>{
          console.log("user-car chat",e);
      });
    }

    $scope.init();
  },
]);
