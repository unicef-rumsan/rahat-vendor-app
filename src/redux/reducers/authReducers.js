import { CLEAR_REGISTRATION_FORM_DATA, LOCK_APP, SET_AUTH_DATA, SET_RAHAT_PASSCODE, STORE_REGISTRATION_FORM_DATA, UNLOCK_APP, UPDATE_BACKINGUP_TO_DRIVE_STATUS } from "../actionTypes"

const initialState = {
  userData: null,
  lockScreen: false,
  rahatPasscode: '',
  initializing: true,
  registrationFormData: null,
  backingUpToDriveStatus: false,
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case SET_AUTH_DATA:
      return {
        ...state,
        ...payload,
        initializing: false
      }

    case STORE_REGISTRATION_FORM_DATA:
      return {
        ...state,
        ...payload,
      }

    case CLEAR_REGISTRATION_FORM_DATA:
      return {
        ...state,
        registrationFormData: null
      }

      case SET_RAHAT_PASSCODE:
        return {
          ...state,
          lockScreen: true,
          ...payload,
        };
      case UNLOCK_APP:
        return {
          ...state,
          lockScreen: false,
          ...payload,
        };
      case LOCK_APP:
        return {
          ...state,
          lockScreen: true,
          ...payload,
        };

      case UPDATE_BACKINGUP_TO_DRIVE_STATUS:
        return {
          ...state,
          ...payload,
        };

    default:
      return state
  }
}
