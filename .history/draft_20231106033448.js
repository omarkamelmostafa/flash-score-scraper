// write an array of numbers
const array = [1, 2, 3, 4, 5];

const calc = (array) => {
  initialValue = 
  const average = array.forEach((element, key, map) => {
    // console.log(element, key, map);
    // return (average = array.reduce((a, b) => a + b, 0) / array.length);
    return (average = array.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    ));
  });
  return average;
};

calc(array);