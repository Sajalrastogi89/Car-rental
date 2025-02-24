myApp.controller("carController", [
  "$stateParams",
  "IndexedDBService",
  "$timeout",
  "$scope",
  "$rootScope",
  "ToastService",
  "biddingService",
  function (
    $stateParams,
    IndexedDBService,
    $timeout,
    $scope,
    $rootScope,
    ToastService,
    biddingService
  ) {
    $scope.today = new Date().toISOString().split("T")[0];

    $scope.car = {};

    async function getCarById() {
      try {
        $timeout(() => {
          $rootScope.isLoading = true;
        });
        console.log($stateParams.id);
        let carId = parseInt($stateParams.id);
        const carData = await IndexedDBService.getRecord("cars", carId);
        carData.image = URL.createObjectURL(carData.image);
        console.log(carData);
        $timeout(() => {
          $scope.car = carData;
        });

        console.log($stateParams.id);
      } catch (e) {
        console.log(e.message);
      } finally {
        $timeout(() => {
          $rootScope.isLoading = false;
        });
      }
    }
    getCarById();

    $scope.checkDates = function () {
      if ($scope.car.startDate) {
        // Set min date for endDate
        if ($scope.car.endDate && $scope.car.endDate < $scope.car.startDate) {
          $scope.car.endDate = ""; // Reset endDate if it's before startDate
          ToastService.showToast(
            "error",
            "End date must be greater than Start Date"
          );
        }
        $timeout(function () {
          $scope.minEndDate = $scope.car.startDate;
          // ToastService.showToast('error','End date must be greater than Start Date');
        });
      }
      // $app
    };

    $scope.isUnavailable = false;
    console.log(1);
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
  },
]);
