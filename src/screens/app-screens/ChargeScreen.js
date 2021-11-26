import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
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
} from '../../components';
import {RahatService} from '../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const ChargeScreen = ({navigation, route}) => {
  const {wallet} = useSelector(state => state.wallet);
  const {appSettings} = useSelector(state => state.auth);

  const scanPhone = route?.params?.phone;
  const scanAmount = route?.params?.amount;

  const [values, setValues] = useState({
    phone: '',
    amount: '',
    isSubmitting: false,
    remarks: '',
  });
  const {phone, amount, isSubmitting, remarks} = values;

  useEffect(() => {
    navigation.addListener('blur', () => {
      navigation.setParams({
        phone: '',
        amount: '',
      });
    });
  }, []);

  useEffect(() => {
    // if (
    //   route?.params?.amount !== '' &&
    //   route?.params?.amount !== 'null' &&
    //   route?.params?.amount !== undefined
    // ) {
    //   onSubmit();
    // }
    if (
      scanAmount !== '' &&
      scanAmount !== 'null' &&
      scanAmount !== undefined
    ) {
      onSubmit();
    }
  }, [route]);

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
    // let tempPhone = route?.params?.phone?.slice(4) || phone;
    // let tempAmount =
    //   route?.params?.amount !== 'null' && route?.params?.amount !== undefined
    //     ? route?.params?.amount
    //     : amount;
    let tempPhone = scanPhone?.slice(4) || phone;
    let tempAmount =
      scanAmount !== 'null' && scanAmount !== undefined ? scanAmount : amount;

    if (tempPhone === '' || tempAmount === '') {
      alert('Phone number and amount are required');
      return;
    }

    Keyboard.dismiss();
    setValues({...values, isSubmitting: true});
    try {
      const receipt = await RahatService(
        appSettings.agency.contracts.rahat,
        wallet,
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

  return (
    <>
      <CustomHeader
        title="Charge"
        hideBackButton
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <Card>
          <SmallText noPadding color={colors.green}>
            Agency Name
          </SmallText>
          <RegularText
            color={colors.black}
            style={{paddingBottom: Spacing.vs, fontSize: FontSize.medium}}>
            Charge Customer :
          </RegularText>
          <View style={{flexDirection: 'row'}}>
            {/* {route?.params?.phone ? ( */}
            {scanPhone ? (
              <CustomTextInput
                placeholder="Phone Number"
                keyboardType="numeric"
                style={{width: widthPercentageToDP(64)}}
                // value={route?.params?.phone?.slice(4)}
                value={scanPhone?.slice(4)}
                editable={false}
              />
            ) : (
              <CustomTextInput
                placeholder="Phone Number"
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
          {/* {route?.params?.amount !== '' &&
          route?.params?.amount !== 'null' &&
          route?.params?.amount !== undefined ? ( */}
          {scanAmount !== '' &&
          scanAmount !== 'null' &&
          scanAmount !== undefined ? (
            <CustomTextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              // value={route?.params?.amount}
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
            onChangeText={value => handleTextChange(value, 'remarks')}
          />

          <SmallText style={{fontSize: FontSize.small / 1.2}}>
            Important: Please double check the phone number and amount before
            charging. Transactions cannot be reversed.
          </SmallText>

          <CustomButton
            title="Switch Agency"
            width={widthPercentageToDP(80)}
            disabled={isSubmitting}
            outlined
            // onPress={() => navigation.navigate('AgencyScreen')}
          />
          <CustomButton
            title="Charge"
            color={colors.green}
            width={widthPercentageToDP(80)}
            onPress={onSubmit}
            // onPress={() => navigation.navigate("ChargeReceiptScreen", {receipt: "asd"})}
            isSubmitting={isSubmitting}
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
