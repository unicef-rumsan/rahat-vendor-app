import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

import HomeScreen from '../screens/app-screens/HomeScreen';

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveBackgroundColor: 'white',
        tabBarInactiveBackgroundColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: '#0075AA',
        tabBarLabelPosition: 'below-icon',
        tabBarColor: 'white',
        tabBarHideOnKeyboard: true,
        unmountOnBlur,
        headerShown: false,
        tabBarStyle: {
          height: hp('8%'),
          paddingVertical: hp('1%'),
          position: 'relative',
        },
        tabBarLabelStyle: {
          fontSize: wp('4%'),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="home"
              color={focused ? '#0075AA' : 'black'}
              size={wp('6.5%')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Assets"
        component={HomeScreen}
        options={{
          tabBarLabel: 'assets',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="creditcard"
              color={focused ? '#0075AA' : 'black'}
              size={wp('6%')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={HomeScreen}
        options={{
          tabBarLabelStyle: {
            color: 'white',
          },
          tabBarIcon: ({focused}) => (
            <View style={styles.qrCode}>
              <AntDesign name="qrcode" color="white" size={wp('8%')} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DocVault"
        component={HomeScreen}
        options={{
          tabBarLabel: 'docvault',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="file1"
              color={focused ? '#0075AA' : 'black'}
              size={wp('6.5%')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={HomeScreen}
        options={{
          tabBarLabel: 'setting',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="setting"
              color={focused ? '#0075AA' : 'black'}
              size={wp('6.5%')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const styles = StyleSheet.create({
  qrCode: {
    backgroundColor: '#0075AA',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.8%'),
    borderRadius: wp('10%'),
    position: 'absolute',
    top: -20,
  },
});
