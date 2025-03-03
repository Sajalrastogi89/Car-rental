myApp.component('tripInvoice',{
  templateUrl: "app/components/invoice/invoice.html",
  bindings: {
    booking: '=',
    onClose: '&'
  }
});