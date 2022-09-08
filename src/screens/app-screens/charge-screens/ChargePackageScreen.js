import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {StatusBar, StyleSheet, View, Image} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

import {FontSize, Spacing, colors} from '../../../constants';
import {
  Card,
  SmallText,
  PopupModal,
  CustomButton,
  LoaderModal,
  CustomHeader,
  SwitchAgencyModal,
} from '../../../components';
import {RahatService} from '../../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

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
    <SmallText
      ellipsizeMode="tail"
      numberOfLines={2}
      noPadding
      color={colors.blue}
      style={{width: widthPercentageToDP(30), textAlign: 'right'}}>
      {value}
    </SmallText>
  </View>
);

const ChargePackageScreen = ({navigation, route}) => {
  const {packageDetail, beneficiaryPhone} = route.params;
  const {t} = useTranslation();
  const wallet = useSelector(state => state.walletReducer.wallet);
  const userData = useSelector(state => state.authReducer.userData);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  useEffect(() => {
    if (userData?.agencies[0]?.status === 'new') {
      return PopupModal.show({
        popupType: 'alert',
        messageType: `${'Alert'}`,
        message: `${t('Your account has not been approved')}`,
        onConfirm: () => {
          PopupModal.hide();
          navigation.navigate('HomeScreen');
        },
      });
    }
  }, [activeAppSettings]);

  const onSubmit = async () => {
    LoaderModal.show({
      message: 'Please wait...',
    });
    try {
      await RahatService(
        activeAppSettings.agency.contracts.rahat,
        wallet,
        activeAppSettings.agency.contracts.rahat_erc20,
        activeAppSettings.agency.contracts.rahat_erc1155,
      ).chargeCustomerERC1155(beneficiaryPhone, 1, packageDetail.tokenId);

      packageDetail.amount = 1;
      delete packageDetail.balance;
      LoaderModal.hide();
      navigation.navigate('VerifyOTPScreen', {
        phone: beneficiaryPhone,
        remarks: '',
        type: 'erc1155',
        packageDetail,
      });
    } catch (e) {
      LoaderModal.hide();
      // alert(e);
    }
  };

  const _onSwitchAgency = () => SwitchAgencyModal.show();

  return (
    <>
      <CustomHeader
        title={'Charge Package'}
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <SmallText
          style={{fontSize: FontSize.small * 1.1}}
          noPadding
          color={colors.gray}>
          {activeAppSettings.agency.name}
        </SmallText>

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
          <IndividualPackageDetail title={'Name'} value={packageDetail.name} />
          <IndividualPackageDetail
            title={'Symbol'}
            value={packageDetail.symbol}
          />
          <IndividualPackageDetail
            title={'Description'}
            value={packageDetail.description}
          />
          <IndividualPackageDetail
            title={'Worth'}
            value={packageDetail.value}
          />
          {/* <CustomButton
            title={'Switch Agency'}
            width={widthPercentageToDP(80)}
            outlined
            onPress={_onSwitchAgency}
          /> */}
          <CustomButton
            title={'Charge'}
            color={colors.green}
            width={widthPercentageToDP(80)}
            onPress={onSubmit}
          />
        </Card>
      </View>
    </>
  );
};

export default ChargePackageScreen;

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
