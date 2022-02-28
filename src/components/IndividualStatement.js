import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {AngleRightIcon, DollorIcon, RedeemIcon} from '../../assets/icons';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import SmallText from './SmallText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IndividualStatement = ({
  title,
  type,
  amount,
  date,
  onPress,
  lastItem,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: widthPercentageToDP(80),
    }}>
    <View style={[styles.rowView, {paddingBottom: lastItem ? 0 : Spacing.vs}]}>
      {/* {type === 'charge' ? <DollorIcon /> : <RedeemIcon />} */}
      <MaterialCommunityIcons
        style={{paddingRight: Spacing.hs}}
        name={
          type === 'charge'
            ? 'currency-usd-circle'
            : type === 'transfer'
            ? 'bank-transfer'
            : 'gift-outline'
        }
        color={type === 'charge' ? colors.green : colors.blue}
        size={type === 'redeem' ? 28 : 32}
      />

      <View style={{width: widthPercentageToDP(40)}}>
        <RegularText fontSize={FontSize.medium}>{title}</RegularText>
        <SmallText noPadding color={colors.lightGray}>
          {date}
        </SmallText>
      </View>
    </View>
    <View style={[styles.rowView, {width: widthPercentageToDP(22)}]}>
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
    justifyContent: 'flex-end',
  },
});
