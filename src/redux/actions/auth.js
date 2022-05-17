import * as api from '../api';

export const registerVendor =
  (agencySettings, userdata, success, error) => async dispatch => {
   
    try {
      const response = await api.apiRegisterVendor(
        agencySettings.agencyUrl,
        userdata,
      );
      success(response.data, agencySettings);
    } catch (e) {
      console.log(e, 'register vendor error')
      error(e);
    }
  };

export const storeUserData = data => async dispatch => {
  dispatch({type: 'SET_USERDATA', userData: data});
};

export const getUserByWalletAddress =
  (agencyUrl, address, success, error) => async dispatch => {
    try {
      const response = await api.apiGetUserByWalletAddress(agencyUrl, address);
      if (response.status === 204) {
        return error();
      }
      dispatch({type: 'SET_USERDATA', userData: response.data});
      success(response.data, agencyUrl);
    } catch (e) {
      console.log(e);
      error(e);
    }
  };

export const getRestoreUserData =
  (agencySettings, address, success, error) => async dispatch => {
    try {
      const response = await api.apiGetRestoreUserData(
        agencySettings.agencyUrl,
        address,
      );
      if (response.status === 204) {
        return error({message: 'Not registered'}, agencySettings);
      }
      success(response.data, agencySettings);
    } catch (e) {
      console.log(e, 'get restore user data');
      error(e);
    }
  };

export const getAppSettings = (agencyUrl, success, error) => async dispatch => {
  try {
    const response = await api.apiGetAppSettings(agencyUrl);
    let appSettings = response.data;
    appSettings['agencyUrl'] = agencyUrl;
    success(appSettings);
    return;
  } catch (e) {
    error(e);
    console.log(e);
  }
};
