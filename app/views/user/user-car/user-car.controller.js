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
    $scope.car = {}; // declaration for single car
    $scope.today = new Date().toISOString().split("T")[0]; // fetches todays date


    /**
     * @description - this will run when page is loaded and fetch car details using car id
     */
    $scope.init = function () {
      $rootScope.isLoading = true;
      getCarById()
        .then((car) => {
          $scope.car = car;
        })
        .catch((e) => {
          ToastService.showToast("error",e);
          console.log(e);
        })
        .finally(() => {
          $rootScope.isLoading = false;
        });
    };


    /**
     * @description - fetch car data using car_id and convert blob to temporary image url
     */
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

     /**
     * @description - this will check dates that end date must be greater that start date
     */
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


    /**
     * @description - check availability of car from approved array present in car object
     * if date is available then clone of car object will be created and image url 
     * is converted into blob and then biddingCar object will be stored inside database and user will be
     * redirected to biddings page
     */
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


    /**
     * @description - this will create a new chat with car owner and 'Hi' will be send to owner
     * @param {Integer} owner_id
     * @param {Object} car 
     */
    $scope.chat = function (ownerName,owner_id, car) {
      const user = JSON.parse(sessionStorage.getItem("loginData"));
      const user_id=user.email;
      const userName=user.firstName;
      chatService
        .addChat(userName,ownerName,owner_id, user_id, car)
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
