const initialState = {
  wallet: [],
  balance: null,
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WALLET': {
      return {...state, wallet: action.wallet};
    }
    case 'SET_BALANCE': {
      return {...state, balance: action.balance};
    }

    default:
      return state;
  }
};

export default wallet;
