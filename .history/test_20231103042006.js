function calculateMinMaxValueAndAverage(array) {
  // Initialize the minimum, maximum, and average variables.
  let min = array[0];
  let max = array[0];
  let avg = 0;

  // Iterate over the array and update the minimum, maximum, and average variables.
  for (const element of array) {
    // Check if the element ends with a percentage sign.
    if (element.match(/%$/)) {
      // Remove the percentage sign from the element.
      element = element.substring(0, element.length - 1);

      // Convert the element to a number.
      element = Number(element);
    }

    if (element < min) {
      min = element;
    }

    if (element > max) {
      max = element;
    }

    avg += element;
  }

  // Calculate the average.
  avg = avg / array.length;

  // Add the percentage sign to the min, max, and average if they are percentages.
  if (min.match(/%$/)) {
    min += "%";
  }

  if (max.match(/%$/)) {
    max += "%";
  }

  if (avg.match(/%$/)) {
    avg += "%";
  }

  // Return the minimum, maximum, and average.
  return { min, max, avg };
}
// const { min, average, max } = calculateMinMaxValueAndAverage(floatArray);

const percentageArray = ["59%", "29%", "44%"];

const stringArray = ["13", "10", "5"];

const floatArray = ["1.48", "0.66", "0.92"];

const { min, average, max } = calculateMinMaxValueAndAverage(percentageArray);
// const { min, average, max } = calculateMinMaxValueAndAverage(stringArray);
// const { min, average, max } = calculateMinMaxValueAndAverage(floatArray);

console.log(min, average, max);
