import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar, StyleSheet, View, Pressable, Image} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {AngleRightIcon, RedeemIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {getCombinedPackages} from '../../../constants/helper';
import {FontSize, Spacing} from '../../../constants/utils';
import {CustomHeader, Card, RegularText, SmallText} from '../../components';
import IndividualPackageView from '../../components/IndividualPackageView';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const AssetsScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {packages, balance} = useSelector(state => state.wallet);

  return (
    <>
      <CustomHeader title={t('Assets')} hideBackButton />

      <View style={styles.container}>
        <Pressable onPress={() => navigation.navigate('ChargeTokenScreen')}>
          <Card style={styles.tokenDetailCard}>
            <RegularText
              color={colors.gray}
              style={{fontSize: FontSize.medium * 1.1}}>
              {t('Token Balance')}:
            </RegularText>
            <RegularText
              color={colors.gray}
              style={{
                fontSize: FontSize.medium * 1.1,
                paddingHorizontal: Spacing.hs,
              }}>
              {balance}
            </RegularText>
            {/* <AmountWithAngleBracket amount={10000} /> */}
          </Card>
        </Pressable>
        <Card style={{paddingVertical: Spacing.vs * 2}}>
          <RegularText
            color={colors.gray}
            style={{fontSize: FontSize.medium * 1.1}}>
            {t('Packages')}:
          </RegularText>
          {packages?.length === 0 && (
            <RegularText
              
              color={colors.gray}
              style={{fontSize: FontSize.medium, paddingTop: Spacing.vs}}>
              {t('Sorry, you do not have any packages')}
            </RegularText>
          )}
          {packages?.map((item, index) => (
            <IndividualPackageView
              key={index}
              icon={
                <Image
                  source={{
                    uri: `https://ipfs.rumsan.com/ipfs/${item.imageUri}`,
                  }}
                  style={styles.packageIcon}
                />
              }
              title={item.name}
              amount={item.amount}
              onPress={() =>
                navigation.navigate('PackageDetailScreen', {
                  packageDetail: item,
                })
              }
            />
          ))}
        </Card>
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
  individualPackageDetail: {
    paddingTop: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageIcon: {
    height: heightPercentageToDP(6),
    width: widthPercentageToDP(9),
    marginRight: Spacing.hs,
  },
});
