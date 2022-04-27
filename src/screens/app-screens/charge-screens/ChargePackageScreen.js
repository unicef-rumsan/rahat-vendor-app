import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar, StyleSheet, View, Image, Alert } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

import colors from '../../../../constants/colors';
import { FontSize, Spacing } from '../../../../constants/utils';
import {
  CustomHeader,
  Card,
  CustomButton,
  SmallText,
  CustomPopup,
  CustomLoader,
  SwitchAgencyModal,
} from '../../../components';
import { toggleSwitchAgencyModal, switchAgency, switchAgencyClearError } from '../../../redux/actions/agency';
import { RahatService } from '../../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const IndividualPackageDetail = ({ title, value }) => (
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
      style={{ width: widthPercentageToDP(30), textAlign: 'right' }}>
      {value}
    </SmallText>
  </View>
);

const ChargePackageScreen = ({ navigation, route }) => {
  const { packageDetail, beneficiaryPhone } = route.params;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { wallet } = useSelector(state => state.wallet);
  const { userData } = useSelector(
    state => state.auth,
  );

  const { switchingAgency, switchAgencyLoaderMessage, switchAgencyErrorMessage, activeAppSettings, appSettings, showSwitchAgencyModal, switchAgencyError } = useSelector(state => state.agency)


  const [values, setValues] = useState({
    isSubmitting: false,
    showPopup: false,
    popupType: '',
    messageType: '',
    message: '',
    loaderMessage: '',
    showLoader: false,
  });
  const {
    isSubmitting,
    message,
    messageType,
    popupType,
    showPopup,
    loaderMessage,
    showLoader,
  } = values;

  useEffect(() => {
    if (userData?.agencies[0]?.status === 'new') {
      setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: `${'Alert'}`,
        message: `${t('Your account has not been approved')}`,
      });
    }
  }, [activeAppSettings]);

  const onSubmit = async () => {
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Please wait')}`,
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
      navigation.navigate('VerifyOTPScreen', {
        phone: beneficiaryPhone,
        remarks: '',
        type: 'erc1155',
        packageDetail,
      });
    } catch (e) {
      setValues({ ...values, isSubmitting: false });
      alert(e);
    }
  };

  const handleSwitchAgency = agencyUrl => {

    const newActiveAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(
      switchAgency(
        newActiveAppSettings,
        wallet,
      ),
    );
  };
  return (
    <>
      <CustomHeader
        title={t('Charge Package')}
        onBackPress={() => navigation.pop()}
      />
      {switchAgencyError && (Alert.alert('Error', `${switchAgencyErrorMessage}`, [
        { text: "OK", onPress: () => dispatch(switchAgencyClearError()) }
      ]))}
      <CustomLoader show={isSubmitting} message={loaderMessage} />
      <CustomPopup
        message={message}
        messageType={messageType}
        show={showPopup}
        popupType={popupType}
        onConfirm={() =>
          messageType === `${t('Insufficient Balance')}`
            ? setValues({ ...values, showPopup: false })
            : navigation.navigate('HomeScreen')
        }
      />
      <SwitchAgencyModal
        agencies={appSettings}
        activeAgency={activeAppSettings}
        show={showSwitchAgencyModal}
        onPress={handleSwitchAgency}
        hide={() => dispatch(toggleSwitchAgencyModal(showSwitchAgencyModal))}
      />
      <CustomLoader show={showLoader} message={loaderMessage} />
      <View style={styles.container}>
        <SmallText
          style={{ fontSize: FontSize.small * 1.1 }}
          noPadding
          color={colors.gray}>
          {activeAppSettings.agency.name}
        </SmallText>

        <Card style={{ paddingVertical: Spacing.vs * 2 }}>
          <View style={{ alignItems: 'center', paddingBottom: Spacing.vs * 3 }}>
            {/* <PackageImageIcon /> */}
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
            title={t('Symbol')}
            value={packageDetail.symbol}
          />
          <IndividualPackageDetail
            title={t('Description')}
            value={packageDetail.description}
          />
          <IndividualPackageDetail
            title={t('Worth')}
            value={packageDetail.value}
          />
          <CustomButton
            title={t('Switch Agency')}
            width={widthPercentageToDP(80)}
            disabled={isSubmitting}
            outlined
            onPress={() => dispatch(toggleSwitchAgencyModal(showSwitchAgencyModal))}

          />
          <CustomButton
            title={t('Charge')}
            color={colors.green}
            width={widthPercentageToDP(80)}
            onPress={onSubmit}
          // isSubmitting={isSubmitting}
          // disabled={isSubmitting}
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
