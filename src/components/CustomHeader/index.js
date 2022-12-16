import React from 'react';
import {
  Text,
  View,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {FontSize, Spacing} from '../../constants';
import HeaderBack from '../../../assets/icons/HeaderBack';
import {colors} from '../../constants';
import {REALM_APP_ID} from 'react-native-dotenv';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

export const CustomHeader = ({
  title,
  onBackPress,
  rightIcon,
  onRightIconPress,
  hideBackButton,
}) => {
  return (
    <SafeAreaView>
      <SafeAreaView style={styles.container}>
        {!hideBackButton ? (
          <Pressable onPress={onBackPress} hitSlop={20}>
            <HeaderBack />
          </Pressable>
        ) : (
          <View />
        )}
        <Text style={{fontFamily: 'Lora-Regular', fontSize: FontSize.regular}}>
          {title}
        </Text>
        {rightIcon ? (
          <Pressable onPress={onRightIconPress}>{rightIcon}</Pressable>
        ) : (
          <View />
        )}
      </SafeAreaView>
      <View style={REALM_APP_ID.includes('stage') ? styles.env : ''}>
        <Text style={styles.env_text}>Warning! This is test environment!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: androidPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.hs,
    alignItems: 'center',
    paddingVertical: Spacing.vs,
    marginTop: Spacing.vs,
  },
  env: {
    fontFamily: 'Lora-Regular',
    fontSize: FontSize.regular,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: colors.yellow,
  },
  env_text: {
    fontFamily: 'Lora-Regular',
    fontSize: FontSize.regular,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: colors.yellow,
    color: '#fff',
  },
});
