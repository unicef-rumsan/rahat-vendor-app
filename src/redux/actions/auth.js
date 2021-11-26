import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../api';

export const registerVendor = (userdata, success, error) => async dispatch => {
  try {
    const response = await api.apiRegisterVendor(userdata);
    success(response.data);
    console.log(response, "response")
  } catch (e) {
    error(e);
  }
};

export const storeUserData = data => async dispatch => {
  dispatch({type: 'SET_USERDATA', userData: data});
  // success && success();
};

export const getUserByWalletAddress =
  (address, success, error) => async dispatch => {
    try {
      const response = await api.apiGetUserByWalletAddress(address);
      dispatch({type: 'SET_USERDATA', userData: response.data});
      success(response.data);
    } catch (e) {
      console.log(e);
      error(e);
    }
  };

export const getAppSettings = () => async dispatch => {
  try {
    const response = await api.apiGetAppSettings();

    AsyncStorage.setItem('appSettings', JSON.stringify(response.data))
      .then(() => {
        dispatch({type: 'SET_APP_SETTINGS', appSettings: response.data});

        // onSuccess();
      })
      .catch(e => {
        // onError(e);
        console.log('error:', e);
      });
  } catch (e) {
    console.log(e.response);
  }
};
