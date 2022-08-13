import React from 'react';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import {Pressable, StyleSheet, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import {Spacing, colors} from '../../constants';
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
        {detail}
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
            title={'Status'}
            detail={'Success'}
            detailColor={colors.green}
          />
          <TransferDetail
            title={'To'}
            detail={receiptData?.to}
            detailColor={colors.blue}
            onPress={() => copyToClipboard(receiptData?.to)}
          />

          <TransferDetail title={'Date'} detail={receiptData?.timeStamp} />
          <TransferDetail title={'Amount'} detail={receiptData?.amount} />
        </Card>
        <CustomButton
          title={'Back To Home'}
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
