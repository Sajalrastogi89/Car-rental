myApp.controller('cardController', function () {
  const vm = this;
  
  vm.$onInit = function () {
    vm.updateFuelPump();
    // console.log('Car object:', vm.car);
  };

  // vm.$onChanges = function (changesObj) {
  //   if (changesObj.car && changesObj.car.currentValue) {
  //     console.log('Car updated:', changesObj.car.currentValue);
  //     vm.updateFuelPump();
  //   }
  // };

  vm.updateFuelPump = function () {
    if (vm.car && vm.car.fuelType === 'Electric') {
        vm.fuelPump = 'assets/img/electric.png';
        vm.fuelPumpStyle = { "width": "66%", "opacity": "0.9" }; // Reduce width for Electric
    } else {
        vm.fuelPump = 'assets/img/fuel.png';
        // vm.fuelPumpStyle = { "width": "70%", "opacity": "1" }; // Normal size for Fuel
    }
};

});
