import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {CustomButton, CustomHeader, SmallText, Card} from '../../components';

const TransferReceiptScreen = ({navigation, route}) => {
  const {receiptData} = route.params;
  const {t} = useTranslation();
  const TransferDetail = ({title, detail, detailColor, onPress}) => (
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


  const copyToClipboard = string => {
    Clipboard.setString(string);
    RNToasty.Show({title: `${t('Copied to clipboard')}`, duration: 0});
  };

  return (
    <>
      <CustomHeader hideBackButton title={t('Transfer Receipt')} />
      <View style={styles.container}>
        <Card>
          <TransferDetail
            title={t('Status')}
            detail={t('Success')}
            detailColor={colors.green}
          />
          <TransferDetail
            title={t('To')}
            detail={receiptData?.to}
            detailColor={colors.blue}
            onPress={() => copyToClipboard(receiptData?.to)}
          />

          <TransferDetail title={t('Date')} detail={receiptData?.timeStamp} />
          <TransferDetail title={t('Amount')} detail={receiptData?.amount} />
        </Card>
        <CustomButton
          title={t('Back To Home')}
          color={colors.green}
          onPress={() => navigation.navigate('HomeScreen', {refresh: true})}
        />
      </View>
    </>
  );
};

export default TransferReceiptScreen;

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
