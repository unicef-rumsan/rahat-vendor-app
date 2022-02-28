const initialState = {
  userData: null,
  appSettings: null,
  activeAppSettings: null,
  activeAgencyUrl: null,
  lockScreen: false,
  rahatPasscode: '',
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERDATA':
      return {...state, userData: action.userData};

    case 'SET_APP_SETTINGS':
      return {...state, appSettings: action.payload};

    case 'SET_ACTIVE_APP_SETTINGS':
      return {...state, activeAppSettings: action.payload};

    case 'SET_RAHAT_PASSCODE':
      return {
        ...state,
        lockScreen: true,
        rahatPasscode: action.passcode,
      };

    default:
      return state;
  }
};

export default auth;
