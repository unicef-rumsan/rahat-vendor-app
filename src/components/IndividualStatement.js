import React from 'react';
import {Pressable, StyleSheet, View, Image} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {AngleRightIcon} from '../../assets/icons';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import SmallText from './SmallText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const IndividualStatement = ({
  title,
  transactionType,
  amount,
  date,
  onPress,
  lastItem,
  balanceType,
  icon,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: widthPercentageToDP(80),
    }}>
    <View style={[styles.rowView, {paddingBottom: lastItem ? 0 : Spacing.vs}]}>
      {balanceType === 'package' ? (
        <Image
          source={{uri: `https://ipfs.rumsan.com/ipfs/${icon}`}}
          style={styles.packageIcon}
        />
      ) : (
        <MaterialCommunityIcons
          style={{paddingRight: Spacing.hs}}
          name={
            transactionType === 'charge'
              ? 'currency-usd-circle'
              : transactionType === 'transfer'
              ? 'bank-transfer'
              : 'gift-outline'
          }
          color={transactionType === 'charge' ? colors.green : colors.blue}
          size={transactionType === 'redeem' ? 28 : 32}
        />
      )}

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
  packageIcon: {
    height: heightPercentageToDP(5),
    width: widthPercentageToDP(9),
    borderRadius: 10,
    marginRight: Spacing.hs ,
  },
});
