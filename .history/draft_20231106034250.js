// write an array of numbers
const array = [1, 2, 3, 4, 5];

const calc = (array) => {
  const initialValue = 0;
  // const average = array.forEach((element, key, map) => {
  // });
  // console.log(element, key, map);
  return (average = array.reduce((a, b) => a + b, 0) / array.length);
  const average = array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0 / array.length
  );
  console.log(average);
};

calc(array);
