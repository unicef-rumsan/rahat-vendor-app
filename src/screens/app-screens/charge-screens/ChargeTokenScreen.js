import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {AngleRightIcon, ChargeIcon, QRIcon} from '../../../../assets/icons';
import colors from '../../../../constants/colors';
import {FontSize, Spacing} from '../../../../constants/utils';
import {
  CustomHeader,
  Card,
  CustomButton,
  CustomTextInput,
  RegularText,
  SmallText,
  CustomPopup,
  CustomLoader,
  SwitchAgencyModal,
} from '../../../components';
import {switchAgency} from '../../../redux/actions/auth';
import {RahatService} from '../../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const ChargeTokenScreen = ({navigation, route}) => {
  const {tokenBalance, beneficiaryPhone} = route.params;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {wallet} = useSelector(state => state.wallet);
  const {appSettings, userData, activeAppSettings} = useSelector(
    state => state.auth,
  );
  const [values, setValues] = useState({
    amount: '',
    isSubmitting: false,
    remarks: '',
    showPopup: false,
    popupType: '',
    messageType: '',
    message: '',
    loaderMessage: '',
    showLoader: false,
    showSwitchAgencyModal: false,
    textInputErrorFlag: false,
  });
  const {
    amount,
    isSubmitting,
    remarks,
    message,
    messageType,
    popupType,
    showPopup,
    loaderMessage,
    showLoader,
    showSwitchAgencyModal,
    textInputErrorFlag,
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
    setValues({...values, isSubmitting: true});
    try {
      await RahatService(
        activeAppSettings.agency.contracts.rahat,
        wallet,
        activeAppSettings.agency.contracts.rahat_erc20,
        activeAppSettings.agency.contracts.rahat_erc1155,
      ).chargeCustomerERC20(beneficiaryPhone, amount);

      setValues({...values, isSubmitting: false});
      navigation.navigate('VerifyOTPScreen', {
        phone: beneficiaryPhone,
        amount: amount,
        remarks: remarks,
        type: 'erc20',
      });
    } catch (e) {
      console.log(e, 'error');
      alert(e);
      setValues({...values, isSubmitting: false});
    }
  };

  const handleSwitchAgency = agencyUrl => {
    setValues({
      ...values,
      showSwitchAgencyModal: false,
      showLoader: true,
      loaderMessage: `${t('Switching agency.')} ${t('Please wait...')}`,
    });
    const newActiveAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(
      switchAgency(
        newActiveAppSettings,
        wallet,
        onSwitchSuccess,
        onSwitchError,
      ),
    );
  };

  const onSwitchSuccess = newActiveAppSettings => {
    dispatch({type: 'SET_ACTIVE_APP_SETTINGS', payload: newActiveAppSettings});
    setValues({...values, showLoader: false, showSwitchAgencyModal: false});
  };
  const onSwitchError = e => {
    console.log(e, 'e');
    setValues({...values, showLoader: false, showSwitchAgencyModal: false});
  };

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

  return (
    <>
      <CustomHeader title={t('Charge')} onBackPress={() => navigation.pop()} />
      <CustomPopup
        message={message}
        messageType={messageType}
        show={showPopup}
        popupType={popupType}
        onConfirm={() =>
          messageType === `${t('Insufficient Balance')}`
            ? setValues({...values, showPopup: false})
            : navigation.navigate('HomeScreen')
        }
      />
      <SwitchAgencyModal
        agencies={appSettings}
        activeAgency={activeAppSettings}
        show={showSwitchAgencyModal}
        onPress={handleSwitchAgency}
        hide={() => setValues({...values, showSwitchAgencyModal: false})}
      />
      <CustomLoader show={showLoader} message={loaderMessage} />
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
            {t('Token Balance')}:
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
            editable={!isSubmitting}
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
            title={t('Switch Agency')}
            width={widthPercentageToDP(80)}
            disabled={isSubmitting}
            outlined
            onPress={() => setValues({...values, showSwitchAgencyModal: true})}
          />
          <CustomButton
            title={t('Charge')}
            color={colors.green}
            width={widthPercentageToDP(80)}
            onPress={onSubmit}
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
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
