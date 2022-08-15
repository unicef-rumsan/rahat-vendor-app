import axios from 'axios';

export const apiRegisterVendor = (agencyUrl, data) =>
  axios.post(`${agencyUrl}/api/v1/vendors/register`, data);

export const apiGetUserByWalletAddress = (agencyUrl, data) =>
  axios.get(`${agencyUrl}/api/v1/vendors/${data}`);

export const apiGetRestoreUserData = (agencyUrl, data) =>
  axios.get(`${agencyUrl}/api/v1/vendors/${data}`);

export const apiGetAppSettings = agencyUrl =>
  axios.get(`${agencyUrl}/api/v1/app/settings`);

export const apiGetPackageDetail = id =>
  axios.get(`${agencyUrl}/api/v1/nft/token/${id}`);

export const apiGetPackageBalanceInFiat = data =>
  axios.post(
    `${'https://agency-nft.rahat.io/api/v1/nft/total-package-balance'}`,
    data,
  );
