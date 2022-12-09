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

const ChargeScreen = ({navigation, route}) => {
  const {tokenBalance, beneficiaryPhone, name} = route.params;
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  return (
    <>
      <CustomHeader title={'Charge'} hideBackButton />

      <View style={styles.container}>
        <SmallText style={{fontSize: FontSize.small * 1.1}} color={colors.gray}>
          {activeAppSettings?.agency?.name}
        </SmallText>
        <SmallText style={{fontSize: FontSize.small * 1.1}} color={colors.gray}>
          Charge To : {beneficiaryPhone}
        </SmallText>
        <Pressable
          onPress={() => {
            navigation.navigate('ChargeTokenScreen', {
              tokenBalance,
              beneficiaryPhone,
            });
          }}>
          <Card style={styles.tokenDetailCard}>
            <View>
              <View style={styles.cardItem}>
                <RegularText
                  color={colors.gray}
                  fontSize={FontSize.medium * 1.1}>
                  Name :
                </RegularText>
                <RegularText
                  color={colors.gray}
                  fontSize={FontSize.small * 1.1}
                  style={{textTransform: 'capitalize'}}>
                  {name}
                </RegularText>
              </View>
              <View style={styles.cardItem}>
                <RegularText
                  color={colors.gray}
                  style={{fontSize: FontSize.medium * 1.1}}>
                  Token Balance :
                </RegularText>
                <AmountWithAngleBracket amount={tokenBalance} />
              </View>
            </View>
          </Card>
        </Pressable>
      </View>
    </>
  );
};

export default ChargeScreen;

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
  cardItem: {flexDirection: 'row', justifyContent: 'space-between'},
});
