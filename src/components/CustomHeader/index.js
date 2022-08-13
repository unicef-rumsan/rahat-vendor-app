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
});
