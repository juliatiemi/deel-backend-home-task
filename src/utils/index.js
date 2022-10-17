export const getKeyFromArrayOfObjects = (array, key) => {
  return array.map((item) => item[key]);
};
