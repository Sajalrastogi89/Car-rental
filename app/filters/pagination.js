myApp.filter("pagination", function () {
  return function (input, start, pageSize) {
    if (!input || !input.length) return [];
    start = +start; 
    return input.slice(start, start + pageSize);
  };
});
