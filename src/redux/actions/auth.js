import AsyncStorage from '@react-native-async-storage/async-storage';
import {ethers} from 'ethers';
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
      console.log(e.response);

      error(e);
    }
  };

export const storeUserData = data => async dispatch => {
  dispatch({type: 'SET_USERDATA', userData: data});
  // success && success();
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
export const switchAgency =
  (agencySettings, wallet, success, error) => async dispatch => {
    try {
      const response = await api.apiGetUserByWalletAddress(
        agencySettings.agencyUrl,
        wallet.address,
      );
      if (response.status === 204) {
        return error();
      }
      let provider = new ethers.providers.JsonRpcProvider(
        agencySettings?.networkUrl,
      );
      let connectedWallet = wallet.connect(provider);
      console.log(connectedWallet, 'connected wallet');
      dispatch({type: 'SET_USERDATA', userData: response.data});
      dispatch({type: 'SET_WALLET', wallet: connectedWallet});
      success(agencySettings);
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
        return error();
      }
      // dispatch({type: 'SET_USERDATA', userData: response.data});
      success(response.data, agencySettings);
    } catch (e) {
      console.log(e);
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
