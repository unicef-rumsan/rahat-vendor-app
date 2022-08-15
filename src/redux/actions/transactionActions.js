import { SET_TRANSACTION_DATA } from "../actionTypes";

export const setTransactionData = (payloadObj) => ({
  type: SET_TRANSACTION_DATA,
  payload: payloadObj
})
