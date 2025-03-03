myApp.controller("OwnerDashboardController", [
  "$scope",
  "$rootScope",
  "IndexedDBService",
  "$q",
  'DashboardService',
  function ($scope, $rootScope,IndexedDBService,$q,DashboardService) {
    $scope.cars = {}; // declaration and initialization of cars
    $scope.currentPageAll = 0; // current page number for pagination
    $scope.pageSize = 6; // number of cars fetched in each page
    $scope.isNextPageAvailable = true; // status for next page
    $scope.isPreviousPageAvailable = false; // status for previous page

/**
 * @description - runs when page will be loaded
 */
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

    /**
     * @description - this will fetch owner cars according to current page and page size
     * @param {Number} currentPage 
     */
    $scope.getCars=function(currentPage) {
      const owner_id = JSON.parse(sessionStorage.getItem("loginData")).email;
      return DashboardService.getCarsData("cars","owner_id",owner_id,$scope.pageSize,currentPage)
    }


    /**
     * @description - this will fetch next or previous set of cars on the basis of
     * page number
     */
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

    $scope.init();

  },
]);
