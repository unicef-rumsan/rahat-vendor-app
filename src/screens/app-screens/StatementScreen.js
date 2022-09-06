import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  Card,
  CustomHeader,
  RegularText,
  IndividualStatement,
} from '../../components';
import { Spacing, colors } from '../../constants';

const StatementScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);
  const transactions = useSelector(state => state.transactionReducer.transactions);

  return (
    <>
      <CustomHeader
        title={t('Statement')}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <RegularText>
              {'Token Balance'}
            </RegularText>

            <RegularText color={colors.black}>
              {tokenBalance}
            </RegularText>
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
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
});
