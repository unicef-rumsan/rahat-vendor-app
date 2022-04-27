import {ethers} from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ERC1155_Service, TokenService} from '../../services/chain';
import * as api from '../api';
// let TEST_NETWORK_URL = 'https://testnetwork.esatya.io';
// let PRODUCTION_NETWORK_URL = 'https://chain.esatya.io';

// import networkUrls from '../../../constants/networkUrls';

// let NETWORK_URL =
//   networkUrls.ENV === 'development'
//     ? networkUrls.TEST_NETWORK_URL
//     : networkUrls.PRODUCTION_NETWORK_URL;

export const getWallet =
  (type, onSuccess, onError, mnemonic, walletFromDrive) => async dispatch => {
    // let provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
    let wallet, connectedWallet;
    if (type === 'create') {
      try {
        wallet = ethers.Wallet.createRandom();

        // connectedWallet = wallet.connect(provider);
        // console.log(connectedWallet, "wallet")
      } catch (e) {
        onError(e.message);
        return;
      }
    }
    if (type === 'restoreUsingMnemonic') {
      try {
        wallet = ethers.Wallet.fromMnemonic(mnemonic);
        // connectedWallet = wallet.connect(provider);
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
      // provider: wallet.provider,
    };

    AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo))
      .then(() => {
        dispatch({
          type: 'SET_WALLET',
          wallet: wallet,
        });
        dispatch({
          type: 'SET_WALLET_INFO',
          payload: walletInfo,
        });
        onSuccess(wallet);
      })
      .catch(e => {
        onError(e);
        console.log('error:', e);
      });
  };

export const restoreUsingDrive =
  (walletInfo, onSuccess, onError) => async dispatch => {
    try {
      let wallet;
      wallet = new ethers.Wallet(walletInfo.privateKey);
      AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo))
        .then(() => {
          dispatch({
            type: 'SET_WALLET',
            wallet: wallet,
          });
          dispatch({
            type: 'SET_WALLET_INFO',
            payload: walletInfo,
          });
          onSuccess(wallet);
        })
        .catch(e => {
          onError(e);
        });
    } catch (e) {
      onError(e);
    }
  };

export const setWallet = wallet => async dispatch => {
  dispatch({type: 'SET_WALLET', wallet});
};

export const getWalletBalance =
  (agencyAddress, wallet, tokenAddress, nftAddress) => async dispatch => {
    try {
      let tokenBalance = await TokenService(
        agencyAddress,
        wallet,
        tokenAddress,
        nftAddress,
      ).getBalance(wallet.address);
      dispatch({type: 'SET_TOKEN_BALANCE', tokenBalance: tokenBalance.toNumber()});
      // success();
    } catch (e) {
      alert(e);
      // error(e);
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
      alert(e);
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
      dispatch({
        type: 'SET_PACKAGE_BALANCE',
        packageBalance: response?.data?.grandTotal,
        packageBalanceCurrency: response?.data?.currency,
      });
      onSuccess && onSuccess(response?.data?.grandTotal, tokenIds, tokenQtys);
    } catch (e) {
      alert(e);
      onError && onError();

      // error(e);
    }
  };
