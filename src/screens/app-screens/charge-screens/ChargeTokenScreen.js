import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {Keyboard, StatusBar, StyleSheet, View} from 'react-native';

import {AngleRightIcon} from '../../../../assets/icons';
import {FontSize, Spacing, colors} from '../../../constants';
import {
  Card,
  SmallText,
  PopupModal,
  LoaderModal,
  RegularText,
  CustomButton,
  CustomHeader,
  CustomTextInput,
  SwitchAgencyModal,
} from '../../../components';
import {RahatService} from '../../../services/chain';

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

const ChargeTokenScreen = ({navigation, route}) => {
  const {tokenBalance, beneficiaryPhone} = route.params;
  const {t} = useTranslation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const userData = useSelector(state => state.authReducer.userData);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const [values, setValues] = useState({
    amount: '',
    remarks: '',
    textInputErrorFlag: false,
  });
  const {amount, remarks, textInputErrorFlag} = values;

  useEffect(() => {
    if (userData?.agencies[0]?.status === 'new') {
      PopupModal.show({
        popupType: 'alert',
        messageType: 'Alert',
        message: 'Your account has not been approved',
        onConfirm: () => {
          PopupModal.hide();
          navigation.navigate('HomeScreen');
        },
      });
    }
  }, [activeAppSettings]);

  const handleTextChange = (value, name) => {
    let tempValue;
    if (name === 'amount') {
      tempValue = value.replace(/[^0-9]/g, '');
    } else {
      tempValue = value;
    }
    setValues({
      ...values,
      [name]: tempValue,
      textInputErrorFlag: 0,
    });
  };

  const onSubmit = async () => {
    if (amount === '' || amount > tokenBalance) {
      return setValues({...values, textInputErrorFlag: 1});
    }

    Keyboard.dismiss();
    LoaderModal.show({
      message: 'Please wait...',
    });
    try {
      await RahatService(
        activeAppSettings.agency.contracts.rahat,
        wallet,
        activeAppSettings.agency.contracts.rahat_erc20,
        activeAppSettings.agency.contracts.rahat_erc1155,
      ).chargeCustomerERC20(beneficiaryPhone, amount);

      setValues({...values, isSubmitting: false});
      LoaderModal.hide();

      navigation.navigate('VerifyOTPScreen', {
        phone: beneficiaryPhone,
        amount: amount,
        remarks: remarks,
        type: 'erc20',
      });
    } catch (e) {
      // alert(e);
      LoaderModal.hide();
    }
  };

  const _onSwitchAgency = () => SwitchAgencyModal.show();

  return (
    <>
      <CustomHeader title={t('Charge')} onBackPress={() => navigation.pop()} />

      <View style={styles.container}>
        <SmallText
          style={{fontSize: FontSize.small * 1.1}}
          noPadding
          color={colors.gray}>
          {activeAppSettings.agency.name}
        </SmallText>
        <Card style={styles.tokenDetailCard}>
          <RegularText
            color={colors.gray}
            style={{fontSize: FontSize.medium * 1.1}}>
            Token Balance :
          </RegularText>
          <AmountWithAngleBracket amount={tokenBalance} />
        </Card>
        <Card style={{paddingVertical: Spacing.vs * 2}}>
          <CustomTextInput
            placeholder={t('Enter amount')}
            keyboardType="numeric"
            value={amount}
            onChangeText={value => handleTextChange(value, 'amount')}
            error={
              textInputErrorFlag === 1 &&
              (amount === ''
                ? `${t('Amount')} ${t('is required')}`
                : `${t('Invalid amount')}`)
            }
          />
          <CustomTextInput
            placeholder={t('Remarks')}
            value={remarks}
            onChangeText={value => handleTextChange(value, 'remarks')}
          />
          <SmallText
            style={{fontSize: FontSize.small / 1.4}}
            color={colors.lightGray}>
            {t(
              'Important: Please double check the phone number and amount before charging. Transactions cannot be reversed.',
            )}
          </SmallText>
          {/* <CustomButton
            outlined
            title={'Switch Agency'}
            width={widthPercentageToDP(80)}
            onPress={_onSwitchAgency}
          /> */}
          <CustomButton
            onPress={onSubmit}
            title={'Charge'}
            color={colors.green}
            width={widthPercentageToDP(80)}
          />
        </Card>
      </View>
    </>
  );
};

export default ChargeTokenScreen;

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
