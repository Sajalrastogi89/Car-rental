myApp.controller("UserController", [
  "$scope",
  "LocationFactory",
  "IndexedDBService",
  "ToastService",
  "$rootScope",
  "$q",
  function (
    $scope,
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


    
    $scope.selectedCity = "";  // declaration and initialization for selected city
    $scope.sortValue="basePrice"; // default value for sorting fetched data using orderBy: basePrice
    $scope.carsInSelectedCity = []; // declaration and initialization of cars in selected city
    $scope.currentPageAll = 0; // Used in pagination and represents start page number
    $scope.pageSize = 6; // Numbers of cars in each page
    $scope.isNextPageAvailable = true; // default value for next page availability
    $scope.isPreviousPageAvailable = false; // default value for previous page unavailability



    /**
     * @description fetch current city and then fetch cars in that city using async.waterfall
     * 
     */
    $scope.init = function () {
      $rootScope.isLoading = true;

      async.waterfall(
        [
          function (callback) {
            $scope
              .getCurrentCity()
              .then((city) => {
                $scope.selectedCity = city;
                callback(null, city);
              })
              .catch((error) => callback(error));
          },
          function (city, callback) {
            $scope
              .getCarsInSelectedCity(city, $scope.currentPageAll)
              .then((cars) => {
                callback(null, cars);
              })
              .catch((error) => callback(error));
          },
        ],
        function (err, result) {
          if (err) {
            $rootScope.isLoading = false;
            ToastService.showToast("error", err);
          } else {
            $scope.carsInSelectedCity = result;
            $rootScope.isLoading = false;
          }
        }
      );
    };



    /**
     * @description Get cars according to selected city
     * @param {String} city - current city by location or selected city
     * @param {Number} currentPage - for pagination
     * @returns {Promise} - returns a promise that resolves to the list of cars
     */
    $scope.getCarsInSelectedCity = function (city, currentPage) {
      const deferred = $q.defer();
      IndexedDBService.getRecordsUsingPaginationWithIndex(
        "cars",
        "city",
        city,
        $scope.pageSize,
        currentPage * $scope.pageSize
      )
        .then(function (cars) {
          // for pagination
          $scope.isPreviousPageAvailable = currentPage > 0;
          $scope.isNextPageAvailable = cars.length == 6;

          // convert each blob to temporary url
          cars.forEach((car) => {
            if (car.image instanceof Blob && car.image.size > 0) {
              car.image = URL.createObjectURL(car.image);
            }

            // assign pump image and style on the basis of fuel type
            const fuelData = getFuelPumpData(car.fuelType);
            car.fuelPump = fuelData.icon;
            car.fuelPumpStyle = fuelData.style;
          });
          deferred.resolve(cars);
        })
        .catch((e) => {
          deferred.reject(e);
        });
      return deferred.promise;
    };



    /**
     * @description This function is using location factory to get current city
     * @returns {Promise} - returns a promise that resolves to the current city
     */
    $scope.getCurrentCity = function () {
      const deferred = $q.defer();
      LocationFactory.getCityUsingGeolocation()
        .then((current) => {
          if (!$scope.cities.includes(current)) {
            return deferred.reject("Service not available");
          }
          return deferred.resolve(current);
        })
        .catch((error) => {
          return deferred.reject(error);
        });
      return deferred.promise;
    };



    /**
     * @description - This function is used in pagination for fetching cars in selected city in pages
     * @param {Number} currentPage - This number helps in skipping records using advance operation
     */
    $scope.getNextSetOfCars = function (currentPage) {
      $scope.currentPageAll = Number(currentPage);
      $scope
        .getCarsInSelectedCity($scope.selectedCity, currentPage)
        .then((car) => {
          $scope.isPreviousPageAvailable = currentPage > 0;
          $scope.isNextPageAvailable = car.length == 6;
          $scope.carsInSelectedCity = car;
        })
        .catch((e) => {
          ToastService.showToast("Unable to fetch cars", e);
        });
    };



    /**
     * @description Filters cars based on the selected city
     */
    $scope.filterCarUsingSelectedCity = function () {
      $scope.currentPageAll = 0;
      $scope
        .getCarsInSelectedCity($scope.selectedCity, $scope.currentPageAll)
        .then((cars) => {
          $scope.carsInSelectedCity = cars;
        })
        .catch((e) => {
          ToastService.showToast(e.message);
        });
    };



    /**
     * @description Returns fuel pump data based on fuel type
     * @param {String} fuelType - Type of fuel
     * @returns {Object} - Object containing icon and style for the fuel pump
     */
    function getFuelPumpData(fuelType) {
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
