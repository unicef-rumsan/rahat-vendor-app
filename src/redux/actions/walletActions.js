import {ethers} from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ERC1155_Service, TokenService} from '../../services/chain';
import * as api from '../api';
import { SET_WALLET_DATA } from '../actionTypes';

export const setWalletData = (payloadObj) => async dispatch => {
  dispatch({
    type: SET_WALLET_DATA, 
    payload: payloadObj
  });
};

export const getWallet =
  (type, onSuccess, onError, mnemonic, walletFromDrive) => async dispatch => {
    let wallet;
    if (type === 'create') {
      try {
        wallet = ethers.Wallet.createRandom();
      } catch (e) {
        onError(e.message);
        return;
      }
    }
    if (type === 'restoreUsingMnemonic') {
      try {
        wallet = ethers.Wallet.fromMnemonic(mnemonic);
      } catch (e) {
        onError(e.message);
        return;
      }
    }

    if (type === 'restoreUsingDrive') {
      wallet = walletFromDrive;
    }

    const walletInfo = {
      _isSigner: wallet._isSigner,
      mnemonic: wallet._mnemonic().phrase,
      privateKey: wallet._signingKey().privateKey,
      address: wallet.address,
    };

    dispatch(setWalletData({wallet, walletInfo}));
    onSuccess(wallet);
  };

export const restoreUsingDrive =
  (walletInfo, onSuccess, onError) => async dispatch => {
    try {
      let wallet;
      wallet = new ethers.Wallet(walletInfo.privateKey);

      dispatch(setWalletData({wallet, walletInfo}));
      onSuccess();
    } catch (e) {
      onError(e);
    }
  };

  export const getWalletBalance =
  (wallet,settings) => async dispatch => {
    try {

      let tokenBalance = await TokenService(
        settings?.agency?.contracts?.rahat,
        wallet,
        settings?.agency?.contracts?.rahat_erc20,
        settings?.agency?.contracts?.rahat_erc1155,
      ).getBalance(wallet.address);
      dispatch(setWalletData({tokenBalance: tokenBalance.toNumber()}))
    } catch (e) {
      // alert(e);
    }
  };

  export const getPackageBatchBalance =
  (
    agencyAddress,
    tokenAddress,
    nftAddress,
    wallet,
    vendor_address,
    tokenIds,
    success,
    isMounted,
  ) =>
  async dispatch => {
    try {
      const blnc = await ERC1155_Service(
        agencyAddress,
        tokenAddress,
        nftAddress,
        wallet,
      ).getBatchBalance(vendor_address, tokenIds);
      let tokenQtys = [];
      if (blnc?.length) {
        blnc.forEach((item, index) => {
          tokenQtys.push(item.toNumber());
        });
      }
      success(tokenIds,tokenQtys);
    } catch (e) {
      // alert(e);
      // error(e);
    }
  };

  export const getPackageBalanceInFiat =
  (tokenIds, tokenQtys, onSuccess, onError) => async dispatch => {
    try {
      const response = await api.apiGetPackageBalanceInFiat({
        tokenIds,
        tokenQtys,
      });
      dispatch(setWalletData({
        packageBalance: response?.data?.grandTotal,
        packageBalanceCurrency: response?.data?.currency,
      }));
      
      onSuccess && onSuccess(response?.data?.grandTotal, tokenIds, tokenQtys);
    } catch (e) {
      // alert(e);
      onError && onError();

      // error(e);
    }
  };
