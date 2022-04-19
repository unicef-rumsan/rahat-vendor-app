import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import RegularText from './RegularText';
import {AngleRightIcon} from '../../assets/icons';
import {FontSize, Spacing} from '../../constants/utils';
import colors from '../../constants/colors';
import CheckBox from '@react-native-community/checkbox';

const AmountWithAngleBracket = ({amount}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <RegularText
      color={colors.blue}
      style={{
        fontSize: FontSize.medium * 1.1,
        paddingHorizontal: Spacing.hs / 2,
      }}>
      {amount}
    </RegularText>
    <AngleRightIcon />
  </View>
);

const IndividualPackageView = ({
  icon,
  title,
  amount,
  onPress,
  selectable,
  isSelected,
  onSelect,
}) => (
  <Pressable onPress={onPress}>
    <View style={styles.individualPackageDetail}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {selectable && (
          <CheckBox
            style={{marginRight: Spacing.hs / 2}}
            value={isSelected}
            onValueChange={value => onSelect(value)}
            tintColor={colors.blue}
            tintColors={{true: colors.blue, false: colors.gray}}
          />
        )}
        {icon}
        <RegularText
          color={colors.gray}
          style={{
            fontSize: FontSize.medium * 1.1,
            paddingHorizontal: Spacing.hs,
          }}>
          {title}
        </RegularText>
      </View>

      <AmountWithAngleBracket amount={amount} />
    </View>
  </Pressable>
);

export default IndividualPackageView;

const styles = StyleSheet.create({
  individualPackageDetail: {
    paddingTop: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
