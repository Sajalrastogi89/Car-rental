myApp.service("BiddingService", [
  "IndexedDBService",
  function (IndexedDBService) {

    /**
     * @description - this will fetch all bids on particular car and update clashing bids status to
     * rejected
     * @param {Number} carId 
     * @param {Date} carStartDate 
     * @param {Date} carEndDate 
     * @returns - array of objects
     */
    this.rejectOverlappingBids = function (carId, carStartDate, carEndDate) {
      return IndexedDBService.getRecordsUsingIndex("biddings", "car_id", carId)
          .then((allBiddingsUsingCarId) => {
              let updatedBids = allBiddingsUsingCarId
                  .filter(bid => bid.status === 'pending' && bid.car.startDate <= carEndDate && bid.car.endDate >= carStartDate)
                  .map(bid => {
                      bid.status = 'rejected'; // Update status
                      return bid;
                  });
              if (updatedBids.length === 0) {
                  return []; 
              }
  
              return Promise.all(updatedBids.map(bid => IndexedDBService.updateRecord("biddings", bid)));
          })
          .catch((e) => {
              console.error("Error rejecting overlapping bids:", e);
              throw e;
          });
  };
  
/**
 * @description - this will update approved dates for particular car
 * @param {array of objects} approvedDates 
 */
    this.updateCarApproved = function (approvedDates) {
      IndexedDBService.updateRecord("cars", approvedDates);
    };
  },
]);
