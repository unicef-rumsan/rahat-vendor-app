import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  PoppinsMedium,
  CustomButton,
  CustomTextInput,
  RegularText,
  CustomHeader,
  Card,
} from '../../components';
import {RahatService} from '../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const VerifyOTPScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {wallet} = useSelector(state => state.wallet);
  const {activeAppSettings} = useSelector(state => state.auth);
  const {phone, remarks, type, packageDetail, amount} = route?.params;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeStamp, setTimeStamp] = useState('');

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      let timeElapsed = Date.now();
      let today = new Date(timeElapsed);
      setTimeStamp(today.toLocaleString());
    }

    return () => (mounted = false);
  }, []);

  const onSubmit = async () => {
    Keyboard.dismiss();
    // let tokenId = route.params?.tokenId;

    setIsSubmitting(true);
    if (otp === '') {
      alert(`${t("Please enter otp sent to customer's phone")}`);
      return;
    }
    try {
      const rahatService = RahatService(
        activeAppSettings.agency.contracts.rahat,
        wallet,
        activeAppSettings.agency.contracts.rahat_erc20,
        activeAppSettings.agency.contracts.rahat_erc1155,
      );

      let receipt;

      if (type === 'erc20') {
        receipt = await rahatService.verifyChargeForERC20(phone, otp);
      }

      if (type === 'erc1155') {
        receipt = await rahatService.verifyChargeForERC1155(
          phone,
          otp,
          packageDetail.tokenId,
        );
      }

      const receiptData = {
        timeStamp,
        transactionHash: receipt.transactionHash,
        to: receipt.to,
        status: 'success',
        chargeTo: phone,
        amount: type === 'erc20' ? amount : packageDetail.amount,
        transactionType: 'charge',
        balanceType: type === 'erc20' ? 'token' : 'package',
        packageName: packageDetail?.packageName || null,
        imageUri: packageDetail?.imageUri || null,
        tokenId: packageDetail?.tokenId || null,
        agencyUrl: activeAppSettings.agencyUrl,
        remarks,
      };
      RNToasty.Success({title: `${t('Success')}`, duration: 1});
      setIsSubmitting(false);
      navigation.replace('ChargeReceiptScreen', {
        receiptData,
        from: 'verifyOtp',
        packageDetail,
      });
    } catch (e) {
      console.log(e);
      alert(e);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CustomHeader title={t('Verify OTP')} hideBackButton />
      <View style={styles.container}>
        {/* <SafeAreaView style={styles.header}>
          <PoppinsMedium style={{fontSize: FontSize.large}}>
            Verify OTP
          </PoppinsMedium>
        </SafeAreaView> */}
        {/* <View
          style={{
            flex: 1,
            // justifyContent: 'space-between',
            // marginBottom: Spacing.vs * 3,
          }}> */}
        <Card>
          <RegularText
            fontSize={FontSize.medium}
            style={{paddingBottom: Spacing.vs}}>
            OTP from SMS (ask from customer)
          </RegularText>
          <CustomTextInput
            placeholder={t('Enter OTP')}
            keyboardType="numeric"
            onChangeText={setOtp}
            onSubmitEditing={onSubmit}
          />
          <CustomButton
            title={t('Verify')}
            color={colors.green}
            onPress={onSubmit}
            width={widthPercentageToDP(80)}
            isSubmitting={isSubmitting}
          />
        </Card>

        {/* </View> */}
      </View>
    </>
  );
};

export default VerifyOTPScreen;

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
