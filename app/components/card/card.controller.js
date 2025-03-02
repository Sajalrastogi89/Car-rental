myApp.controller('cardController', function () {
  // const vm = this;
  
  // vm.$onInit = 

  

  // vm.updateFuelPump = function () {
  //   if (vm.car && vm.car.fuelType === 'Electric') {
  //       vm.fuelPump = 'assets/img/electric.png';
  //       vm.fuelPumpStyle = { "width": "66%", "opacity": "0.9" }; // Reduce width for Electric
  //   } else {
  //       vm.fuelPump = 'assets/img/fuel.png';
  //       // vm.fuelPumpStyle = { "width": "70%", "opacity": "1" }; // Normal size for Fuel
  //   }
// };

  this.$onInit = () => {
    console.log("Fuel Pump", this.link);
  };

});
