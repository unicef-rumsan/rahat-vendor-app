import { SET_ACTIVE_LANGUAGE } from "../actionTypes"

export const setActiveLanguageAction = (payloadObj) => async dispatch => {
    dispatch({
        type: SET_ACTIVE_LANGUAGE, 
        payload: payloadObj
    })
}