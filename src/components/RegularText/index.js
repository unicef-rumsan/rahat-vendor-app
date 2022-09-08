import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {FontSize, colors} from '../../constants';

export const RegularText = props => {
  const {t} = useTranslation();
  return (
    <Text
      {...props}
      style={[
        styles.text,
        {
          color: props.color || colors.gray,
          textAlign: props.center ? 'center' : 'auto',
          fontSize: props.fontSize ? props.fontSize : FontSize.regular,
          ...props.style,
        },
      ]}>
      {t(props.children) || props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.regular,
    fontFamily: 'Poppins-Regular',
  },
});
