import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import { AngleRightIcon, DollorIcon, RedeemIcon } from '../../assets/icons';
import colors from '../../constants/colors';
import { Spacing } from '../../constants/utils';
import RegularText from './RegularText';
import SmallText from './SmallText';

const IndividualStatement = ({title, type, amount, date, onPress}) => (
  <Pressable style={[styles.rowView, {paddingBottom: Spacing.vs}]} onPress={onPress}>
    {type === 'charge' ? <DollorIcon /> : <RedeemIcon />}
    <View>
      <RegularText>{title}</RegularText>
      <SmallText noPadding color={colors.lightGray}>
        {date}
      </SmallText>
    </View>
    <View style={styles.rowView}>
      <RegularText color={colors.blue} style={{paddingHorizontal: Spacing.hs}}>
        {amount}
      </RegularText>
      <AngleRightIcon />
    </View>
  </Pressable>
);
export default IndividualStatement;

const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
});
