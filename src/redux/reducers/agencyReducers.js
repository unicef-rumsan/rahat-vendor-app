import {SET_APP_SETTINGS_DATA} from '../actionTypes';

const initialState = {
  appSettings: [],
  activeAppSettings: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_APP_SETTINGS_DATA:
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
};
