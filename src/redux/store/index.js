import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import persistedReducer from '../reducers';
import { persistStore } from 'redux-persist';


export const store = createStore(persistedReducer, compose(applyMiddleware(thunk)));
export const persistor = persistStore(store);