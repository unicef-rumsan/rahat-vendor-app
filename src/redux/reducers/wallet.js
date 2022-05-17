const initialState = {
  wallet: [],
  walletInfo: null,
  tokenBalance: null,
  transactions: [],
  storedTokenIds: null,
  packages: [],
  packageBalance: null,
  packageBalanceCurrency: null,
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WALLET': {
      return {...state, wallet: action.wallet};
    }
    case 'SET_WALLET_INFO': {
      return {...state, walletInfo: action.payload};
    }
    case 'SET_TOKEN_BALANCE': {
      return {...state, tokenBalance: action.tokenBalance};
    }
    case 'SET_PACKAGES': {
      return {...state, packages: action.packages};
    }
    
    case 'SET_STORED_TOKEN_IDS': {
      return {...state, storedTokenIds: action.storedTokenIds};
    }

    case 'SET_PACKAGE_BALANCE': {
      return {
        ...state,
        packageBalance: action.packageBalance,
        packageBalanceCurrency: action.packageBalanceCurrency,
      };
    }   
    case 'SET_TRANSACTIONS': {
      return {
        ...state,
        transactions: action.transactions,
      };
    }

    default:
      return state;
  }
};

export default wallet;
