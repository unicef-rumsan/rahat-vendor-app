import React from 'react';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  HomeScreen,
  ScanScreen,
  LockScreen,
  AboutScreen,
  ChargeScreen,
  AssetsScreen,
  AgencyScreen,
  ProfileScreen,
  PasscodeScreen,
  SettingsScreen,
  StatementScreen,
  VerifyOTPScreen,
  LinkAgencyScreen,
  ChargeTokenScreen,
  RedeemTokenScreen,
  BackupWalletScreen,
  ChargeDrawerScreen,
  ChargeReceiptScreen,
  CheckApprovalScreen,
  PaymentMethodScreen,
  RedeemReceiptScreen,
  TransferTokenScreen,
  PaymentProcessScreen,
  BackupMnemonicScreen,
  TransferReceiptScreen,
  OfflineChargeTokenScreen,
  OfflineVerifyOTPScreen,
  OfflineChargeDrawerScreen,
  OfflineChargeScreen,
} from '../screens/app-screens';
import {Spacing, colors} from '../constants';
import {ChargeIcon, HomeIcon, AssetsIcon} from '../../assets/icons';
import {LoaderModal, PopupModal, SwitchAgencyModal} from '../components';
import {useNetInfo} from '@react-native-community/netinfo';

const TabStack = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const Tabs = () => {
  const netInfo = useNetInfo();
  const {t} = useTranslation();
  return (
    <>
      <TabStack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.blue,
          tabBarInactiveTintColor: colors.gray,
          tabBarStyle: {height: 55},
          unmountOnBlur: true,
          tabBarShowLabel: true,
          tabBarIconStyle: {
            marginTop: Spacing.vs / 4,
            marginBottom: 0,
            backgroundColor: 'black',
          },
          tabBarLabelStyle: {paddingBottom: Spacing.vs / 4, paddingTop: 0},
        }}>
        <TabStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: `${t('Home')}`,
            tabBarIcon: ({color, size}) => {
              return <HomeIcon color={color} />;
            },
          }}
        />
        <TabStack.Screen
          name="ChargeDrawerScreen"
          component={ChargeDrawerScreen}
          options={{
            tabBarLabel: `${t('Charge')}`,
            tabBarIcon: ({color}) => {
              return <ChargeIcon color={color} />;
            },
          }}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              if (netInfo.isConnected) {
                navigation.navigate('ChargeDrawerScreen', {phone: null});
              } else {
                navigation.navigate('OfflineChargeDrawerScreen', {phone: null});
              }
            },
          })}
        />
        <TabStack.Screen
          name="AssetsScreen"
          component={AssetsScreen}
          options={{
            tabBarLabel: `${t('Assets')}`,
            tabBarIcon: ({color}) => {
              return <AssetsIcon color={color} />;
            },
          }}
        />
      </TabStack.Navigator>
    </>
  );
};

const AppStack = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName={'Tabs'}
        screenOptions={{headerShown: false, animation: 'fade'}}>
        <Stack.Screen name="Tabs" component={Tabs} />
        {/* Offline */}
        <Stack.Screen
          name="OfflineChargeTokenScreen"
          component={OfflineChargeTokenScreen}
        />
        <Stack.Screen
          name="OfflineVerifyOTPScreen"
          component={OfflineVerifyOTPScreen}
        />
        <Stack.Screen
          name="OfflineChargeDrawerScreen"
          component={OfflineChargeDrawerScreen}
        />
        <Stack.Screen
          name="OfflineChargeScreen"
          component={OfflineChargeScreen}
        />
        {/* Offline */}
        <Stack.Screen name="ChargeScreen" component={ChargeScreen} />
        <Stack.Screen name="ChargeTokenScreen" component={ChargeTokenScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AgencyScreen" component={AgencyScreen} />
        <Stack.Screen name="LinkAgencyScreen" component={LinkAgencyScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen
          name="BackupWalletScreen"
          component={BackupWalletScreen}
        />
        <Stack.Screen
          name="BackupMnemonicScreen"
          component={BackupMnemonicScreen}
        />
        <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
        <Stack.Screen name="ScanScreen" component={ScanScreen} />
        <Stack.Screen name="RedeemTokenScreen" component={RedeemTokenScreen} />
        <Stack.Screen
          name="RedeemReceiptScreen"
          component={RedeemReceiptScreen}
        />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
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
      <LoaderModal />
      <PopupModal />
      <SwitchAgencyModal />
    </>
  );
};

export default AppStack;
