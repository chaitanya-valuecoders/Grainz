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

// export const getGraphDetails = async (payload) => {
//   let {limit, month} = payload;
//   let url = baseURL + `/users/getAmountEarned`;
//   const token = await AsyncStorage.getItem('App-Token');
//   if (month === undefined || month === null) {
//     url = url + `?limit=${limit}`;
//   } else {
//     url = url + `?limit=${limit}&month=${month}`;
//   }
//   console.warn('url', url);
//   return axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
