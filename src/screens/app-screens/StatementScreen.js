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
          {transactions.map((item, index) => (
            <IndividualStatement
              lastItem={index === transactions.length - 1 ? true : false}
              key={index}
              title={
                item.type === 'charge'
                  ? `${item.type} to ...${item.chargeTo?.slice(
                      item?.chargeTo?.length - 4,
                      item?.chargeTo?.length,
                    )}`
                  : item.type === 'transfer'
                  ? `${item.type} to ...${item.to?.slice(
                      item?.to?.length - 4,
                      item?.to?.length,
                    )}`
                  : 'redeem token'
              }
              type={item.type}
              amount={item.amount}
              date={item.timeStamp}
              onPress={() =>
                navigation.navigate(
                  item.type === 'charge'
                    ? 'ChargeReceiptScreen'
                    : item.type === 'transfer'
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
