import React from 'react';
import {useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  GetStartedScreen,
  LandingScreen,
  RegisterSuccessScreen,
  RestoreAccountScreen,
  // RestoreMnemonicScreen,
  ResoreMnemonicScreenTemp,
  SignupScreen,
} from '../screens/auth-screens';
import {PopupModal} from '../components';
import {LinkAgencyScreen} from '../screens/app-screens';
import {LoaderModal} from '../components';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  let initialRouteName = 'LandingScreen';
  const walletInfo = useSelector(state => state.walletReducer.walletInfo);
  const registrationFormData = useSelector(
    state => state.authReducer.registrationFormData,
  );

  if (walletInfo && registrationFormData) {
    initialRouteName = 'LinkAgencyScreen';
  }

  return (
    <>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="LinkAgencyScreen" component={LinkAgencyScreen} />
        <Stack.Screen
          name="RegisterSuccessScreen"
          component={RegisterSuccessScreen}
        />

        <Stack.Screen
          name="RestoreAccountScreen"
          component={RestoreAccountScreen}
        />
        <Stack.Screen
          name="RestoreMnemonicScreen"
          component={ResoreMnemonicScreenTemp}
        />
      </Stack.Navigator>
      <LoaderModal />
      <PopupModal />
    </>
  );
};

export default AuthStack;
