
const myApp = angular.module('myApp', ['ui.router'
]);

myApp.run(['IndexedDBService', function(IndexedDBService) {
  IndexedDBService.openDB()
    .then(function(db) {
      console.log("Database initialized:", db);
    })
    .catch(function(error) {
      console.error("Error initializing database:", error);
    });
}]);



