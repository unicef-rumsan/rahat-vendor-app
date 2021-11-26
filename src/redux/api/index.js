import axios from 'axios';

const API_URL = 'https://agency-stage.rahatapp.com/api/v1/vendors';
const APP_SETTINGS_URL = 'https://agency-stage.rahatapp.com/api/v1/app/settings';

export const apiRegisterVendor = data =>
  axios.post(`${API_URL}/register`, data);

export const apiGetUserByWalletAddress = data =>
  axios.get(`${API_URL}/${data}`);

export const apiGetAppSettings = () => axios.get(`${APP_SETTINGS_URL}`);
