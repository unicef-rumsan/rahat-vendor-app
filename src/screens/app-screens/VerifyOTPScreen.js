import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { RNToasty } from 'react-native-toasty';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../constants/colors';
import { FontSize, Spacing } from '../../../constants/utils';
import {
  PoppinsMedium,
  CustomButton,
  CustomTextInput,
  RegularText,
  CustomHeader,
  Card,
  CustomLoader,
} from '../../components';
import { RahatService } from '../../services/chain';
let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const VerifyOTPScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { wallet, packages } = useSelector(state => state.wallet);
  const { activeAppSettings } = useSelector(state => state.agency);
  const { phone, remarks, type, packageDetail, amount } = route?.params;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storeReceiptSuccess = receiptData => {
    RNToasty.Success({ title: `${t('Success')}`, duration: 1 });
    setIsSubmitting(false);
    navigation.replace('ChargeReceiptScreen', {
      receiptData,
    });
  };
  const storeReceiptData = async receiptData => {
    try {
      let keys = [],
        transactions,
        storedTokenIds,
        finalTransactions = [],
        finalTokenIds = [];
      keys = ['transactions', 'storedTokenIds']
      response = await AsyncStorage.multiGet(keys);
      transactions = JSON.parse(response[0][1]);
      storedTokenIds = JSON.parse(response[1][1]);

      if (receiptData.balanceType === 'package') {
        if (storedTokenIds !== null && storedTokenIds?.length) {
          finalTokenIds = storedTokenIds.map((item) => {
            if (item.agencyUrl === activeAppSettings.agencyUrl) {
              !item.tokenIds.includes(packageDetail.tokenId) && item.tokenIds.push(packageDetail.tokenId)
            }
            return item
          })
        }
        else {
          finalTokenIds = [{ agencyUrl: activeAppSettings.agencyUrl, tokenIds: [packageDetail.tokenId] }]
        }
      }
    
      if (transactions !== null) {
        finalTransactions = [receiptData, ...transactions];
      } else {
        finalTransactions = [receiptData];
      }

      const firstPair = ['transactions', JSON.stringify(finalTransactions)];
      const secondPair = ['storedTokenIds', JSON.stringify(finalTokenIds)];
      await AsyncStorage.multiSet(
        [firstPair, secondPair]
      );
      dispatch({ type: 'SET_TRANSACTIONS', transactions: finalTransactions });
      dispatch({ type: 'SET_STORED_TOKEN_IDS', storedTokenIds : finalTokenIds });
      storeReceiptSuccess(receiptData);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async () => {
    let timeElapsed = Date.now();
    let today = new Date(timeElapsed);
    Keyboard.dismiss();
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

      let receipt, receiptData;

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

      receiptData = {
        timeStamp: today.toLocaleString(),
        transactionHash: receipt.transactionHash,
        to: receipt.to,
        status: 'success',
        chargeTo: phone,
        amount: type === 'erc20' ? amount : packageDetail.amount,
        transactionType: 'charge',
        balanceType: type === 'erc20' ? 'token' : 'package',
        agencyUrl: activeAppSettings.agencyUrl,
        remarks,
      };

      if (type === 'erc1155') {
        receiptData.packageName = packageDetail.name;
        receiptData.imageUri = packageDetail.imageUri;
        receiptData.tokenId = packageDetail.tokenId;
      }

      storeReceiptData(receiptData);

      // RNToasty.Success({title: `${t('Success')}`, duration: 1});
      // setIsSubmitting(false);
      // navigation.replace('ChargeReceiptScreen', {
      //   receiptData,
      //   from: 'verifyOtp',
      //   packageDetail,
      // });
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
        <CustomLoader show={isSubmitting} message={t('Please wait...')} />
        <Card>
          <RegularText
            fontSize={FontSize.medium}
            style={{ paddingBottom: Spacing.vs }}>
            {t('OTP from SMS (ask from customer)')}
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
          />
        </Card>
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
