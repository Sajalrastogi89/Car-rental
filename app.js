
const myApp = angular.module('myApp', ['ui.router'
]);

myApp.run(['IndexedDBService',async function(IndexedDBService) {

  IndexedDBService.openDB()
    .then(function(db) {
      console.log("Database initialized:", db);
    })
    .catch(function(error) {
      console.error("Error initializing database:", error);
    });

    const car=await IndexedDBService.getRecord('cars',6);
    delete car.id;
    const cities= [
      "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", 
      "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Kochi", 
      "Bhopal", "Indore", "Surat", "Agra", "Patna", "Vadodara", "Goa", 
      "Shimla", "Rishikesh", "Manali", "Mussoorie", "Coimbatore", "Tiruchirappalli",
      "Jodhpur", "Udaipur", "Mysore", "Varanasi"
    ];


    for(let i of cities){
      car.city=i;
      for(let i=0;i<4;i++){
        await IndexedDBService.addRecord('cars',car);
      }
    }

}])