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

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LandingScreen"
      screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
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
        component={RestoreMnemonicScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
