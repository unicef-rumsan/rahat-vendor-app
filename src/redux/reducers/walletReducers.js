import { SET_WALLET_DATA } from '../actionTypes';

const initialState = {
  wallet: null,
  walletInfo: null,
  vendorWalletContract: null,
  tokenBalance: null,
  cashBalance: null,
  cashAllowance: null,
  packageBalance: null,
  packageBalanceCurrency: null,
  packages: [],
  packageIds: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_WALLET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }

    default:
      return state;
  }
};
