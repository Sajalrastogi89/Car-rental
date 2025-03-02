myApp.service("BiddingService", [
  "IndexedDBService",
  function (IndexedDBService) {
    this.rejectOverlappingBids = function (carId, carStartDate, carEndDate) {
      return IndexedDBService.getRecordsUsingIndex("biddings", "car_id", carId)
          .then((allBiddingsUsingCarId) => {
              
            console.log(allBiddingsUsingCarId, "Fetched Biddings 1");
              let updatedBids = allBiddingsUsingCarId
                  .filter(bid => bid.status === 'pending' && bid.car.startDate <= carEndDate && bid.car.endDate >= carStartDate)
                  .map(bid => {
                      bid.status = 'rejected'; // Update status
                      return bid;
                  });
                  console.log(updatedBids, "Fetched Biddings 2");
              if (updatedBids.length === 0) {
                  console.log("No overlapping bids to reject.");
                  return []; 
              }
  
              return Promise.all(updatedBids.map(bid => IndexedDBService.updateRecord("biddings", bid)));
          })
          .catch((e) => {
              console.error("Error rejecting overlapping bids:", e);
              throw e;
          });
  };
  

    this.updateCarApproved = function (approvedDates) {
      IndexedDBService.updateRecord("cars", approvedDates);
    };
  },
]);
