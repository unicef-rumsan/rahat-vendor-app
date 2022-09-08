import {SET_TRANSACTION_DATA} from '../actionTypes';

const initialState = {
  transactions: null,
  transactionsWithActiveAgency: null,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_TRANSACTION_DATA:
      return {...state, ...payload};

    default:
      return state;
  }
};
