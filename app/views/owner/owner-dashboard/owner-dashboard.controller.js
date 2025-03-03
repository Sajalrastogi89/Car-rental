myApp.controller("OwnerDashboardController", [
  "$scope",
  "$timeout",
  "$rootScope",
  "IndexedDBService",
  "$q",
  function ($scope, $timeout, $rootScope,IndexedDBService,$q) {
    $scope.cars = {};
    $scope.currentPageAll = 0;
    $scope.pageSize = 6;
    $scope.isNextPageAvailable = true;
    $scope.isPreviousPageAvailable = false;


    $scope.init = function(){
      $rootScope.isLoading = true;
      $scope.getCars($scope.currentPageAll).then(
        (allCars)=>{
          $scope.cars=allCars;
          console.log(allCars,12);
        }
      ).catch((e)=>{
        console.log(e.message);
      }
      ).finally(()=>{
        $rootScope.isLoading = false;
      })
    }

    $scope.getCars=function(currentPage) {
      const deferred=$q.defer();
      const owner_id = JSON.parse(sessionStorage.getItem("loginData")).email;
      console.log(owner_id,12);
      IndexedDBService.getRecordsUsingPaginationWithIndex("cars", "owner_id", owner_id,$scope.pageSize,
        currentPage * $scope.pageSize)
        .then((allCars) => {
          console.log(allCars,14);
          allCars.forEach((car) => {
            if (car.image instanceof Blob && car.image.size > 0) {
              car.image = URL.createObjectURL(car.image);
            } else {
              console.warn("car.image is not a Blob:", car.image);
            }
            const fuelData = $scope.getFuelPumpData(car.fuelType);
            car.fuelPump = fuelData.icon;
            car.fuelPumpStyle = fuelData.style;
          });
          console.log(20);
          deferred.resolve(allCars);
        })
        .catch((e) => {
          console.log(15);
          deferred.reject(e.message);
        });
        return deferred.promise;
    }

    $scope.getNextSetOfCars = function (currentPage) {
      $scope.currentPageAll = Number(currentPage);
      console.log("page");
      $scope
        .getCars(currentPage)
        .then((car) => {
          $scope.isPreviousPageAvailable = currentPage > 0;
          $scope.isNextPageAvailable = car.length == 6;
          $scope.cars = car;
          console.log("page 1");
        })
        .catch((e) => {
          ToastService.showToast("Unable to fetch cars", e);
        });
    };


    $scope.getFuelPumpData=function(fuelType) {
      console.log(fuelType, fuelType === "Electric");
      return fuelType == "Electric"
        ? {
            icon: "assets/img/electric.png",
            style: { width: "66%", opacity: 0.9 },
          }
        : { icon: "assets/img/fuel.png", style: {} };
    }


    $scope.init();

  },
]);
