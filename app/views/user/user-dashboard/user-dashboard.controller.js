myApp.controller("UserController", [
  "$scope",
  "$timeout",
  "LocationFactory",
  "IndexedDBService",
  "ToastService",
  "$rootScope",
  "$q",
  function (
    $scope,
    $timeout,
    LocationFactory,
    IndexedDBService,
    ToastService,
    $rootScope,
    $q
  ) {
    $scope.cities = [
      "Delhi",
      "Mumbai",
      "Bengaluru",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Pune",
      "Ahmedabad",
      "Jaipur",
      "Chandigarh",
      "Lucknow",
      "Kochi",
      "Bhopal",
      "Indore",
      "Surat",
      "Agra",
      "Patna",
      "Vadodara",
      "Goa",
      "Shimla",
      "Rishikesh",
      "Manali",
      "Mussoorie",
      "Coimbatore",
      "Tiruchirappalli",
      "Jodhpur",
      "Udaipur",
      "Mysore",
      "Varanasi",
    ];

    $scope.selectedCity="";
    $scope.carsInSelectedCity = [];
    $scope.currentPageAll = 0;
    $scope.pageSize = 6;
    $scope.isNextPageAvailable = true;
    $scope.isPreviousPageAvailable = false;

    $scope.init = function () {
      $rootScope.isLoading = true;
      $q.all([
        $scope.getCars($scope.selectedCity, $scope.currentPageAll),
        $scope.getCurrentCity(),
      ])
        .then(([allCars, city]) => {
          $scope.cars = allCars;
          $scope.selectedCity = city;
          console.log($scope.cars, $scope.selectedCity);
          return $scope.getCarsInSelectedCity(
            $scope.selectedCity,
            $scope.currenPageForSelectedCity
          );
        })
        .then((carsInSelectedCity) => {
          console.log(carsInSelectedCity);
          $scope.carsInSelectedCity = carsInSelectedCity;
          $rootScope.isLoading = false;
        })
        .catch((error) => {
          console.log(error,1234);
          ToastService.showToast("error", error);
          $rootScope.isLoading = false;
        });
    };

    $scope.getCars = function (currentPage) {
      $scope.currentPageAll = currentPage;
        return IndexedDBService.getRecordsUsingPagination(
          "cars",
          4,
          currentPage * 4
        )
          .then((car) => {
            console.log(car);
            car.forEach((car) => {
              if (car.image instanceof Blob && car.image.size > 0) {
                car.image = URL.createObjectURL(car.image);
              } else {
                console.warn("car.image is not a Blob:", car.image);
              }
              const fuelData = getFuelPumpData(car.fuelType);
              car.fuelPump = fuelData.icon;
              car.fuelPumpStyle = fuelData.style;
            });
            return Promise.resolve(car);
          })
          .catch((e) => {
            console.log(e);
            return Promise.reject(e);
          });
     
    };
    /**
     * @description Get cars according to selected city
     * @param {*} city 
     * @param {*} currentPage 
     * @returns 
     */
    $scope.getCarsInSelectedCity = function (city, currentPage) {
        return IndexedDBService.getRecordsUsingPaginationWithIndex(
          "cars",
          "city",
          city,
          $scope.pageSize,
          currentPage * $scope.pageSize
        )
          .then(function (cars) {
            $scope.isPreviousPageAvailable = currentPage > 0;
            $scope.isNextPageAvailable = cars.length == 6;
            cars.forEach((car) => {
              if (car.image instanceof Blob && car.image.size > 0) {
                car.image = URL.createObjectURL(car.image);
              }
              const fuelData = getFuelPumpData(car.fuelType);
              car.fuelPump = fuelData.icon;
              car.fuelPumpStyle = fuelData.style;
            });
            return Promise.resolve(cars);
          })
          .catch((e) => {
            return Promise.reject(e);
          });

     
    };

    $scope.getCurrentCity = function () {
        return LocationFactory.getCityUsingGeolocation()
        .then((current) => {
          if (!$scope.cities.includes(current)) {
            return Promise.reject("Service not availabe");
          }
          return Promise.resolve(current);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
      
    };

    $scope.getNextSetOfCars = function (currentPage) {
      $scope.currentPageAll=Number(currentPage);
      console.log($scope.currentPageAll);
      $scope
        .getCarsInSelectedCity($scope.selectedCity,currentPage)
        .then((car) => {
          console.log(car);
          $scope.isPreviousPageAvailable = currentPage > 0;
          $scope.isNextPageAvailable = car.length == 6;
          $scope.carsInSelectedCity = car;
        })
        .catch((e) => {
          ToastService.showToast("Unable to fetch cars",e);
        });
    };

    $scope.filterCarUsingSelectedCity = function () {
      $scope.currentPageAll=0;
      $scope
        .getCarsInSelectedCity(
          $scope.selectedCity,
          $scope.currentPageAll
        )
        .then((cars) => {
          console.log(cars);
          $scope.carsInSelectedCity = cars;
        })
        .catch((e) => {
          ToastService.showToast(e.message);
        });
    };

    function getFuelPumpData(fuelType) {
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
