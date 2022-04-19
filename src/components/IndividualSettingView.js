import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {Spacing} from '../../constants/utils';
import RegularText from './RegularText';

const IndividualSettingView = ({icon, title, onPress, style}) => (
  <Pressable style={[styles.rowView, style]} onPress={onPress}>
    {icon}
    <RegularText style={{paddingHorizontal: Spacing.hs}}>{title}</RegularText>
  </Pressable>
);

export default IndividualSettingView;

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.vs,
    // paddingHorizontal: Spacing.hs * 2,
  },
});
