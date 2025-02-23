myApp.filter("pagination", function () {
  return function (input, start, pageSize) {
    if (!input || !input.length) return [];
    start = +start; // Convert start to a number
    return input.slice(start, start + pageSize);
  };
});
