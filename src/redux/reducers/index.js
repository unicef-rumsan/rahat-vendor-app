import {combineReducers} from 'redux';
import auth from './auth';
import wallet from './wallet';
const rootReducer = combineReducers({auth, wallet});

export default rootReducer;
