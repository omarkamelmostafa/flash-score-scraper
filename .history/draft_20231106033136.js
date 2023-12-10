// write an array of numbers
const array = [1, 2, 3, 4, 5];

const calc = (array) => {
  const average = array.forEach((element, key, map) => {
    console.log(element, key, map);
  });
  return average;
};

calc(array);
