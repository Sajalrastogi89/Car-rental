myApp
  .factory("LocationFactory",['$q','$http',function($q,$http){
  const metroCities=[
    "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", 
    "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kochi", 
    "Bhopal", "Indore", "Surat", "Agra", "Patna", "Vadodara", "Goa", 
    "Shimla", "Rishikesh", "Manali", "Mussoorie", "Coimbatore", "Tiruchirappalli",
    "Jodhpur", "Udaipur", "Mysore", "Varanasi"
  ];

  return {
    getCityUsingGeolocation: function() {
      var deferred = $q.defer();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var lat = position.coords.latitude;
          var lon = position.coords.longitude;
          // Build the Nominatim reverse-geocoding API URL
          var url = 'https://nominatim.openstreetmap.org/reverse?lat=' 
                    + lat + '&lon=' + lon + '&format=json';
          
          // Use $http.get to call the API
          $http.get(url).then(function(response) {
            var data = response.data;
            if (data && data.address) {
              // Get the city from available properties
              var city = data.address.city || data.address.town || data.address.village;
              var state = data.address.state;
              
              // Check if the city is in metroCities or if state is "Delhi"
              if ((city && metroCities.indexOf(city) !== -1) || state === "Delhi") {
                deferred.resolve(city || "Delhi");
              } else {
                deferred.resolve("Our service is not available in your location.");
              }
            } else {
              deferred.reject("Unable to fetch city data.");
            }
          }, function(error) {
            deferred.reject("Error fetching city.");
            console.error(error);
          });
        }, function(error) {
          deferred.reject("Error getting geolocation: " + error.message);
          console.error(error);
        });
      } else {
        deferred.reject("Geolocation not supported by this browser.");
      }
      
      // Return the promise
      return deferred.promise;
    }
  }}])