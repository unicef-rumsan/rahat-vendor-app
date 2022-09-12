import React from 'react';
import {useSelector} from 'react-redux';
import {StatusBar, StyleSheet, View, Platform, Pressable} from 'react-native';

import {AngleRightIcon} from '../../../../assets/icons';
import {FontSize, Spacing, colors} from '../../../constants';
import {CustomHeader, Card, RegularText, SmallText} from '../../../components';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}
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

const OfflineChargeScreen = ({navigation, route}) => {
  const {tokenBalance, beneficiaryPhone, pin} = route.params;

  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  return (
    <>
      <CustomHeader title={'Offline Charge'} hideBackButton />

      <View style={styles.container}>
        <SmallText style={{fontSize: FontSize.small * 1.1}} color={colors.gray}>
          {activeAppSettings?.agency?.name}
        </SmallText>
        <SmallText style={{fontSize: FontSize.small * 1.1}} color={colors.gray}>
          Charge To :
        </SmallText>
        <Pressable
          onPress={() => {
            navigation.navigate('OfflineChargeTokenScreen', {
              tokenBalance,
              beneficiaryPhone,
              pin,
            });
          }}>
          <Card style={styles.tokenDetailCard}>
            <RegularText
              color={colors.gray}
              style={{fontSize: FontSize.medium * 1.1}}>
              Token Balance:
            </RegularText>
            <AmountWithAngleBracket amount={tokenBalance} />
          </Card>
        </Pressable>
      </View>
    </>
  );
};

export default OfflineChargeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  tokenDetailCard: {
    paddingVertical: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
