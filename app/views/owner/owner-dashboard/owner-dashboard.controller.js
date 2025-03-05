myApp.controller("OwnerDashboardController", [
  "$scope",
  "$q",
  'DashboardService',
  'ToastService',
  function ($scope,$q,DashboardService,ToastService) {
    $scope.cars = {}; // declaration and initialization of cars
    $scope.currentPageAll = 0; // current page number for pagination
    $scope.pageSize=8; // number of cars fetched in each page
    $scope.isNextPageAvailable = true; // status for next page
    $scope.isPreviousPageAvailable = false; // status for previous page

/**
 * @description - runs when page will be loaded
 */
    $scope.init = function(){
      $scope.isLoading = true;
      getCars($scope.currentPageAll).then(
        (allCars)=>{
          $scope.cars=allCars;
        }
      ).catch((e)=>{
        ToastService.error(e,3000);
      }
      ).finally(()=>{
        $scope.isLoading = false;
      })
    }

    /**
     * @description - this will fetch owner cars according to current page and page size
     * @param {Number} currentPage 
     */
    getCars=function(currentPage) {
      let deferred=$q.defer();
      const owner_id = JSON.parse(sessionStorage.getItem("loginData")).email;
      DashboardService.getCarsData("cars","owner_id",owner_id,$scope.pageSize,currentPage).then((allCars)=>{
        deferred.resolve(allCars);
      }).catch((e)=>{
        deferred.reject(e);
      })
      return deferred.promise;
    }


    /**
     * @description - this will fetch next or previous set of cars on the basis of
     * page number
     */
    $scope.getNextSetOfCars = function (currentPage) {
      $scope.isLoading=true;
      $scope.currentPageAll = currentPage;
      getCars(currentPage)
        .then((car) => {
          $scope.isPreviousPageAvailable = currentPage > 0;
          $scope.isNextPageAvailable = car.length == 8;
          $scope.cars = car;
        })
        .catch(() => {
          ToastService.error("Unable to fetch cars", 3000);
        })
        .finally(()=>{
          $scope.isLoading=false;
        })
    };

  },
]);
