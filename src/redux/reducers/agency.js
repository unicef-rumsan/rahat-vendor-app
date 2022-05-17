const initialState = {
    appSettings: null,
    switchingAgency: false,
    activeAppSettings: null,
    switchAgencyError: false,
    showSwitchAgencyModal: false,
    switchAgencyErrorMessage: null,
    switchAgencyLoaderMessage: null,

};

const agency = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_APP_SETTINGS':
            return { ...state, appSettings: action.payload };

        case 'SET_ACTIVE_APP_SETTINGS':
            return { ...state, activeAppSettings: action.payload };

        case 'INITIATE_SWITCH_AGENCY':
            return { ...state, switchingAgency: true, switchAgencyLoaderMessage: 'Switching agency. Please wait...', showSwitchAgencyModal: false }

        case 'SWITCH_AGENCY_SUCCESS':
            return { ...state, switchingAgency: false, switchAgencyLoaderMessage: null }

        case 'SWITCH_AGENCY_ERROR':
            return { ...state, switchingAgency: false, switchAgencyLoaderMessage: null, switchAgencyErrorMessage: action.payload, switchAgencyError: true }

        case 'SWITCH_AGENCY_CLEAR_ERROR':
            return { ...state, switchAgencyErrorMessage: null, switchAgencyError: false, showSwitchAgencyModal: false }

        case 'TOGGLE_SWITCH_AGENCY_MODAL':
            return { ...state, showSwitchAgencyModal: action.payload }

        default:
            return state;
    }
};

export default agency;
