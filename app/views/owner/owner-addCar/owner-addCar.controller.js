myApp.controller("AddCar", [
  "$scope",
  "$timeout",
  "IndexedDBService",
  "ToastService",
  function ($scope, $timeout, IndexedDBService,ToastService) {
    $scope.categories = ["Sedan", "SUV", "Hatchback", "Convertible"];
    $scope.fuelTypes = ["Petrol", "Diesel", "Electric"];
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
    $scope.car = {};
    // Handle image upload for preview purposes
    $scope.uploadImage = function (element) {
      let file = element.files[0]; // Get the uploaded file
      let fileType = file.type;
  
      let reader = new FileReader();
      reader.onload = function (event) {
          let arrayBuffer = event.target.result; // Get raw data
          $scope.car.image = new Blob([arrayBuffer], { type: fileType }); // Create valid Blob
          console.log("✅ Uploaded Blob:", $scope.car.image);
          // $scope.$apply(); // Update AngularJS UI
      };
  
      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
  };
  

    // Form submission handler
    $scope.addCar = async function () {
      try {
        if ($scope.car.features) {
          $scope.car.features = $scope.car.features
            .split(/\r?\n/)
            .filter(function (feature) {
              return feature.trim() !== "";
            });
        } else {
          $scope.car.features = [];
        }

        const user = JSON.parse(sessionStorage.getItem("loginData"));
        $scope.car.user_id = user.email;
        $scope.car.user = user;

        const result = await IndexedDBService.addRecord("cars", $scope.car);
        $scope.car = {};
        ToastService.showToast('success','car added successfully');
        // console.log(result);
        // console.log($scope.car.image);
        // console.log("Car details:", $scope.car);
        // Now, $scope.car includes properties from the dropdowns (selected from arrays)
        // and features is an array of feature strings.
      } catch (e) {
        ToastService.showToast('error',e.message);
      }
    };
  },
]);
