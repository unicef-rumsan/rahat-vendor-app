const initialState = {
  wallet: [],
};

const wallet = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_WALLET': {
      return {...state, wallet: action.wallet};
    }

    default:
      return state;
  }
};

export default wallet;
