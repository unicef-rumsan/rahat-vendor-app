import React from 'react';
import {StatusBar} from 'react-native';
import colors from './constants/colors';
import Routes from './src/navigation/Routes';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import 'react-native-get-random-values';
import '@ethersproject/shims';

const App = () => {
  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <Provider store={store}>
        <Routes />
      </Provider>
    </>
  );
};

export default App;
