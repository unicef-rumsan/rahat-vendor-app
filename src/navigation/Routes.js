import React, {useEffect, useState} from 'react';
import {View, Text, StatusBar, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import {useDispatch, useSelector} from 'react-redux';
import AppStack from './AppStack';
import {getWalletBalance, setWallet} from '../redux/actions/wallet';
import {ethers} from 'ethers';
import {getAppSettings, getUserByWalletAddress} from '../redux/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Logo} from '../../assets/images';
import colors from '../../constants/colors';
import networkUrls from '../../constants/networkUrls';

// let TEST_NETWORK_URL = 'https://testnetwork.esatya.io';
// let PRODUCTION_NETWORK_URL = 'https://chain.esatya.io';

let NETWORK_URL =
  networkUrls.ENV === 'development'
    ? networkUrls.TEST_NETWORK_URL
    : networkUrls.PRODUCTION_NETWORK_URL;

const Routes = () => {
  const dispatch = useDispatch();
  const {userData, wallet, activeAgencyUrl} = useSelector(state => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // dispatch(getAppSettings());
    const keys = ['walletInfo', 'storedAppSettings'];

    if (!wallet) {
      AsyncStorage.multiGet(keys)
        .then(res => {
          const walletInfo = JSON.parse(res[0][1]);
          const storedAppSettings = JSON.parse(res[1][1]);

          if (walletInfo !== null) {
            let activeAppSetting = storedAppSettings[0];
            let provider = new ethers.providers.JsonRpcProvider(
              activeAppSetting?.networkUrl,
            );

            const walletRandom = new ethers.Wallet(
              walletInfo.privateKey,
              provider,
            );
            dispatch(setWallet(walletRandom));
            dispatch({
              type: 'SET_ACTIVE_APP_SETTINGS',
              payload: activeAppSetting,
            });
            dispatch({
              type: 'SET_APP_SETTINGS',
              payload: storedAppSettings,
            });
            dispatch(
              getUserByWalletAddress(
                activeAppSetting.agencyUrl,
                walletInfo.address,
                onGetUserSuccess,
                onGetUserError,
              ),
            );
          } else {
            setInitializing(false);
          }
        })
        .catch(e => {
          console.log(e, 'multi get error');
          setInitializing(false);
        });
    }

    // if (!wallet) {
    //   let provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
    //   AsyncStorage.getItem('walletInfo').then(walletInfo => {
    //     if (walletInfo !== null) {
    //       const temp = JSON.parse(walletInfo);
    //       const walletRandom = new ethers.Wallet(temp.privateKey, provider);
    //       dispatch(setWallet(walletRandom));
    //       dispatch(
    //         getUserByWalletAddress(
    //           temp.address,
    //           onGetUserSuccess,
    //           onGetUserError,
    //         ),
    //       );
    //     } else {
    //       setInitializing(false);
    //     }
    //   });
    // }
  }, []);

  const onGetUserSuccess = () => {
    AsyncStorage.getItem('passcode')
      .then(res => {
        if (res !== null) {
          dispatch({type: 'SET_RAHAT_PASSCODE', passcode: JSON.parse(res)});
          setInitializing(false);
        } else {
          setInitializing(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
    // setInitializing(false);
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
