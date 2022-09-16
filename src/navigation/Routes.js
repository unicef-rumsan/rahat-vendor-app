import {ethers} from 'ethers';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {View, ActivityIndicator, AppState} from 'react-native';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {colors} from '../constants';
import {Logo} from '../../assets/images';
import LockScreen from '../screens/app-screens/LockScreen';
import {setWalletData} from '../redux/actions/walletActions';
import {lockApp, setAuthData} from '../redux/actions/authActions';

const Routes = () => {
  const dispatch = useDispatch();
  const {i18n} = useTranslation();

  const lockScreen = useSelector(state => state.authReducer.lockScreen);
  const rahatPasscode = useSelector(state => state.authReducer.rahatPasscode);
  const backingUpToDriveStatus = useSelector(
    state => state.authReducer.backingUpToDriveStatus,
  );

  const userData = useSelector(state => state.authReducer.userData);
  const walletInfo = useSelector(state => state.walletReducer.walletInfo);
  const initializing = useSelector(state => state.authReducer.initializing);
  const activeLanguage = useSelector(
    state => state.languageReducer.activeLanguage,
  );
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        !!rahatPasscode && !backingUpToDriveStatus && dispatch(lockApp());
      }
    });

    return () => {
      subscription.remove();
    };
  }, [rahatPasscode, backingUpToDriveStatus]);

  useEffect(() => {
    i18n.changeLanguage(activeLanguage?.name);
  }, [activeLanguage]);

  useEffect(() => {
    setAuthData({initializing: true});
    if (walletInfo) {
      const provider = new ethers.providers.JsonRpcProvider(
        activeAppSettings?.networkUrl,
      );

      const temp = new ethers.Wallet(walletInfo.privateKey);
      const connectedWallet = temp.connect(provider);
      dispatch(setWalletData({wallet: connectedWallet}));
      dispatch(setAuthData());
      return;
    }
    dispatch(setAuthData());
  }, []);

  if (initializing) {
    return (
      <>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Logo />
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      </>
    );
  }
  return (
    <>
      <NavigationContainer>
        {userData === null && !lockScreen ? (
          <AuthStack />
        ) : userData !== null && lockScreen ? (
          <LockScreen />
        ) : (
          <AppStack />
        )}
      </NavigationContainer>
    </>
  );
};

export default Routes;
