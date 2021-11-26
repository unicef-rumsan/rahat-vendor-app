import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {
  CustomHeader,
  CustomButton,
  CustomTextInput,
  RegularText,
} from '../../components';

const PaymentProcessScreen = ({navigation, route}) => {
  const {paymentMethod} = route.params;
  return (
    <>
      <CustomHeader
        title="Payment Process"
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <View>
          <View style={styles.inputContainer}>
            <RegularText>{paymentMethod} ID</RegularText>
            <CustomTextInput placeholder="Enter your ID" />
          </View>
          <View style={styles.inputContainer}>
            <RegularText>Amount</RegularText>
            <CustomTextInput placeholder="50000" />
          </View>
          <View style={styles.inputContainer}>
            <RegularText>Remarks</RegularText>
            <CustomTextInput placeholder="Remarks" />
          </View>
        </View>
        <CustomButton title="Redeem" onPress={() => navigation.pop()} />
      </View>
    </>
  );
};

export default PaymentProcessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    justifyContent: 'space-between',
    paddingBottom: Spacing.vs * 3,
  },
  inputContainer: {paddingTop: Spacing.vs},
});
