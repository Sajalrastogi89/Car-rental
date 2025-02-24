myApp
.service('biddingService',function(){
  this.createBiddingObject = function(car,user,owner){
    return {
      car_id: car.id,
      car: car,
      startDate: car.startDate,
      endDate: car.endDate,
      user_id: user.email,
      user: user,
      owner_id: owner.email,
      owner: owner,
      status: false,
      timeStamp: new Date() 
    };
  }

})