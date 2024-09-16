// import type { AxiosRequestConfig, AxiosResponse } from 'axios';
// import WebApp from '@twa-dev/sdk';
import axios from 'axios';
// import { useAcountStore } from '@/stores/user';
import {
  readStorage, // writeStorage
} from '@/utils';

// import { LoginAddress } from './apis';

export const requestApi = async (url: string, method = 'get', data: any) => {
  const token: string | undefined = readStorage('tele_mini_app_user_token');

  let config: any = {
    baseURL: import.meta.env.VITE_BASE_API,
    method,
    url,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token || '',
    },
  };

  if (method === 'get') {
    config.params = data;
  } else {
    config.data = data;
  }

  axios.interceptors.request.use(
    (config) => config,
    (error) => Promise.resolve(error.response || error),
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => Promise.resolve(error.response || error),
  );

  const result = await axios({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 300000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    ...config,
  });

  return checkStatus(result);
};

export const uploadApi = async(url:string, method = 'post',user_id:string,blob:any) => {
    const token: string | undefined = readStorage('tele_mini_app_user_token');

    const uploadFormData = new FormData();
    uploadFormData.append('user_id', user_id);
    uploadFormData.append('voice_file', blob, user_id+'.wav');
    let config: any = {
      baseURL: import.meta.env.VITE_BASE_API,
      method,
      url,
      timeout: 300000,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token || '',
      },
      
    };
    axios.interceptors.request.use(
      (config) => config,
      (error) => Promise.resolve(error.response || error),
    );
  
    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.resolve(error.response || error),
    );
  
   // const result = await axios({
   //  baseURL: import.meta.env.VITE_BASE_API,
   //   timeout: 300000,
   //   headers: {
   //     'X-Requested-With': 'XMLHttpRequest',
   //     'Content-Type': 'multipart/form-data',     
   //  },
   //   ...config,
   // });
    const result = await axios.post(import.meta.env.VITE_BASE_API+url,
      uploadFormData, {
        headers:{
             'Content-Type': 'multipart/form-data'
        }       
      }
    )

    return checkStatus(result);
}

const checkStatus = async (response: any): Promise<any> => {
  // 特殊错误码处理
  if (response && response.data && response.data.code === 402) {
    // const acountStore = useAcountStore();
    // const account = useAcountStore((r) => r.account) as string;

    // 重新请求获取新的token
    // const { data } = await LoginAddress(WebApp.initData);

    // acountStore.setToken(account, data.token, data.address);
    // writeStorage('tele_mini_app_user_token', data.token);
    return;
  }

  if (response.status === 200 && response.data?.res_code === 'FAIL') {
    console.log('======Fail======', response.data);
    return response.data;
  }

  if (response.status === 200 && response.data.result?.res_code === 'SUCCESS') {
    return response.data;
  }

  return {};
};

export const $api = {
  post(url: string, data: any) {
    return requestApi(url, 'POST', data);
  },
  get(url: string, data: any) {
    return requestApi(url, 'GET', data);
  },
};

export const API_URL = import.meta.env.VITE_BASE_API;
