myApp.service('BookingService',["$q",function($q){
  this.getOdometerReading = function(imageFile) {
    let deferred = $q.defer();

    this.convertToArrayBuffer(imageFile)
        .then((arrayBuffer) => {
            return Tesseract.recognize(arrayBuffer, 'eng');
        })
        .then((result) => {
            let numbersOnly = result.data.text.match(/\d+/g)?.join('') || '';
            deferred.resolve(numbersOnly);
        })
        .catch((error) => {
            deferred.reject(error);
        });

    return deferred.promise;
};

// Function to convert image file to ArrayBuffer
this.convertToArrayBuffer = function(imageFile) {
    let deferred = $q.defer();
    let reader = new FileReader();

    reader.onload = function(event) {
        deferred.resolve(event.target.result);
    };

    reader.onerror = function(error) {
        deferred.reject(error);
    };

    reader.readAsArrayBuffer(imageFile); // Convert file to ArrayBuffer

    return deferred.promise;
};

}])