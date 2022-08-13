import { SET_ACTIVE_LANGUAGE } from "../actionTypes"

const initialState = {
    activeLanguage: {
        name: 'en',
        label: 'English',
        flagName: 'gb'
    }
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_ACTIVE_LANGUAGE:
            return { ...state, ...payload }

        default:
            return state
    }
}
