myApp
.controller('UserController',['$scope','$timeout','LocationFactory','IndexedDBService','ToastService','$rootScope','$q',function($scope,$timeout,LocationFactory,IndexedDBService,ToastService,$rootScope,$q){
 


  $scope.cities=[
    "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", 
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kochi", 
    "Bhopal", "Indore", "Surat", "Agra", "Patna", "Vadodara", "Goa", 
    "Shimla", "Rishikesh", "Manali", "Mussoorie", "Coimbatore", "Tiruchirappalli",
    "Jodhpur", "Udaipur", "Mysore", "Varanasi"
  ];

  $scope.cars=[];
  $scope.carsInSelectedCity=[];
  $scope.currentPageAll = 0;
  $scope.currenPageForSelectedCity = 0;
  $scope.pageSize = 4; 
  $scope.isNextPageAvailable=true;
  $scope.isPreviousPageAvailable=false;

$scope.init=function(){
  $rootScope.isLoading=true;
  $q.all([$scope.getCars($scope.selectedCity,$scope.currentPageAll),$scope.getCurrentCity()])
  .then(([allCars,city])=>{
    $scope.cars=allCars;
    $scope.selectedCity=city;
    console.log($scope.cars,$scope.selectedCity);
    return $scope.getCarsInSelectedCity($scope.selectedCity,$scope.currenPageForSelectedCity);
  })
  .then((carsInSelectedCity)=>{
    console.log(carsInSelectedCity);
    $scope.carsInSelectedCity=carsInSelectedCity;
    $rootScope.isLoading=false;
  })
  .catch(error=>{
    ToastService.showToast('error',error.message);
    $rootScope.isLoading=false;
  });
 }

 


$scope.getCars=function(currentPage) {
  $scope.currentPageAll=currentPage;
  console.log(currentPage);
    let deferred=$q.defer();
    IndexedDBService.getRecordsUsingPagination("cars",4,currentPage*4)
    .then((car)=>{
      console.log(car);
      car.forEach(car => {
        if (car.image instanceof Blob && car.image.size>0) {
            car.image = URL.createObjectURL(car.image);
          } else {
          console.warn("car.image is not a Blob:", car.image);
        }
        const fuelData = getFuelPumpData(car.fuelType);
    car.fuelPump = fuelData.icon;
    car.fuelPumpStyle = fuelData.style;
      });
      deferred.resolve(car);
    })
    .catch((e)=>{
      deferred.reject(e);
    })
    return deferred.promise;
}



$scope.getCarsInSelectedCity = function(city,currentPage){
  let deferred = $q.defer();
  IndexedDBService.getRecordsUsingPaginationWithIndex("cars","city",city,4,currentPage*4).then(
    function(cars){
      cars.forEach((car)=>{
        if(car.image instanceof Blob && car.image.size>0){
          car.image=URL.createObjectURL(car.image);
        }
        else{
          console.warn("car.image is not a blob");
        }
        const fuelData = getFuelPumpData(car.fuelType);
        car.fuelPump = fuelData.icon;
        car.fuelPumpStyle = fuelData.style;
      })
      deferred.resolve(cars);
    }
  ).catch(
    (e)=>{
      deferred.reject(e);
    }
  )
  return deferred.promise;
}



 $scope.getCurrentCity=function(){
    let deferred=$q.defer();
 
      LocationFactory.getCityUsingGeolocation()
      .then(current=>{
        if(!$scope.cities.includes(current)){
          deferred.reject('Service not availabe');
        }
        deferred.resolve(current);
      })
      .catch(error=>{
        deferred.reject(error.message);
      })
      return deferred.promise;

  }
  

  
$scope.getNextSetOfCars = function(currentPage){
  $scope.getCars(currentPage).then(
    (car)=>{
      $scope.isPreviousPageAvailable=currentPage!=0;
      $scope.isNextPageAvailable=car.length==4;
      $scope.cars=car;
    }
  ).catch((e)=>{
    console.log(e.message);
  })
}


$scope.filterCarUsingSelectedCity = function(){
  $scope.getCarsInSelectedCity($scope.selectedCity,$scope.currenPageForSelectedCity).then(
    (cars)=>{
      console.log(cars);
      $scope.carsInSelectedCity=cars;
    }
  ).catch((e)=>{
    console.log(e.message);
  })
}


function getFuelPumpData(fuelType) {
  console.log(fuelType,fuelType==='Electric')
  return fuelType == 'Electric'
      ? { icon: 'assets/img/electric.png', style: { width: '66%', opacity: 0.9 } }
      : { icon: 'assets/img/fuel.png', style: {} };
}



$scope.init();

}]);