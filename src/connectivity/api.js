import axios from 'axios';
import url from './Environment.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

let baseURL = url[1].BaseURL;

export const loginApi = payload => {
  return axios.post(
    'https://grainzwebapid.azurewebsites.net/connect/token',
    payload,
    {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
};

export async function getMyProfileApi() {
  const token = await AsyncStorage.getItem('@appToken');
  console.warn;
  return axios.get(baseURL + '/Account/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getPendingMepsApi() {
  const token = await AsyncStorage.getItem('@appToken');
  console.warn;
  return axios.get(baseURL + '/Recipe/pending meps', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function getMepsHistoryApi() {
  const token = await AsyncStorage.getItem('@appToken');
  console.warn;
  return axios.get(baseURL + '/Recipe/mep history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMepsOldHistoryApi() {
  const token = await AsyncStorage.getItem('@appToken');
  console.warn;
  return axios.get(baseURL + '/Recipe/mep old history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const deleteMepApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/Recipe/delete mep', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMepRecipesApi = async date => {
  let url = baseURL + `/Recipe/mep recipes?productionDate=${date}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMepRecipeByIdsApi = async id => {
  let url = baseURL + `/Recipe/mepbyid?Id=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAdvanceRecipeByIdsApi = async recipeId => {
  let url = baseURL + `/Recipe/recipe advance details?Id=${recipeId}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const newMepListApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/Recipe/new mep list', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateMepListApi = async payload => {
  console.warn('PAY', payload);
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/Recipe/update mep list', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function getManualLogTypes() {
  const token = await AsyncStorage.getItem('@appToken');
  console.warn;
  return axios.get(baseURL + '/ManualLog/manual log types', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getManualLogList() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Manuallog/manual logs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getManualLogItemList() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Manuallog/manual log item list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const deleteManualLog = async payload => {
  console.warn('PAY', payload);
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/ManualLog/delete manual log', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getManualLogsById = async id => {
  let url = baseURL + `/ManualLog/manual log by id?Id=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateManualLogApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/ManualLog/manual log types', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addManualLogApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/ManualLog/add manual log', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function getCasualPurchasesApi() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Order/casual purchases', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const addOrderApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/Order/add order', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function getSupplierListApi() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Supplier/Supplier list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// export const deleteOrder = async id => {
//   const token = await AsyncStorage.getItem('@appToken');
//   return axios.post(baseURL + `/Order/Delete order?Id=5bbb87d8-ce2f-4347-a678-e228310e5e8a`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const deleteOrderApi = async id => {
  console.warn('PAY', id);
  let url = baseURL + `/Order/Delete order?Id=${id}`;
  console.warn('URL', url);
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(url, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderByIdApi = async id => {
  let url = baseURL + `/Order/order by id?Id=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getInventoryByIdApi = async id => {
  let url = baseURL + `/Inventory/inventorybyid?Id=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function getInventoryListApi() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Manuallog/manual log item list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const getOrderItemByIdApi = async id => {
  let url = baseURL + `/Order/order item by id?Id=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function getDepartmentsApi() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Lookup/Departments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getNewStockTakeApi(id, date) {
  let url =
    baseURL + `/StockTake/new stock?DepartmentId=${id}&StockTakeDate=${date}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
