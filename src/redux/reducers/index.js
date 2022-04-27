import {combineReducers} from 'redux';
import auth from './auth';
import wallet from './wallet';
import agency from './agency';
const rootReducer = combineReducers({auth, wallet, agency});

export default rootReducer;
