export const getKeyFromArrayOfObjects = (array, key) => {
  return array.map((item) => item[key]);
};

export const getGreatestValueFromObject = (obj) => {
  return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
};
