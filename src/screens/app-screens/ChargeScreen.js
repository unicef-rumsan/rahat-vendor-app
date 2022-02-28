import React, {useEffect, useState} from 'react';
import {Keyboard, Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {QRIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  CustomHeader,
  Card,
  CustomButton,
  CustomTextInput,
  RegularText,
  SmallText,
  CustomPopup,
} from '../../components';
import CustomLoader from '../../components/CustomLoader';
import SwitchAgencyModal from '../../components/SwitchAgencyModal';
import {switchAgency} from '../../redux/actions/auth';
import {RahatService} from '../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const ChargeScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {wallet} = useSelector(state => state.wallet);
  const {appSettings, userData, activeAppSettings} = useSelector(
    state => state.auth,
  );

  const scanPhone = route?.params?.phone;
  const scanAmount = route?.params?.amount;

  const [values, setValues] = useState({
    phone: '',
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
  });
  const {
    phone,
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
  } = values;

  useEffect(() => {
    if (userData?.agencies[0]?.status === 'new') {
      setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: 'Alert',
        message: 'Your account has not been approved',
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
    });
  };

  const onSubmit = async () => {
    let tempPhone =
      scanPhone !== '' && scanPhone !== undefined && scanPhone !== null
        ? scanPhone
        : phone;
    let tempAmount =
      scanAmount !== 'null' && scanAmount !== undefined && scanAmount !== ''
        ? scanAmount
        : amount;

    if (tempPhone === '' || tempAmount === '') {
      alert('Phone number and amount are required');
      return;
    }

    if (tempAmount === '0') {
      return alert('Amount must be greater than or equal to 1');
    }

    Keyboard.dismiss();
    setValues({...values, isSubmitting: true});
    try {
      // const receipt =
      await RahatService(
        activeAppSettings.agency.contracts.rahat,
        wallet,
        activeAppSettings.agency.contracts.token,
      ).chargeCustomer(tempPhone, tempAmount);
      setValues({...values, isSubmitting: false});
      navigation.navigate('VerifyOTPScreen', {
        phone: tempPhone,
        amount: tempAmount,
        remarks: remarks,
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
      loaderMessage: 'Switching agency. Please wait...',
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

  return (
    <>
      <CustomHeader
        title="Charge"
        hideBackButton
        // onBackPress={() => navigation.pop()}
      />
      <CustomPopup
        message={message}
        messageType={messageType}
        show={showPopup}
        popupType={popupType}
        onConfirm={() => navigation.navigate('HomeScreen')}
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
        <SmallText noPadding color={colors.gray}>
          {activeAppSettings.agency.name}
        </SmallText>
        <Card style={{paddingVertical: Spacing.vs * 2}}>
          <RegularText
            color={colors.black}
            style={{paddingBottom: Spacing.vs, fontSize: FontSize.medium}}>
            Charge Customer :
          </RegularText>
          <View style={{flexDirection: 'row'}}>
            {/* {route?.params?.phone ? ( */}
            {scanPhone ? (
              <CustomTextInput
                placeholder="Customer Identifier"
                keyboardType="numeric"
                style={{width: widthPercentageToDP(64)}}
                // value={route?.params?.phone?.slice(4)}
                // value={scanPhone?.slice(4)}
                value={scanPhone}
                editable={false}
              />
            ) : (
              <CustomTextInput
                placeholder="Customer Identifier"
                keyboardType="phone-pad"
                style={{width: widthPercentageToDP(64)}}
                value={phone}
                onChangeText={value => handleTextChange(value, 'phone')}
              />
            )}
            <View style={styles.buttonContainer}>
              <View style={styles.buttonView}>
                <Pressable
                  style={styles.qrButton}
                  disabled={isSubmitting}
                  onPress={() =>
                    navigation.navigate('ScanScreen', {type: 'Charge'})
                  }
                  android_ripple={{
                    color: 'rgba(0,0,0, 0.1)',
                    borderless: false,
                  }}>
                  <QRIcon />
                </Pressable>
              </View>
            </View>
          </View>

          {scanAmount !== '' &&
          scanAmount !== 'null' &&
          scanAmount !== undefined ? (
            <CustomTextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={scanAmount}
              editable={false}
            />
          ) : (
            <CustomTextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={value => handleTextChange(value, 'amount')}
            />
          )}
          <CustomTextInput
            placeholder="Remarks"
            value={remarks}
            editable={!isSubmitting}
            onChangeText={value => handleTextChange(value, 'remarks')}
          />

          <SmallText
            style={{fontSize: FontSize.small / 1.4}}
            color={colors.lightGray}>
            Important: Please double check the phone number and amount before
            charging. Transactions cannot be reversed.
          </SmallText>

          <CustomButton
            title="Switch Agency"
            width={widthPercentageToDP(80)}
            disabled={isSubmitting}
            outlined
            onPress={() => setValues({...values, showSwitchAgencyModal: true})}
          />
          <CustomButton
            title="Charge"
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

export default ChargeScreen;

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
});
