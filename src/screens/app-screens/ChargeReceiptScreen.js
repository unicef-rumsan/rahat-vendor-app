import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';

import {CustomButton, CustomHeader, SmallText, Card} from '../../components';

const ChargeReceiptScreen = ({navigation, route}) => {
  const {receiptData, from} = route.params;
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

  const storeReceipt = async () => {
    try {
      const transactions = await AsyncStorage.getItem('transactions');
      if (transactions !== null) {
        const parsedTransaction = JSON.parse(transactions);
        const newTransactionArray = [receiptData, ...parsedTransaction];
        await AsyncStorage.setItem(
          'transactions',
          JSON.stringify(newTransactionArray),
        );
      }
      if (transactions === null) {
        const temp = [receiptData];
        await AsyncStorage.setItem('transactions', JSON.stringify(temp));
      }
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
    RNToasty.Show({title: 'Copied to clipboard', duration: 0});
  };

  return (
    <>
      <CustomHeader hideBackButton title="Charge Receipt" />
      <View style={styles.container}>
        <Card>
          <ChargeDetail
            title="Charge To"
            detail={receiptData.chargeTo}
            onPress={() => copyToClipboard(receiptData.chargeTo)}
          />
          <ChargeDetail
            title="Status"
            detail="Success"
            detailColor={colors.green}
          />
          <ChargeDetail
            title="To"
            detail={receiptData.to}
            detailColor={colors.blue}
            onPress={() => copyToClipboard(receiptData.to)}

          />

          <ChargeDetail title="Date" detail={receiptData.timeStamp} />
          <ChargeDetail title="Amount" detail={receiptData.amount} />
          {receiptData.remarks !== undefined && (
            <ChargeDetail
              title="Remarks"
              detail={receiptData.remarks === '' ? '-' : receiptData.remarks}
            />
          )}
        </Card>
        <CustomButton
          title="Back To Home"
          onPress={() => navigation.navigate('HomeScreen')}
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
