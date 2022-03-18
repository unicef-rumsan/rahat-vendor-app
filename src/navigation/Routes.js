import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StatusBar, ActivityIndicator, AppState} from 'react-native';
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
import LockScreen from '../screens/app-screens/LockScreen';
import {useTranslation} from 'react-i18next';

const Routes = () => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const {
    userData,
    wallet,
    activeAgencyUrl,
    lockScreen,
    rahatPasscode,
    backupToDriveStatus,
  } = useSelector(state => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        rahatPasscode !== '' &&
          !backupToDriveStatus &&
          dispatch({type: 'LOCK_APP'});
      }
    });

    return () => {
      subscription.remove();
    };
  }, [rahatPasscode, backupToDriveStatus]);

  useEffect(() => {
    AsyncStorage.getItem('activeLanguage')
      .then(res => {
        console.log(res, "res")
        if (res !== null) {
          const activeLanguage = JSON.parse(res);
          i18n.changeLanguage(activeLanguage);
        }
      })
      .catch(e => {});
  }, []);

  useEffect(() => {
    // dispatch(getAppSettings());
    const keys = ['walletInfo', 'storedAppSettings', 'activeLanguage'];

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
            dispatch({type: 'SET_WALLET_INFO', payload: walletInfo});
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
      {userData === null && !lockScreen ? (
        <AuthStack />
      ) : userData !== null && lockScreen ? (
        <LockScreen />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default Routes;
