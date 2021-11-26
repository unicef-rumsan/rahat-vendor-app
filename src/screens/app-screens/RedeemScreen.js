import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {CustomHeader, Card, RegularText, SmallText} from '../../components';

const RedeemScreen = ({navigation, route}) => {
  const {agencyName} = route.params;
  return (
    <>
      <CustomHeader title={agencyName} hideBackButton />
      <View style={styles.container}>
        <RegularText color={colors.black} style={{paddingVertical: Spacing.vs}}>
          Redeem :
        </RegularText>
        <Card>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <SmallText>Token Balance</SmallText>
            <RegularText color={colors.black}>1,000,000</RegularText>
          </View>
        </Card>
      </View>
    </>
  );
};

export default RedeemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
});
