import {ethers} from 'ethers';
import {SET_APP_SETTINGS_DATA} from '../actionTypes';
import * as api from '../api';
import {setAuthData} from './authActions';
import {setWalletData} from './walletActions';

export const setAppSettings = payloadObj => ({
  type: SET_APP_SETTINGS_DATA,
  payload: payloadObj,
});

export const switchAgencyAction = payloadObj => async dispatch => {
  const {wallet, newAppSettings, onSwitchAgencySuccess, onSwitchAgencyError} =
    payloadObj;
  try {
    const response = await api.apiGetUserByWalletAddress(
      newAppSettings.agencyUrl,
      wallet.address,
    );

    if (response.status === 204) {
      return onError();
    }

    let provider = new ethers.providers.JsonRpcProvider(
      newAppSettings?.networkUrl,
    );
    let connectedWallet = wallet.connect(provider);

    dispatch(
      setAuthData({
        userData: response.data,
      }),
    );

    dispatch(
      setWalletData({
        wallet: connectedWallet,
        packages: [],
        packageBalance: 0,
        packageBalanceCurrency: '',
      }),
    );

    dispatch(
      setAppSettings({
        activeAppSettings: newAppSettings,
      }),
    );

    onSwitchAgencySuccess();
  } catch (e) {
    console.log(e);
    onSwitchAgencyError(e);
  }
};
