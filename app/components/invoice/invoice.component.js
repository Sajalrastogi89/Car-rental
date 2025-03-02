myApp.component('tripInvoice',{
  templateUrl: "app/components/invoice/invoice.html",
  controller: 'invoiceController',
  bindings: {
    booking: '<',
    onClose: '&'
  }
});