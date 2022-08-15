import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FontSize, Spacing, colors } from '../../constants';

export const SmallText = props => {
  const { t } = useTranslation();
  return (
    <Text
      {...props}
      style={[
        styles.text,
        {
          color: props.color || colors.gray,
          textAlign: props.center ? 'center' : 'auto',
          paddingVertical: props.noPadding ? 0 : Spacing.vs / 2,
          ...props.style
        },
      ]}>
      {props?.exact ? props.children :  t(props.children) || props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.small,
    fontFamily: 'Poppins-Regular',
  },
});