export const getKeyFromArrayOfObjects = (array, key) => {
  return array.map((item) => item[key]);
};

export const sortObject = (obj) => {
  let sortable = [];
  for (var item in obj) {
    sortable.push([item, obj[item]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  return sortable;
};

export const PROFILE_TYPES = {
  CLIENT: 'client',
  CONTRACTOR: 'contractor',
};

export const MODEL_PROPERTIES = {
  PROFESSION: 'profession',
  ID: 'id',
  CONTRACT_ID: 'ContractId',
  CONTRACTOR_ID: 'ContractorId',
  CLIENT_ID: 'ClientId',
  PRICE: 'price',
};

export const CONTRACT_STATUS = {
  TERMINATED: 'terminated',
};

export const DEPOSIT_VALIDATION_TAX = 0.25;
