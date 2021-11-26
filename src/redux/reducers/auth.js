const initialState = {
  userData: null,
  appSettings: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERDATA':
      return {...state, userData: action.userData};

    case 'SET_APP_SETTINGS':
      return {...state, appSettings: action.appSettings};

    default:
      return state;
  }
};

export default auth;
