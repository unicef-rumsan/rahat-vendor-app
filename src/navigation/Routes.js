import React, {useEffect, useState} from 'react';
import {View, Text, StatusBar, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import {useDispatch, useSelector} from 'react-redux';
import AppStack from './AppStack';
import {setWallet} from '../redux/actions/wallet';
import {ethers} from 'ethers';
import {getAppSettings, getUserByWalletAddress} from '../redux/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Logo} from '../../assets/images';
import colors from '../../constants/colors';

let NETWORK_URL = 'https://testnetwork.esatya.io';

const Routes = () => {
  const dispatch = useDispatch();
  const {userData, wallet} = useSelector(state => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    dispatch(getAppSettings());
    if (!wallet) {
      let provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
      AsyncStorage.getItem('walletInfo').then(walletInfo => {
        if (walletInfo !== null) {
          const temp = JSON.parse(walletInfo);
          const walletRandom = ethers.Wallet.fromMnemonic(temp.mnemonic);
          const connectedWallet = walletRandom.connect(provider);
          dispatch(setWallet(connectedWallet));
          dispatch(
            getUserByWalletAddress(
              temp.address,
              onGetUserSuccess,
              onGetUserError,
            ),
          );
        } else {
          setInitializing(false);
        }
      });
    }
  }, []);

  const onGetUserSuccess = () => {
    setInitializing(false);
  };
  const onGetUserError = e => {
    setInitializing(false);
  };

  if (initializing) {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <Logo />
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      </>
    );
  }
  return (
    <NavigationContainer>
      {userData === null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default Routes;
