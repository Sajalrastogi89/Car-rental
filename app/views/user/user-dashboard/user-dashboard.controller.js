myApp
.controller('UserController',['$scope','$timeout','LocationFactory','IndexedDBService','ToastService','$rootScope',function($scope,$timeout,LocationFactory,IndexedDBService,ToastService,$rootScope){
  $scope.cities=[
    "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", 
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kochi", 
    "Bhopal", "Indore", "Surat", "Agra", "Patna", "Vadodara", "Goa", 
    "Shimla", "Rishikesh", "Manali", "Mussoorie", "Coimbatore", "Tiruchirappalli",
    "Jodhpur", "Udaipur", "Mysore", "Varanasi"
  ];

  $scope.cars=[];



  async function getAllCars() {
  try {
    $rootScope.isLoading = true;

    let car = await IndexedDBService.getAll("cars");
    

    // Convert blob to URL
    car.forEach(car => {
      if (car.image instanceof Blob) {
        console.log("Valid Blob:", car.image);
        console.log("Blob Type:", car.image.type);
        console.log("Blob Size:", car.image.size);
    
        if (car.image.size > 0) {
          car.image = URL.createObjectURL(car.image);
          console.log("Generated Blob URL:", car.imageUrl);
        } else {
          console.error("⚠️ Blob is empty! Cannot create URL.");
        }
      } else {
        console.warn("car.image is not a Blob:", car.image);
      }
    });
    
    $timeout(function(){
      $scope.cars=car;
    })
    

    console.log($scope.cars);
  } catch (e) {
    console.log(e);
    ToastService.showToast('error', e.message);
  } finally {
    $timeout(() => ($rootScope.isLoading = false), 500);
  }
}
getAllCars();


  async function getCurrentCity(){
    try{
      $timeout(()=>{
        $rootScope.isLoading = true;
      })
      const current= await LocationFactory.getCityUsingGeolocation();
      // console.log(current);
      if(!$scope.cities.includes(current)){
        throw new Error(current);
      }


      $timeout(() => {
        $scope.selectedCity = current;
        // console.log($scope.selectedCity);
      });
    }
    catch(e){
      console.log(e);
    }
    finally {
      $timeout(() => {
        $rootScope.isLoading = false; // Hide loader globally
      }, 500);
    }
  }
  getCurrentCity();

  $scope.currentPageAll = 0; // Tracks the current page
  $scope.pageSize = 4; // Number of items per page
  
  // Function to calculate total pages
  $scope.numberOfPagesAll = function () {
    return Math.ceil($scope.cars.length / $scope.pageSize);
  };
  
  // Function to set the current page
  $scope.setPageAll = function (page) {
    $scope.currentPageAll = page;
  };
  

  $scope.currentPage = 0;

//   $scope.$watch('selectedCity', function (newCity, oldCity) {
//     if (newCity !== oldCity) {
//       $timeout(()=>{
//         $rootScope.isLoading=true;
//       })
      
//       $scope.currentPage = 0; 
//       $scope.$apply(()=>{
//         $rootScope.isLoading=false;
//         $scope.selectedCity=newCity;
//       });
//       //  $timeout(function(){
       
//       //  },200)
//     }
// });



$scope.numberOfPages = function() {
    return Math.ceil(($scope.cars.filter(car => car.city === $scope.selectedCity)).length / $scope.pageSize);
};




}]);