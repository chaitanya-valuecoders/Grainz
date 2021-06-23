import axios from 'axios';
import url from './Environment.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

let baseURL = url['STAGING'].BaseURL;

// export const loginApi = payload => {
//   return axios.post(
//     'https://grainzwebapid.azurewebsites.net/connect/token',
//     payload,
//     {
//       headers: {
//         Accept: '*/*',
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     },
//   );
// };

export const loginApi = payload => {
  return axios.post(
    'https://grainzwebapiq.azurewebsites.net/connect/token',
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

export async function getManualLogList() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Manuallog/manual logs', {
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

export async function getManualLogTypes() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/ManualLog/manual log types', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getManualLogItemList() {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/ManualLog/manual log item list 2', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateManualLogApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/ManualLog/update manual log', payload, {
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
  return axios.get(baseURL + '/Inventory/inventory list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateOrderApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/Order/update casual purchase order', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderItemByIdApi = async id => {
  let url = baseURL + `/Order/order item by id?Id=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderImagesByIdApi = async id => {
  let url = baseURL + `/Order/order images by id?id=${id}`;
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

export async function lookupInventoryApi(depatId) {
  let url =
    baseURL +
    `/Lookup/Inventory categories by department?DepartmentId=${depatId}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getNewTopStockTakeApi(id, date, count) {
  let url =
    baseURL +
    `/StockTake/top new stock?DepartmentId=${id}&StockTakeDate=${date}&count=${count}`;
  console.log('URL', url);
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getPreviousStockDatesApi(id) {
  let url =
    baseURL +
    `/StockTake/previous stock dates by department id?DepartmentId=${id}`;
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateStockTakeApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/StockTake/update stocktake', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addStockTakeApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/StockTake/add stocktake', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const inventoryLevelsApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Inventory/inventory levels', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const eventsAdminApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Event/Events', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDepartmentsAdminApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + '/Lookup/Departments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDepartmentsReportsAdminApi = async (depId, time) => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL +
      `/Report/GM report by department?DepartmentId=${depId}&Type=${time}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const menuAnalysisAdminApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Report/Menu analysis report`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const salesReportAdminApi = async (startDate, endDate) => {
  const token = await AsyncStorage.getItem('@appToken');
  const url =
    baseURL + `/report/sales report?StartDate=${startDate}&EndDate=${endDate}`;

  console.log('URWL', url);
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderingCountApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Order/orders count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const draftOrderingApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Order/draft orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deliveryPendingApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Order/non delivered orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const reviewOrderApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Order/review orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const historyOrderApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Order/history orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCustomerDataApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Customer/get customer`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCustomerDataApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + '/Customer/update customer', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSupplierListAdminApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Supplier/Supplier list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCurrentLocUsersAdminApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/User/get current location users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const clonePreviousApi = async supplierId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL + `/Order/orders by supplier?SupplierId=${supplierId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const inventoryListAdminApi = async supplierId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL +
      `/InventoryProductMapping/Inventory product mappings by supplierId?supplierId=${supplierId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const supplierAdminApi = async supplierId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL + `/Product/Products by supplier id?SupplierId=${supplierId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const unMapProductApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(
    baseURL + '/InventoryProductMapping/remove product mapping',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const updateInventoryProductApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(
    baseURL + '/InventoryProductMapping/update custom fields',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const lookupDepartmentsApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Lookup/Departments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const lookupCategoriesApi = async deptId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL +
      `/Lookup/Inventory categories by department?DepartmentId=${deptId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getStockDataApi = async (deptId, catId, date) => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL +
      `/StockTake/new stock by category?DepartmentId=${catId}&CategoryId=${deptId}&StockTakeDate=${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const lookupInsideCategoriesApi = async catId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL + `/Inventory/inventory levels?CategoryId=${catId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const inventoryListSetupCatApi = async catId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(
    baseURL + `/Inventory/inventory list by category?CategoryId=${catId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const deleteInventoryListProductApi = async (payload, id) => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/Inventory/Delete Inventory?Id=${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRecipeNamesApi = async catId => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Recipe/recipe names`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRecipeDetailsApi = async id => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Recipe/recipe advance details?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSupplierListSetupApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Supplier/Supplier list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMenuItemsSetupApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/menu/menu item list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const viewMenuItemsSetupApi = async id => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Menu/menu item by id?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addManualEntrySalesApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/SaleInvoice/add manual entry`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteEventAdminApi = async (payload, id) => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/Event/delete event?Id=${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserNameEventsApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/User/get all location users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addEventAdminApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/Event/add event`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getEventDetailsAdminApi = async id => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Event/Event details?Id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateEventAdminApi = async payload => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/Event/update event`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getMenuItemsAdminApi = async () => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.get(baseURL + `/Menu/menus`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteOfferEventAdminApi = async (payload, id) => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/Event/delete event offer?Id=${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteEventItemAdminApi = async (payload, id) => {
  const token = await AsyncStorage.getItem('@appToken');
  return axios.post(baseURL + `/Event/delete event Item?Id=${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
