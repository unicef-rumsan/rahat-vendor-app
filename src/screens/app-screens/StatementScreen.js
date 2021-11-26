import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
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

  return (
    <>
      <CustomHeader title="Statement" onBackPress={() => navigation.pop()} />
      <View style={styles.container}>
        <Card>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <RegularText>Token Balance</RegularText>
            <RegularText color={colors.black}>{balance}</RegularText>
          </View>
        </Card>
        <Card>
          {transactions.map((item, index) => (
            <IndividualStatement
              key={index}
              title={
                item.type === 'charge'
                  ? `${item.type} to ${item.chargeTo}`
                  : 'Redeem token'
              }
              type={item.type}
              amount={item.amount}
              date={item.timeStamp}
              onPress={() =>
                navigation.navigate('ChargeReceiptScreen', {
                  receiptData: item,
                })
              }
            />
          ))}
        </Card>
      </View>
    </>
  );
};

export default StatementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
});
