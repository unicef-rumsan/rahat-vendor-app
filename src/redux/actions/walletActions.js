import { ethers } from 'ethers';
import { RahatService, TokenService } from '../../services/chain';
import { SET_WALLET_DATA } from '../actionTypes';

export const setWalletData = payloadObj => async dispatch => {
  dispatch({
    type: SET_WALLET_DATA,
    payload: payloadObj,
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

    dispatch(setWalletData({ wallet, walletInfo }));
    onSuccess(wallet);
  };

export const restoreUsingDrive =
  (walletInfo, onSuccess, onError) => async dispatch => {
    try {
      let wallet;
      wallet = new ethers.Wallet(walletInfo.privateKey);

      dispatch(setWalletData({ wallet, walletInfo }));
      onSuccess();
    } catch (e) {
      onError(e);
    }
  };

export const getWalletBalance = (wallet, settings) => async dispatch => {
  try {
    let tokenBalance = await TokenService(
      settings?.agency?.contracts?.rahat,
      wallet,
      settings?.agency?.contracts?.rahat_erc20,
    ).getBalance(wallet.address);
    dispatch(
      setWalletData({
        tokenBalance: tokenBalance.toNumber(),
      }),
    );
    // TODO: Implement this if we are using RAHAT contract everytime for token balance

    // let balances = await RahatService(
    //   settings?.agency?.contracts?.rahat,
    //   wallet,
    //   settings?.agency?.contracts?.rahat_erc20,
    //   settings?.agency?.contracts?.rahat_trigger
    // ).getVendorBalance(wallet.address);
    // console.log(balances);
    // dispatch(
    //   setWalletData({
    //     tokenBalance: balances.tokenBalance,
    //     cashBalance: balances.cashBalance,
    //     cashAllowance: balances.cashAllowance
    //   }),
    // );

  } catch (e) {
    // alert(e);
  }

};


export const getBalances = (wallet, settings) => async dispatch => {
  let { cashAllowance, cashBalance, vendorWalletContract } = await RahatService(
    settings?.agency?.contracts?.rahat,
    wallet,
    settings?.agency?.contracts?.rahat_erc20,
    settings?.agency?.contracts?.rahat_trigger
  ).getVendorBalance(wallet.address);
  console.log({ cashAllowance, cashBalance, vendorWalletContract })
  dispatch(
    setWalletData({
      cashBalance,
      cashAllowance,
      vendorWalletContract
    }),
  );
}
