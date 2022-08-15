import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { FontSize, Spacing, colors } from '../../constants';

export const PoppinsMedium = props => {
  const { t } = useTranslation();
  return (
    <Text
      {...props}
      style={[
        styles.text,
        {
          color: props.color || colors.black,
          fontSize: props.fontSize ? props.fontSize : FontSize.medium,
        },
        { ...props.style },
      ]}>
      {t(props.children)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingVertical: Spacing.vs / 2,
    fontFamily: 'Poppins-Medium',
  },
});
