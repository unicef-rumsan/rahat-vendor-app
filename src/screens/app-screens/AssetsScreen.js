import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StatusBar, StyleSheet, View, Pressable} from 'react-native';
import {FontSize, Spacing, colors} from '../../constants';
import {
  CustomHeader,
  Card,
  RegularText,
  // IndividualPackageView,
} from '../../components';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const AssetsScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);

  return (
    <>
      <CustomHeader title={'Assets'} hideBackButton />

      <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate('ChargeTokenScreen')}>
          <Card style={styles.tokenDetailCard}>
            <RegularText
              color={colors.gray}
              style={{fontSize: FontSize.medium * 1.1}}>
              Token Balance:
            </RegularText>
            <RegularText
              color={colors.gray}
              style={{
                fontSize: FontSize.medium * 1.1,
                paddingHorizontal: Spacing.hs,
              }}>
              {tokenBalance}
            </RegularText>
            {/* <AmountWithAngleBracket amount={10000} /> */}
          </Card>
        </Pressable>
      </View>
    </>
  );
};

export default AssetsScreen;

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
