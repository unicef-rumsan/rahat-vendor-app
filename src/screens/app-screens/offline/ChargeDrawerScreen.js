import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import {StyleSheet, View, Pressable} from 'react-native';
import {searchOTP} from '../../../providers/Otp';
import {searchTxn} from '../../../providers/Transaction';

import {
  SmallText,
  PopupModal,
  CustomButton,
  CustomHeader,
  CustomTextInput,
  CustomBottomSheet,
} from '../../../components';
import {QRIcon} from '../../../../assets/icons';
import {FontSize, Spacing, colors} from '../../../constants';

const OfflineChargeDrawerScreen = ({navigation, route}) => {
  const userData = useSelector(state => state.authReducer.userData);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const [phone, setPhone] = useState('');
  const [values, setValues] = useState({
    isSubmitting: false,
  });
  const {isSubmitting} = values;

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  useEffect(() => {
    const scanPhone = route?.params?.phone;
    if (scanPhone) {
      setPhone(scanPhone);
    }
  }, [route]);

  useEffect(() => {
    if (userData?.agencies[0]?.status === 'new') {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Alert',
        message: 'Your account has not been approved',
        onConfirm: () => {
          PopupModal.hide();
          navigation.navigate('HomeScreen');
        },
      });
    }
    bottomSheetModalRef.current?.present();
  }, [activeAppSettings]);

  const handleProceed = async () => {
    if (phone === '') {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Info',
        message: 'Please enter phone number',
      });
    }
    setValues(values => ({...values, isSubmitting: true}));
    try {
      // Get balance from offline realm
      const search = await searchOTP(phone);
      const foundTxn = await searchTxn(phone);
      let sum = 0;
      foundTxn.forEach(txn => {
        sum += txn.amount;
      });
      if (search.length > 0) {
        const balance = search[0]?.balance - sum;
        const pin = search[0]?.pin;
        const ward = search[0]?.ward || '';
        if (balance === 0) {
          setValues({...values, isSubmitting: false});
          return PopupModal.show({
            popupType: 'alert',
            messageType: 'Info',
            message: 'Insufficient fund',
          });
        }

        setValues({...values, isSubmitting: false});
        navigation.navigate('OfflineChargeTokenScreen', {
          tokenBalance: balance,
          beneficiaryPhone: phone,
          pin: pin,
          ward: ward,
          isQR: route?.params?.isQR || false,
        });
      } else {
        setValues({...values, isSubmitting: false});
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Info',
          message: 'Beneficiary not found',
        });
      }
    } catch (e) {
      setValues({...values, isSubmitting: false});
      alert(e);
    }
  };

  return (
    <>
      <CustomHeader title={'Offline Charge'} hideBackButton />

      <View style={styles.container}>
        <CustomBottomSheet
          enablePanDownToClose={false}
          disableBackdrop
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}>
          <SmallText
            color={colors.gray}
            style={{fontSize: FontSize.small * 1.1}}>
            {activeAppSettings.agency.name}
          </SmallText>
          <View style={{flexDirection: 'row'}}>
            <CustomTextInput
              placeholder={'Phone Number'}
              keyboardType="phone-pad"
              style={{width: widthPercentageToDP(75)}}
              value={phone}
              onChangeText={value => {
                setPhone(value);
              }}
              editable={!isSubmitting}
              onSubmitEditing={handleProceed}
            />
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
          <SmallText
            style={{fontSize: FontSize.small / 1.4}}
            color={colors.lightGray}>
            Important: Please double check the phone number and amount before
            charging. Transactions cannot be reversed.
          </SmallText>
          <CustomButton
            title={'Proceed'}
            color={colors.green}
            onPress={handleProceed}
            disabled={isSubmitting}
            width={widthPercentageToDP(90)}
            isSubmitting={isSubmitting}
          />
        </CustomBottomSheet>
      </View>
    </>
  );
};

export default OfflineChargeDrawerScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
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
