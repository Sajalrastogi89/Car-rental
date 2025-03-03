myApp.service('DashboardService',['IndexedDBService','$q',function(IndexedDBService,$q){

/**
 * @description - this will fetch data from object store based on given values and then image blob
 * in all cars object will be changed to temporary url and returned
 * @param {String} objectStore 
 * @param {String} indexKey 
 * @param {Number|String} indexValue 
 * @param {Number} pageSize 
 * @param {Number} currentPage 
 * @returns array of object
 */
  this.getCarsData=function(objectStore,indexKey,indexValue,pageSize,currentPage) {
    const deferred=$q.defer();
    const entriesToSkip=currentPage * pageSize;
    IndexedDBService.getRecordsUsingPaginationWithIndex(objectStore, indexKey, indexValue,pageSize,
      entriesToSkip)
      .then((allCars) => {
        allCars.forEach((car) => {
          if (car.image instanceof Blob && car.image.size > 0) {
            car.image = URL.createObjectURL(car.image);
          } else {
            console.warn("car.image is not a Blob:", car.image);
          }
          const fuelData = this.getFuelPumpData(car.fuelType);
          car.fuelPump = fuelData.icon;
          car.fuelPumpStyle = fuelData.style;
        });
        deferred.resolve(allCars);
      })
      .catch((e) => {
        deferred.reject(e.message);
      });
      return deferred.promise;
  }

  /**
   * @description - this will set fuel related data according to fuel value
   * @param {String} fuelType 
   * @returns {Object}
   */
  this.getFuelPumpData=function(fuelType) {
    return fuelType == "Electric"
      ? {
          icon: "assets/img/electric.png",
          style: { width: "66%", opacity: 0.9 },
        }
      : { icon: "assets/img/fuel.png", style: {} };
  }

}])