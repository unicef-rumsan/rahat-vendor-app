import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {
  CustomHeader,
  Card,
  RegularText,
  IndividualStatement,
} from '../../components';

const StatementScreen = ({navigation, route}) => {
  const {balance, transactions} = route.params;
  const {t} = useTranslation();

  return (
    <>
      <CustomHeader
        title={t('Statement')}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <Card>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RegularText>{t('Token Balance')}</RegularText>
            <RegularText color={colors.black}>{balance}</RegularText>
          </View>
        </Card>
        <Card>
          {transactions?.map((item, index) => (
            <IndividualStatement
              lastItem={index === transactions.length - 1 ? true : false}
              key={index}
              balanceType={item?.balanceType}
              transactionType={item?.transactionType}
              icon={item?.packages ? item.packages[0]?.imageUri : item?.imageUri}
              title={
                item?.transactionType === 'charge'
                  ? `${item.transactionType} to ...${item.chargeTo?.slice(
                      item?.chargeTo?.length - 4,
                      item?.chargeTo?.length,
                    )}`
                  : item?.transactionType === 'transfer'
                  ? `${item.transactionType} to ...${item.to?.slice(
                      item?.to?.length - 4,
                      item?.to?.length,
                    )}`
                  : item?.transactionType === 'redeem' &&
                    item?.balanceType === 'package'
                  ? 'redeem package'
                  : 'redeem token'
              }
              amount={item?.amount}
              date={item?.timeStamp}
              onPress={() =>
                navigation.navigate(
                  item?.transactionType === 'charge'
                    ? 'ChargeReceiptScreen'
                    : item?.transactionType === 'transfer'
                    ? 'TransferReceiptScreen'
                    : 'RedeemReceiptScreen',
                  {
                    receiptData: item,
                  },
                )
              }
            />
          ))}
        </Card>
      </ScrollView>
    </>
  );
};

export default StatementScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
});
