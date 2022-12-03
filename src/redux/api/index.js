import axios from 'axios';

export const apiRegisterVendor = (agencyUrl, data) =>
  axios.post(`${agencyUrl}/api/v1/vendors/register`, data);

export const apiGetUserByWalletAddress = (agencyUrl, data) =>
  axios.get(`${agencyUrl}/api/v1/vendors/${data}`);

export const apiGetRestoreUserData = (agencyUrl, data) =>
  axios.get(`${agencyUrl}/api/v1/vendors/${data}`);

export const apiGetAppSettings = agencyUrl =>
  axios.get(`${agencyUrl}/api/v1/app/settings`);

export const apiGetWards = () =>
  axios.get('https://unicef-api.xa.rahat.io/api/v1/beneficiaries/wards');

export const apiGetContractAbi = (agencyUrl, contract_name) =>
  axios.get(`${agencyUrl}/api/v1/app/contracts/${contract_name}`);
