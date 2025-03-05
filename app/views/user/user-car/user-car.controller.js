myApp.controller("carController", [
  "$stateParams",
  "$state",
  "IndexedDBService",
  "$scope",
  "ToastService",
  "blobFactory",
  "chatService",
  "$q",
  function (
    $stateParams,
    $state,
    IndexedDBService,
    $scope,
    ToastService,
    blobFactory,
    chatService,
    $q
  ) {
    $scope.car = {}; // declaration for single car
    $scope.today = new Date().toISOString().split("T")[0]; // fetches todays date


    /**
     * @description - this will run when page is loaded and fetch car details using car id
     */
    $scope.init = function () {
      $scope.isLoading = true;
      getCarById()
        .then((car) => {
          $scope.car = car;
        })
        .catch((e) => {
          ToastService.error(e,3000);
          console.log(e);
        })
        .finally(() => {
          $scope.isLoading = false;
        });
    };


    /**
     * @description - fetch car data using car_id and convert blob to temporary image url
     */
    function getCarById() {
      let deferred=$q.defer();
      let carId = parseInt($stateParams.id);
      IndexedDBService.getRecord("cars", carId)
        .then((car) => {
          if (car.image instanceof Blob && car.image.size > 0)
            car.image = URL.createObjectURL(car.image);
          deferred.resolve(car);
        })
        .catch((e) => {
          deferred.reject(e);
        });
        return deferred.promise;
    }

     /**
     * @description - this will check dates that end date must be greater than start date
     */
    $scope.checkDates = function () {
      if ($scope.car.startDate) {
        if ($scope.car.endDate && $scope.car.endDate < $scope.car.startDate) {
          $scope.car.endDate = "";
          ToastService.error(
            "End date must be greater than Start Date",3000
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
      $scope.isLoading=true;
      const start = new Date($scope.car.startDate);
      const end = new Date($scope.car.endDate);

      IndexedDBService.getRecord("cars",$scope.car.id)
      .then((car)=>{
        if (car.approved) {
          for (const dateRange of car.approved) {
            let minDate = dateRange.startDate;
            let maxDate = dateRange.endDate;
            if (start <= maxDate && end >= minDate) {
             throw new Error("Dates not available");
            }
          }
        }
        return blobFactory
        .getImage($scope.car.image)
      })
      .then((imageBlob) => {
        const user = JSON.parse(sessionStorage.getItem("loginData"));
        const biddingCar = structuredClone($scope.car);
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
        ToastService.success("bid successfully added",3000);
        $state.go("userBiddings");
      })
      .catch((e) => {
        ToastService.error(e.message,3000);
      })
      .finally(()=>{
        $scope.isLoading=false;
      })       
      
    };


    /**
     * @description - this will create a new chat with car owner and 'Hi' will be send to owner
     * @param {Integer} owner_id
     * @param {Object} car 
     */
    $scope.chat = function (ownerName,owner_id, car) {
      $scope.isLoading=true;
      const user = JSON.parse(sessionStorage.getItem("loginData"));
      const user_id=user.email;
      const userName=user.firstName;
      chatService
        .addChat(userName,ownerName,owner_id, user_id, car)
        .then(() => {
          $state.go("userChat");
        })
        .catch((e) => {
          ToastService.error(e,3000);
        })
        .finally(()=>{
          $scope.isLoading=false;
        })
    };

    
  },
]);
