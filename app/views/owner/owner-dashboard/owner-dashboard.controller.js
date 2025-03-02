myApp.controller("OwnerDashboardController", [
  "$scope",
  "$timeout",
  "$rootScope",
  "IndexedDBService",
  function ($scope, $timeout, $rootScope,IndexedDBService) {
    $scope.cars = {};

    $scope.init = function(){
      $rootScope.isLoading = true;
      $scope.getCars().then(
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

    $scope.getCars=function() {
      const owner_id = JSON.parse(sessionStorage.getItem("loginData")).email;
      console.log(owner_id,12);
      return IndexedDBService.getRecordsUsingIndex("cars", "owner_id", owner_id)
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
          return Promise.resolve(allCars);
        })
        .catch((e) => {
          console.log(15);
          return Promise.reject(e.message);
        });
    }



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
