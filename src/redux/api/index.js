import axios from 'axios';
import networkUrls from '../../../constants/networkUrls';
// import {
//   ENV,
//   TEST_API_URL,
//   PRODUCTION_API_URL,
//   TEST_APP_SETTINGS_URL,
//   PRODUCTION_APP_SETTINGS_URL,
// } from '@env';

// const API_URL = 'https://agency-stage.rahatapp.com/api/v1/vendors';
// const APP_SETTINGS_URL = 'https://agency-stage.rahatapp.com/api/v1/app/settings';

let API_URL =
  networkUrls.ENV === 'development'
    ? networkUrls.TEST_API_URL
    : networkUrls.PRODUCTION_API_URL;
let APP_SETTINGS_URL =
  networkUrls.ENV === 'development'
    ? networkUrls.TEST_APP_SETTINGS_URL
    : networkUrls.PRODUCTION_APP_SETTINGS_URL;

// console.log(ENV,APP_SETTINGS_URL, "app settings url")

export const apiRegisterVendor = (agencyUrl, data) =>
  axios.post(`${agencyUrl}/api/v1/vendors/register`, data);

export const apiGetUserByWalletAddress = (agencyUrl, data) =>
  axios.get(`${agencyUrl}/api/v1/vendors/${data}`);

export const apiGetRestoreUserData = (agencyUrl, data) =>
  axios.get(`${agencyUrl}/api/v1/vendors/${data}`);

export const apiGetAppSettings = agencyUrl =>
  axios.get(`${agencyUrl}/api/v1/app/settings`);
