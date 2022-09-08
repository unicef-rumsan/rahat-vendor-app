import {combineReducers} from 'redux';

import authReducers from './authReducers';
import walletReducers from './walletReducers';
import agencyReducers from './agencyReducers';
import {persistReducer} from 'redux-persist';
import languageReducers from './languageReducers';
import transactionReducers from './transactionReducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['walletReducer', 'authReducer'],
};

const walletPersistConfig = {
  key: 'walletReducer',
  storage: AsyncStorage,
  blacklist: ['wallet'],
};

const authPersistConfig = {
  key: 'authReducer',
  storage: AsyncStorage,
  blacklist: ['initializing'],
};

const rootReducer = combineReducers({
  languageReducer: languageReducers,
  walletReducer: persistReducer(walletPersistConfig, walletReducers),
  agencyReducer: agencyReducers,
  transactionReducer: transactionReducers,
  authReducer: persistReducer(authPersistConfig, authReducers),
});

export default persistReducer(rootPersistConfig, rootReducer);

// export default rootReducer;
