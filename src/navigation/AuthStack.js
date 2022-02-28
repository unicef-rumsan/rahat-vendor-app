import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  GetStartedScreen,
  LandingScreen,
  RegisterSuccessScreen,
  RestoreAccountScreen,
  RestoreMnemonicScreen,
  SignupScreen,
} from '../screens/auth-screens';
import {LinkAgencyQRScreen} from '../screens/app-screens';
import LinkAgencyCodeScreen from '../screens/app-screens/LinkAgencyCodeScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LandingScreen"
      // initialRouteName="LinkAgencyQRScreen"
      screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen
        name="RegisterSuccessScreen"
        component={RegisterSuccessScreen}
      />
      <Stack.Screen name="LinkAgencyQRScreen" component={LinkAgencyQRScreen} />
      <Stack.Screen
        name="LinkAgencyCodeScreen"
        component={LinkAgencyCodeScreen}
      />

      <Stack.Screen
        name="RestoreAccountScreen"
        component={RestoreAccountScreen}
      />
      <Stack.Screen
        name="RestoreMnemonicScreen"
        component={RestoreMnemonicScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
