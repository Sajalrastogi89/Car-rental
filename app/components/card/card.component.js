myApp
  .component('cardComponent',{
    templateUrl: 'app/components/card/card.html',
    controller: 'cardController',
    bindings: {
      car: '<'
    }
  })