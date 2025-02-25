myApp.controller("carController", [
  "$stateParams",
  "IndexedDBService",
  "$timeout",
  "$scope",
  "$rootScope",
  "ToastService",
  "biddingService",
  "$q",
  function (
    $stateParams,
    IndexedDBService,
    $timeout,
    $scope,
    $rootScope,
    ToastService,
    biddingService,
    $q
  ) {

    $scope.car = {};
    $scope.isUnavailable = false;
    $scope.today = new Date().toISOString().split("T")[0];

    $scope.init = function(){
      $rootScope.isLoading=true;
      getCarById().then(
        (car)=>{
          $scope.car=car;
        }
      ).catch((e)=>{
        console.log(e);
      })
      .finally(()=>{
        $rootScope.isLoading=false;
      })
    }

    function getCarById() {
        let deferred=$q.defer();
        let carId = parseInt($stateParams.id);
        IndexedDBService.getRecord("cars", carId).then(
          (car)=>{
            if(car.image instanceof Blob && car.image.size>0)
              car.image=URL.createObjectURL(car.image);
            deferred.resolve(car);
          }
        ).catch(
          (e)=>{
            console.log(e.message);
            deferred.reject(car);
          }
        );
        return deferred.promise;
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

    
   $scope.checkAvailability=async function() {
    try{
      const start = new Date($scope.car.startDate);
      const end = new Date($scope.car.endDate);
      if ($scope.car.approved) {
        for (const dateRange of $scope.car.approved) {
          let minDate = dateRange.min - date;
          let maxDate = dateRange.max - date;
          if (
            (start >= minDate && start <= maxDate) ||
            (end >= minDate && end <= maxDate) ||
            (start <= minDate && end >= maxDate)
          ) {
            console.log("booking is not available");
            // $timeout(() => {
            //   $scope.isUnavailable = true;
            //   $scope.$apply();
            //   $timeout(() => {
            //     $scope.isUnavailable = false;
            //   }, 2000);
            // });
            throw new Error("booking is not available");
          } else {
            console.log("booking is available");
          }
        }
      } else {
        console.log("booking is available");
      }
      user=JSON.parse(sessionStorage.getItem('loginData'));
      const owner=$scope.car.user;
      const biddingObject=biddingService.createBiddingObject($scope.car,user,owner);
      // const user=

      await IndexedDBService.addRecord("biddings",biddingObject);
      ToastService.showToast('success',"bid successfully added");
      
    }
    catch(e){
      ToastService.showToast('error',e.message);
    }
    }
    
    $scope.init();

  },
]);
