import React from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';

import Routes from './src/navigation/Routes';
import {store, persistor} from './src/redux/store';

const App = () => {
  const netInfo = useNetInfo();
  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={netInfo.isConnected ? 'white' : 'red'}
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
