import {ethers} from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';

let NETWORK_URL = 'https://testnetwork.esatya.io';

export const getWallet =
  (type, onSuccess, onError, mnemonic) => async dispatch => {
    console.log(type, 'type');
    let provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
    console.log(provider, 'provider');
    let wallet, connectedWallet;
    if (type === 'create') {
      try {
        wallet = ethers.Wallet.createRandom();
        console.log(wallet, 'wallet ');

        connectedWallet = wallet.connect(provider);
      } catch (e) {
        onError(e.message);
        return;
      }
    }
    if (type === 'restoreUsingMnemonic') {
      try {
        wallet = ethers.Wallet.fromMnemonic(mnemonic);
        connectedWallet = wallet.connect(provider);
      } catch (e) {
        onError(e.message);
        return;
      }
    }
    const walletInfo = {
      _isSigner: wallet._isSigner,
      mnemonic: wallet._mnemonic().phrase,
      privateKey: wallet._signingKey().privateKey,
      address: wallet.address,
      provider: wallet.provider,
    };
    console.log(walletInfo);

    AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo))
      .then(() => {
        dispatch({
          type: 'SET_WALLET',
          wallet: connectedWallet,
        });
        onSuccess(connectedWallet);
      })
      .catch(e => {
        onError(e);
        console.log('error:', e);
      });
  };

export const setWallet = wallet => async dispatch => {
  dispatch({type: 'SET_WALLET', wallet});
};
