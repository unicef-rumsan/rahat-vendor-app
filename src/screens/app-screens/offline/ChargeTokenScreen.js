import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {Keyboard, Platform, StatusBar, StyleSheet, View} from 'react-native';

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
} from '../../../components';

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

const OfflineChargeTokenScreen = ({navigation, route}) => {
  const {tokenBalance, beneficiaryPhone, pin, ward} = route.params;
  const {t} = useTranslation();

  const userData = useSelector(state => state.authReducer.userData);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const [values, setValues] = useState({
    amount: '',
    remarks: '',
    textInputErrorFlag: false,
  });
  const [warningMsg, setWarningMsg] = useState('');
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

  useEffect(() => {
    if (!userData?.ward) {
      setWarningMsg('Vendor has not been assigned to any ward');
    } else if (!ward) {
      setWarningMsg('Beneficiary has not been assigned to any ward');
    } else if (userData?.ward !== ward) {
      setWarningMsg("Vendor and Beneficiary ward doesn't match");
    }
    userData?.ward !== ward;
  }, [userData?.ward, ward]);

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
    if (amount === '' || amount > tokenBalance || amount < 1) {
      return setValues({...values, textInputErrorFlag: 1});
    }

    Keyboard.dismiss();
    LoaderModal.show({
      message: 'Please wait...',
    });
    try {
      setValues({...values, isSubmitting: false});
      LoaderModal.hide();
      navigation.navigate('OfflineVerifyOTPScreen', {
        pin,
        phone: beneficiaryPhone,
        amount: amount,
        remarks: remarks,
        type: 'erc20',
      });
    } catch (e) {
      LoaderModal.hide();
      alert(e);
    }
  };

  return (
    <>
      <CustomHeader
        title={t('Offline Charge')}
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <SmallText
          style={{fontSize: FontSize.small * 1.1}}
          noPadding
          color={colors.gray}>
          {activeAppSettings.agency.name}
        </SmallText>
        {warningMsg ? (
          <Card style={styles.tokenDetailCard}>
            <RegularText
              color={colors.yellow}
              style={{fontSize: FontSize.extraSmall}}>
              {warningMsg}
            </RegularText>
          </Card>
        ) : null}
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

export default OfflineChargeTokenScreen;

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
