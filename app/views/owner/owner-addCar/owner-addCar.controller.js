myApp.controller("AddCar", [
  "$scope",
  "IndexedDBService",
  "ToastService",
  function ($scope, IndexedDBService, ToastService) {
    // Predefined categories of cars
    $scope.categories = ["Sedan", "SUV", "Hatchback", "Convertible"];

    // Predefined fuel types
    $scope.fuelTypes = ["Petrol", "Diesel", "Electric"];

    // Predefined list of cities
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

    // Initialize car object
    $scope.car = {};

    /**
     * Handles image upload and converts it to a Blob
     * @param {*} element - The input element containing the file
     */
    $scope.uploadImage = function (element) {
      let file = element.files[0]; // Get the uploaded file
      let fileType = file.type; // Get the file type

      let reader = new FileReader();
      reader.onload = function (event) {
        let arrayBuffer = event.target.result; // Get raw data
        $scope.car.image = new Blob([arrayBuffer], { type: fileType }); // Create valid Blob
      };

      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    };

    // Form submission handler
    $scope.addCar = function () {
      // Process car features, split by new lines and filter out empty lines
      if ($scope.car.features) {
        $scope.car.features = $scope.car.features
          .split(/\r?\n/)
          .filter(function (feature) {
            return feature.trim() !== "";
          });
      } else {
        $scope.car.features = [];
      }

      // Get user data from session storage
      const user = JSON.parse(sessionStorage.getItem("loginData"));
      $scope.car.owner_id = user.email; // Set owner ID
      $scope.car.owner = user; // Set owner details

      // Add car record to IndexedDB
      IndexedDBService.addRecord("cars", $scope.car)
        .then(() => {
          $scope.car = {}; // Reset car object
          ToastService.success("Car added successfully",3000); // Show success toast
        })
        .catch((e) => {
          ToastService.error(e,3000); // Show error toast
        });
    };
  },
]);
