import React from 'react';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

import Routes from './src/navigation/Routes';
import { store, persistor } from './src/redux/store';


const App = () => {
  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={'white'}
      />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routes />
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
