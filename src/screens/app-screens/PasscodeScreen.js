import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import CustomHeader from '../../components/CustomHeader';
import OtpInputs from 'react-native-otp-inputs';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {EyeIcon} from '../../../assets/icons';
import {RegularText, SmallText, CustomButton} from '../../components';

let PASSCODE_LENGTH = 4;

const PasscodeScreen = ({navigation}) => {
  const [values, setValues] = useState({
    isPascodeVisible: false,
    isConfirmPasscodeVisible: false,
    passcode: '',
    confirmPasscode: '',
  });

  const {
    passcode,
    confirmPasscode,
    isPascodeVisible,
    isConfirmPasscodeVisible,
  } = values;

  return (
    <>
      <CustomHeader
        title="Rahat Passcode"
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <View>
          <View style={styles.info}>
            <RegularText color={colors.black}>
              Rahat passcode can be used to:
            </RegularText>
            <SmallText>Unlock Rahat Vendor App</SmallText>
          </View>
          <RegularText style={{paddingVertical: Spacing.vs}}>
            New Rahat Passcode
          </RegularText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <OtpInputs
              handleChange={passcode => setValues({...values, passcode})}
              secureTextEntry={isPascodeVisible ? false : true}
              keyboardType={isPascodeVisible ? 'visible-password' : 'default'}
              caretHidden={true}
              style={styles.otpInputs}
              inputStyles={styles.inputStyles}
              numberOfInputs={PASSCODE_LENGTH}
            />
            <Pressable
              hitSlop={30}
              onPress={() =>
                setValues({...values, isPascodeVisible: !isPascodeVisible})
              }>
              <EyeIcon
                color={isPascodeVisible ? colors.blue : colors.lightGray}
              />
            </Pressable>
          </View>
          <SmallText style={{fontSize: FontSize.small / 1.1}}>
            Rahat passcode must not be part of mobile number
          </SmallText>
          <RegularText style={{paddingVertical: Spacing.vs}}>
            Confirm Rahat Passcode
          </RegularText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <OtpInputs
              handleChange={confirmPasscode =>
                setValues({...values, confirmPasscode})
              }
              secureTextEntry={isConfirmPasscodeVisible ? false : true}
              keyboardType={
                isConfirmPasscodeVisible ? 'visible-password' : 'default'
              }
              caretHidden={true}
              style={styles.otpInputs}
              inputStyles={styles.inputStyles}
              numberOfInputs={PASSCODE_LENGTH}
            />
            <Pressable
              hitSlop={30}
              onPress={() =>
                setValues({
                  ...values,
                  isConfirmPasscodeVisible: !isConfirmPasscodeVisible,
                })
              }>
              <EyeIcon
                color={
                  isConfirmPasscodeVisible ? colors.blue : colors.lightGray
                }
              />
            </Pressable>
          </View>
        </View>
        <CustomButton
          title="Set Passcode"
          disabled={
            confirmPasscode.length === 4 && passcode.length === 4 ? false : true
          }
        />
      </View>
    </>
  );
};

export default PasscodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    justifyContent: 'space-between',
    paddingBottom: Spacing.vs * 2,
  },
  inputStyles: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    // paddingRight: Spacing.hs,
    width: widthPercentageToDP(12),
    marginRight: Spacing.hs,
    fontSize: FontSize.large,
    textAlign: 'center',
  },
  otpInputs: {flexDirection: 'row', paddingBottom: Spacing.vs},
  info: {
    height: heightPercentageToDP(12),
    width: widthPercentageToDP(90),
    backgroundColor: 'rgba(250, 210, 2, 0.25)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(250, 210, 2, 1)',
    paddingHorizontal: Spacing.hs,
    justifyContent: 'center',
    marginVertical: Spacing.vs,
  },
});
