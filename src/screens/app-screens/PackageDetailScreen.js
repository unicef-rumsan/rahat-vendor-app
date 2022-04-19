import React from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar, StyleSheet, View, Image} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {PackageImageIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {CustomHeader, Card, SmallText} from '../../components';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const PackageDetailScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {packageDetail} = route?.params;

  const IndividualPackageDetail = ({title, value}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: Spacing.vs,
      }}>
      <SmallText noPadding color={colors.gray}>
        {title}
      </SmallText>
      <SmallText noPadding color={colors.blue}>
        {value}
      </SmallText>
    </View>
  );

  return (
    <>
      <CustomHeader title={t('Assets')} onBackPress={() => navigation.pop()} />

      <View style={styles.container}>
        <Card style={{paddingVertical: Spacing.vs * 2}}>
          <View style={{alignItems: 'center', paddingBottom: Spacing.vs * 3}}>
            <Image
              source={{
                uri: `https://ipfs.rumsan.com/ipfs/${packageDetail.imageUri}`,
              }}
              style={{
                height: heightPercentageToDP(15),
                width: widthPercentageToDP(30),
                borderRadius: 20,
              }}
            />
          </View>
          <IndividualPackageDetail
            title={t('Name')}
            value={packageDetail.name}
          />
          <IndividualPackageDetail
            title={t('Description')}
            value={packageDetail.description}
          />
          <IndividualPackageDetail
            title={t('Issued Quantity')}
            value={packageDetail.amount}
          />
          <IndividualPackageDetail
            title={t('Worth')}
            value={Number(packageDetail.value) * packageDetail.amount}
          />
        </Card>
      </View>
    </>
  );
};

export default PackageDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  header: {
    paddingTop: androidPadding,
    marginVertical: Spacing.vs,
    backgroundColor: colors.white,
  },
  buttonContainer: {
    marginHorizontal: Spacing.hs / 1.5,
    marginTop: Spacing.vs / 5,
  },
  buttonView: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  qrButton: {
    backgroundColor: colors.blue,
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenDetailCard: {
    paddingVertical: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
