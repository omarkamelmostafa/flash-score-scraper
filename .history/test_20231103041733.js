function calculateMinMaxValueAndAverage(array) {
  // Convert all of the elements in the array to numbers.
  const numericArray = array.map((item) => {
    if (typeof item === "string") {
      return parseFloat(item);
    } else {
      return item;
    }
  });

  // Calculate the minimum, maximum, and average of the numeric array.
  var min = Math.min(...numericArray);
  var max = Math.max(...numericArray);
  var average = (
    numericArray.reduce((sum, current) => sum + current) / numericArray.length
  ).toFixed(2);

  // Add the percentage sign to the min, max, and average if they are percentages.
  if (min.endsWith("%")) {
    min += "%";
  }

  if (max.endsWith("%")) {
    max += "%";
  }

  if (avg.endsWith("%")) {
    avg += "%";
  }

  // Return the minimum, maximum, and average.
  return { min, max, average };
}
// const { min, average, max } = calculateMinMaxValueAndAverage(floatArray);

const percentageArray = ["59%", "29%", "44%"];

const stringArray = ["13", "10", "5"];

const floatArray = ["1.48", "0.66", "0.92"];

const { min, average, max } = calculateMinMaxValueAndAverage(percentageArray);
// const { min, average, max } = calculateMinMaxValueAndAverage(stringArray);
// const { min, average, max } = calculateMinMaxValueAndAverage(floatArray);

console.log(min, average, max);
