import React, {useState} from 'react';
import {View, Keyboard, Platform, StatusBar, StyleSheet} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {FontSize, Spacing, colors} from '../../../constants';
import {
  Card,
  PopupModal,
  RegularText,
  CustomButton,
  CustomHeader,
  CustomTextInput,
  LoaderModal,
} from '../../../components';
import {setTransactionData} from '../../../redux/actions/transactionActions';
import {setWalletData} from '../../../redux/actions/walletActions';
import {addTransaction} from '../../../providers/Transaction';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const OfflineVerifyOTPScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.walletReducer.wallet);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );
  const transactions = useSelector(
    state => state.transactionReducer.transactions,
  );

  const {phone, remarks, type, amount, pin} = route?.params;
  const [otp, setOtp] = useState('');

  const storeReceiptSuccess = receiptData => {
    LoaderModal.hide();
    RNToasty.Success({title: 'Success', duration: 1});
    navigation.replace('ChargeReceiptScreen', {
      receiptData,
    });
  };

  const storeReceiptData = receiptData => {
    let updatedPackageIds = [],
      updatedTransactions = [];
    if (transactions?.length) {
      updatedTransactions = [receiptData, ...transactions];
    } else {
      updatedTransactions = [receiptData];
    }

    dispatch(setWalletData({packageIds: updatedPackageIds}));
    dispatch(setTransactionData({transactions: updatedTransactions}));

    storeReceiptSuccess(receiptData);
  };

  const onSubmit = async () => {
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed);
    const ISODate = new Date().toISOString();
    Keyboard.dismiss();
    if (otp === '' || otp !== pin) {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Info',
        message: 'Please enter correct OTP',
      });
    }
    LoaderModal.show();
    try {
      let receiptData;
      // Enter transaction in realm
      const transactionPayload = {
        amount: Number(amount),
        created_at: ISODate,
        phone: Number(phone),
        pin,
        status: 'pending',
        txhash: '',
        vendor: wallet.address,
      };
      await addTransaction(transactionPayload);
      receiptData = {
        timeStamp: today.toLocaleString(),
        transactionHash: '',
        to: activeAppSettings.redeem_address,
        status: 'Pending',
        chargeTo: phone,
        amount: type === 'erc20' ? amount : 0,
        transactionType: 'charge',
        balanceType: type === 'erc20' ? 'token' : 'package',
        agencyUrl: activeAppSettings.agencyUrl,
        remarks,
      };
      storeReceiptData(receiptData);
    } catch (e) {
      alert(e);
      //TODO: Turn on for Production
      // LoaderModal.hide();
      // PopupModal.show({
      //   popupType: 'alert',
      //   message: 'Invalid  OTP. Please try again',
      //   messageType: 'Error',
      // });
    }
  };
  return (
    <>
      <CustomHeader title={'Offline Verify OTP'} hideBackButton />
      <View style={styles.container}>
        <Card>
          <RegularText
            fontSize={FontSize.bold}
            style={{paddingBottom: Spacing.vs, textAlign: 'center'}}>
            {`Phone Number: ${phone}`}
          </RegularText>
          <RegularText
            fontSize={FontSize.medium}
            style={{paddingBottom: Spacing.vs}}>
            {`OTP for Rs. ${amount} Transaction`}
          </RegularText>
          <CustomTextInput
            placeholder={'Enter OTP'}
            keyboardType="numeric"
            onChangeText={setOtp}
            onSubmitEditing={onSubmit}
          />
          <CustomButton
            title={'Verify'}
            color={colors.green}
            onPress={onSubmit}
            width={widthPercentageToDP(80)}
          />
        </Card>
      </View>
    </>
  );
};

export default OfflineVerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    paddingVertical: Spacing.vs * 1.5,
  },
  header: {
    paddingTop: androidPadding,
    marginVertical: Spacing.vs,
    backgroundColor: colors.white,
  },
});
