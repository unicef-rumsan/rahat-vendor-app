import AsyncStorage from '@react-native-async-storage/async-storage';
import {ethers} from 'ethers';
import {getActiveAgencyTransactions} from '../../../constants/helper';
import * as api from '../api';

export const switchAgency = (agencySettings, wallet, success) => async dispatch => {
  try {
    dispatch({type: 'INITIATE_SWITCH_AGENCY'});
    const response = await api.apiGetUserByWalletAddress(
      agencySettings.agencyUrl,
      wallet.address,
    );
    if (response.status === 204) {
      dispatch({type: 'SWITCH_AGENCY_ERROR', payload: e});
      return;
    }
    let provider = new ethers.providers.JsonRpcProvider(
      agencySettings?.networkUrl,
    );
    let connectedWallet = wallet.connect(provider);

    const keys = ['transactions', 'storedTokenIds'];
    const storedData = await AsyncStorage.multiGet(keys);
    const storedTransactions = JSON.parse(storedData[0][1]);
    const storedTokenIds = JSON.parse(storedData[1][1]);

    let activeAgencyTransactions = [],
      activeAgencyStoredAssets = [];

    if (storedTransactions !== null) {
      activeAgencyTransactions = getActiveAgencyTransactions(
        agencySettings,
        storedTransactions,
      );
    }

    if (storedTokenIds !== null) {
      let filteredTokenIdsArray = storedTokenIds?.filter(
        item => item.agencyUrl === agencySettings?.agencyUrl,
      );
      activeAgencyStoredAssets = filteredTokenIdsArray?.length
        ? filteredTokenIdsArray
        : [];
    }
    dispatch({
      type: 'SET_TRANSACTIONS',
      transactions: activeAgencyTransactions,
    });
    dispatch({type: 'SET_USERDATA', userData: response.data});
    dispatch({type: 'SET_WALLET', wallet: connectedWallet});
    dispatch({
      type: 'SET_STORED_TOKEN_IDS',
      storedTokenIds: activeAgencyStoredAssets,
    });
    dispatch({type: 'SET_PACKAGES', packages: []});
    dispatch({
      type: 'SET_PACKAGE_BALANCE',
      packageBalance: 0,
      packageBalanceCurrency: '',
    });
    dispatch({type: 'SET_ACTIVE_APP_SETTINGS', payload: agencySettings});
    dispatch({type: 'TOGGLE_SWITCH_AGENCY_MODAL', payload: false});
    dispatch({type: 'SWITCH_AGENCY_SUCCESS'});
    success && success()
  } catch (e) {
    dispatch({type: 'SWITCH_AGENCY_ERROR', payload: e});
  }
};

export const setAppSettings =
  (appSettings, activeAppSettings) => async dispatch => {
    dispatch({type: 'SET_APP_SETTINGS', payload: appSettings});
    dispatch({type: 'SET_ACTIVE_APP_SETTINGS', payload: activeAppSettings});
  };

export const toggleSwitchAgencyModal = current => async dispatch => {
  dispatch({type: 'TOGGLE_SWITCH_AGENCY_MODAL', payload: !current});
};

export const switchAgencyClearError = () => async dispatch => {
  dispatch({type: 'SWITCH_AGENCY_CLEAR_ERROR'});
};
