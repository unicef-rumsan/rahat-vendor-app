import * as api from '../api';
import {
  SET_AUTH_DATA,
  CLEAR_REGISTRATION_FORM_DATA,
  STORE_REGISTRATION_FORM_DATA,
  SET_RAHAT_PASSCODE,
  UNLOCK_APP,
  LOCK_APP,
  UPDATE_BACKINGUP_TO_DRIVE_STATUS
} from '../actionTypes';

export const setAuthData = (payloadObj) => ({
  type: SET_AUTH_DATA,
  payload: payloadObj
});

export const storeRegistrationFormData = (payloadObj) => ({
  type: STORE_REGISTRATION_FORM_DATA,
  payload: payloadObj,
})

export const setRahatPasscode = (payloadObj) => ({
  type: SET_RAHAT_PASSCODE,
  payload: payloadObj,
});

export const unlockApp = () => ({
  type: UNLOCK_APP
})
export const lockApp = () => ({
  type: LOCK_APP
});

export const updateBackingupToDriveStatus = (payloadObj) => ({
  type: UPDATE_BACKINGUP_TO_DRIVE_STATUS,
  payload: payloadObj
})



export const clearRegistrationFormData = (payloadObj) => ({
  type: CLEAR_REGISTRATION_FORM_DATA,
})

export const registerVendor =
  (agencySettings, userdata, success, error) => async dispatch => {

    try {
      const response = await api.apiRegisterVendor(
        agencySettings.agencyUrl,
        userdata,
      );
      success(response.data, agencySettings);
    } catch (e) {
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
        return error({ message: 'Not registered' }, agencySettings);
      }
      success(response.data, agencySettings);
    } catch (e) {
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
  }
};

export const getUserByWalletAddress =
  (agencyUrl, address, success, error) => async dispatch => {
    try {
      const response = await api.apiGetUserByWalletAddress(agencyUrl, address);
      if (response.status === 204) {
        return error();
      }
      setAuthData({userData: response.data})
      success(response.data, agencyUrl);
    } catch (e) {
      error(e);
    }
  };