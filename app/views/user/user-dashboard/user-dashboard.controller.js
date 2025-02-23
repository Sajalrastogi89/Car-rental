myApp
.controller('UserController',['$scope','$timeout','LocationFactory','IndexedDBService','ToastService',function($scope,$timeout,LocationFactory,IndexedDBService,ToastService){
  $scope.cities=[
    "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", 
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kochi", 
    "Bhopal", "Indore", "Surat", "Agra", "Patna", "Vadodara", "Goa", 
    "Shimla", "Rishikesh", "Manali", "Mussoorie", "Coimbatore", "Tiruchirappalli",
    "Jodhpur", "Udaipur", "Mysore", "Varanasi"
  ];

  $scope.cars=[];

  async function getCurrentCity(){
    try{
      const current= await LocationFactory.getCityUsingGeolocation();
      console.log(current);
      if(!$scope.cities.includes(current)){
        throw new Error(current);
      }


      $timeout(() => {
        $scope.selectedCity = current;
        console.log($scope.selectedCity);
      });
    }
    catch(e){
      console.log(e);
    }
  }
  getCurrentCity();

  async function getAllCars(){
    try{
        $scope.cars=await IndexedDBService.getAll("cars");
        console.log($scope.cars);
      }
    catch(e){
      console.log(e);
      ToastService.showToast('error',e.message);
    }
  }
  getAllCars();




}]);