import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';

const RegularText = props => {
  return (
    <Text
      {...props}
      style={[
        styles.text,
        {
          color: props.color || colors.gray,
          textAlign: props.center ? 'center' : 'auto',
          fontSize: props.fontSize ? props.FontSize : FontSize.regular,
          ...props.style,
        },
      ]}>
      {props.children}
    </Text>
  );
};

export default RegularText;

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.regular,
    fontFamily: 'Poppins-Regular',
  },
});
