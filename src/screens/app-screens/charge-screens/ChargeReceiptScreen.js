import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import {useDispatch} from 'react-redux';
import colors from '../../../../constants/colors';
import {Spacing} from '../../../../constants/utils';

import {CustomButton, CustomHeader, SmallText, Card} from '../../../components';
const ChargeDetail = ({title, detail, detailColor, onPress}) => (
  <Pressable style={styles.chargeDetail} onPress={onPress}>
    <SmallText>{title}</SmallText>
    <SmallText
      ellipsizeMode="tail"
      numberOfLines={1}
      color={detailColor || colors.black}
      style={styles.detailText}>
      {detail}{' '}
    </SmallText>
  </Pressable>
);

const ChargeReceiptScreen = ({navigation, route}) => {
  const {receiptData, from, packageDetail} = route?.params;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [enableBackToHome, setEnableBackToHome] = useState(false);

  const storeReceipt = async () => {
    try {
      const transactions = await AsyncStorage.getItem('transactions');
      const storedPackages = await AsyncStorage.getItem('packages');
      if (transactions !== null && receiptData.balanceType === 'token') {
        const parsedTransaction = JSON.parse(transactions);
        const newTransactionArray = [receiptData, ...parsedTransaction];
        await AsyncStorage.setItem(
          'transactions',
          JSON.stringify(newTransactionArray),
        );
        dispatch({type: 'SET_TRANSACTIONS', transactions: newTransactionArray});
      }
      if (transactions === null && receiptData.balanceType === 'token') {
        const temp = [receiptData];
        await AsyncStorage.setItem('transactions', JSON.stringify(temp));
      }
      if (storedPackages !== null && receiptData.balanceType === 'package') {
        let parsedPackages = JSON.parse(storedPackages);
        let newPackagesArray = [];
        let objIndex = parsedPackages.findIndex(
          obj => obj?.tokenId === packageDetail.tokenId,
        );
        if (objIndex === -1) {
          newPackagesArray = [packageDetail, ...parsedPackages];
        }
        if (objIndex !== -1) {
          parsedPackages[objIndex].amount =
            parsedPackages[objIndex].amount + packageDetail.amount;
          newPackagesArray = parsedPackages;
        }
        await AsyncStorage.setItem(
          'packages',
          JSON.stringify(newPackagesArray),
        );
        dispatch({type: 'SET_PACKAGES', packages: newPackagesArray});
      }

      if (storedPackages === null && receiptData.balanceType === 'package') {
        const temp = [packageDetail];
        await AsyncStorage.setItem('packages', JSON.stringify(temp));
        dispatch({type: 'SET_PACKAGES', packages: temp});
      }
      setEnableBackToHome(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (from === 'verifyOtp') {
      storeReceipt();
    }
  }, []);

  const copyToClipboard = string => {
    Clipboard.setString(string);
    RNToasty.Show({title: `${t('Copied to clipboard')}`, duration: 0});
  };

  return (
    <>
      <CustomHeader hideBackButton title="Charge Receipt" />
      <View style={styles.container}>
        <Card>
          <ChargeDetail title={t('Type')} detail={receiptData?.balanceType} />
          {receiptData.packageName && (
            <ChargeDetail
              title={t('Package Name')}
              detail={receiptData?.packageName}
            />
          )}
          <ChargeDetail
            title={t('Charge To')}
            detail={receiptData?.chargeTo}
            onPress={() => copyToClipboard(receiptData?.chargeTo)}
          />
          <ChargeDetail
            title={t('Status')}
            detail={t('Success')}
            detailColor={colors.green}
          />
          <ChargeDetail
            title={t('To')}
            detail={receiptData?.to}
            detailColor={colors?.blue}
            onPress={() => copyToClipboard(receiptData?.to)}
          />

          <ChargeDetail title={t('Date')} detail={receiptData?.timeStamp} />
          <ChargeDetail title={t('Amount')} detail={receiptData?.amount} />
          {receiptData?.remarks !== undefined && (
            <ChargeDetail
              title={t('Remarks')}
              detail={receiptData?.remarks === '' ? '-' : receiptData?.remarks}
            />
          )}
        </Card>
        <CustomButton
          title={t('Back To Home')}
          disabled={!enableBackToHome}
          color={colors.green}
          onPress={() => navigation.navigate('HomeScreen', {refresh: true})}
        />
      </View>
    </>
  );
};

export default ChargeReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    justifyContent: 'space-between',
    paddingBottom: Spacing.vs * 3,
  },
  chargeDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: Spacing.vs / 3 ,
  },
  detailText: {width: wp(37), textAlign: 'right'},
});
