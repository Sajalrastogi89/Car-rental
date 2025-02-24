myApp.
controller('OwnerDashboardController',['OwnerDashboardService','$scope','$timeout','$rootScope',function(OwnerDashboardService,$scope,$timeout,$rootScope){
  $scope.car={};
 async function getCars(){
  try{
    $timeout(()=>{
      $rootScope.isLoading=true;
    })
    // console.log(1);
    // let owner=sessionStorage.getItem("loginData");
    // console.log(owner);
    const owner_id=JSON.parse(sessionStorage.getItem('loginData')).email;
    const allCars=await OwnerDashboardService.getAllOwnerCars(owner_id);
    console.log(allCars);
    allCars.forEach(car => {
      if (car.image instanceof Blob) {
    
        if (car.image.size > 0) {
          car.image = URL.createObjectURL(car.image);
        } else {
          console.error("Blob is empty! Cannot create URL.");
        }
      } else {
        console.warn("car.image is not a Blob:", car.image);
      }
    });

    // for(let car of allCars){
    //   car.image=URL.createObjectURL(car.image);
    // }

    $timeout(()=>{
      $scope.cars=allCars;
      $rootScope.isLoading=false;
    })
  }
  catch(e){
    console.log(e.message);
    $timeout(()=>{
      $rootScope.isLoading=false;
    })
    
  }
  }
  getCars();
}])