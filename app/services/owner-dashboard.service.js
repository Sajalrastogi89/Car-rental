myApp
.service('OwnerDashboardService',['IndexedDBService',function(IndexedDBService){
  this.getAllOwnerCars =async function(owner_id){
   return await IndexedDBService.getRecordsUsingIndex("cars","user_id",owner_id);
  }
}])