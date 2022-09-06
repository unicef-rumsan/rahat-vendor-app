import React from 'react';
import {StyleSheet, Pressable} from 'react-native';

import {Spacing} from '../../constants';
import {RegularText} from '../../components';

export const IndividualSettingView = ({icon, title, onPress, style}) => (
  <Pressable style={[styles.rowView, style]} onPress={onPress}>
    {icon}
    <RegularText style={{paddingHorizontal: Spacing.hs}}>{title}</RegularText>
  </Pressable>
);

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.vs,
  },
});