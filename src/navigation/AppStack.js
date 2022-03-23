import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AboutScreen,
  AgencyScreen,
  BackupWalletScreen,
  ChargeReceiptScreen,
  ChargeScreen,
  CheckApprovalScreen,
  HomeScreen,
  LinkAgencyQRScreen,
  LinkAgencyCodeScreen,
  PasscodeScreen,
  PaymentMethodScreen,
  PaymentProcessScreen,
  ProfileScreen,
  ScanScreen,
  SettingsScreen,
  StatementScreen,
  TransferTokenScreen,
  VerifyOTPScreen,
  BackupMnemonicScreen,
} from '../screens/app-screens';
import colors from '../../constants/colors';
import {ChargeIcon, HomeIcon, SettingsIcon} from '../../assets/icons';
import RedeemScreen from '../screens/app-screens/RedeemScreen';
import RedeemReceiptScreen from '../screens/app-screens/RedeemReceiptScreen';
import LockScreen from '../screens/app-screens/LockScreen';
import { useSelector } from 'react-redux';
import TransferReceiptScreen from '../screens/app-screens/TransferRecieptScreen';

const TabStack = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const Tabs = () => {
  return (
    <TabStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {height: 65},
        unmountOnBlur: true,
      }}>
      <TabStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => {
            return <HomeIcon color={color} />;
          },
        }}
      />
      <TabStack.Screen
        name="ChargeScreen"
        component={ChargeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => {
            return <ChargeIcon color={color} />;
          },
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('ChargeScreen', {phone: null});
          },
        })}
      />
      <TabStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color, size}) => {
            return <SettingsIcon color={color} />;
          },
        }}
      />
    </TabStack.Navigator>
  );
};

const AppStack = () => {
  const {lockScreen} = useSelector(state => state.auth);
  return (
    <Stack.Navigator
      initialRouteName={'Tabs'}
      // initialRouteName={lockScreen ? 'LockScreen' : 'Tabs'}
      screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AgencyScreen" component={AgencyScreen} />
      <Stack.Screen name="LinkAgencyQRScreen" component={LinkAgencyQRScreen} />
      <Stack.Screen
        name="LinkAgencyCodeScreen"
        component={LinkAgencyCodeScreen}
      />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="BackupWalletScreen" component={BackupWalletScreen} />
      <Stack.Screen
        name="BackupMnemonicScreen"
        component={BackupMnemonicScreen}
      />
      <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
      <Stack.Screen name="ScanScreen" component={ScanScreen} />

      <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
      <Stack.Screen
        name="RedeemReceiptScreen"
        component={RedeemReceiptScreen}
      />

      <Stack.Screen
        name="ChargeReceiptScreen"
        component={ChargeReceiptScreen}
      />
      <Stack.Screen
        name="TransferTokenScreen"
        component={TransferTokenScreen}
      />
      <Stack.Screen
        name="TransferReceiptScreen"
        component={TransferReceiptScreen}
      />
      <Stack.Screen name="StatementScreen" component={StatementScreen} />
      <Stack.Screen
        name="CheckApprovalScreen"
        component={CheckApprovalScreen}
      />
      <Stack.Screen
        name="PaymentMethodScreen"
        component={PaymentMethodScreen}
      />
      <Stack.Screen
        name="PaymentProcessScreen"
        component={PaymentProcessScreen}
      />
      <Stack.Screen name="PasscodeScreen" component={PasscodeScreen} />
      <Stack.Screen name="LockScreen" component={LockScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
