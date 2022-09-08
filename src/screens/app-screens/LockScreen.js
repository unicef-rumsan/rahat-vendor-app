import React, {useState} from 'react';
import {RNToasty} from 'react-native-toasty';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {FontSize, Spacing, colors} from '../../constants';
import {
  Cursor,
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  CustomButton,
  LoaderModal,
  PoppinsMedium,
  RegularText,
} from '../../components';
import {EyeIcon} from '../../../assets/icons';
import {unlockApp} from '../../redux/actions/authActions';

let CELL_COUNT = 4;

const LockScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const rahatPasscode = useSelector(state => state.authReducer.rahatPasscode);

  const [passcode, setPasscode] = useState('');
  const [isPasscodeVisible, setIsPasscodeVisible] = useState(false);

  const ref = useBlurOnFulfill({passcode, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: passcode,
    setValue: setPasscode,
  });

  const renderCell = (index, symbol, isFocused, type) => {
    let textChild = null;

    if (symbol) {
      textChild = isPasscodeVisible ? symbol : '*';
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const handleConfirm = async () => {
    if (passcode !== rahatPasscode) {
      return RNToasty.Error({
        title: 'Incorrect rahat passcode',
        duration: 1,
      });
    }
    dispatch(unlockApp());
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <PoppinsMedium
            color={colors.blue}
            fontSize={FontSize.xlarge}
            style={{textAlign: 'center'}}>
            Unlock your app
          </PoppinsMedium>
          <RegularText
            style={{paddingVertical: Spacing.vs, textAlign: 'center'}}>
            Please enter your Rahat passcode to unlock your app
          </RegularText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CodeField
              {...props}
              ref={ref}
              value={passcode}
              onChangeText={setPasscode}
              cellCount={CELL_COUNT}
              autoFocus
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="password"
              // renderCell={renderCell}
              renderCell={({index, symbol, isFocused}) =>
                renderCell(index, symbol, isFocused, 'passcode')
              }
            />
            <Pressable
              hitSlop={30}
              style={{paddingTop: Spacing.vs}}
              onPress={() =>
                setIsPasscodeVisible(isPasscodeVisible => !isPasscodeVisible)
              }>
              <EyeIcon
                color={isPasscodeVisible ? colors.blue : colors.lightGray}
              />
            </Pressable>
          </View>
          <View style={styles.buttonView}>
            <CustomButton
              title={'Confirm'}
              disabled={passcode.length === 4 ? false : true}
              onPress={handleConfirm}
            />
          </View>
          {/* <Pressable onPress={() => navigation.navigate("PasscodeScreen")}>
            <RegularText
              style={{paddingVertical: Spacing.vs, textAlign: 'center'}}
              color={colors.blue}>
              Reset Rahat Passcode
            </RegularText>
          </Pressable> */}
        </View>
      </View>
    </>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    justifyContent: 'center',
    paddingBottom: Spacing.vs * 2,
    paddingTop: Spacing.vs * 3,
  },
  inputStyles: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
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

  cell: {
    width: 50,
    height: 50,
    // lineHeight: 38,
    borderRadius: 10,
    fontSize: FontSize.medium * 1.1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    color: colors.blue,
    textAlign: 'center',
    marginRight: Spacing.hs / 2,
    paddingVertical: Spacing.vs / 1.2,
  },
  focusCell: {
    borderColor: colors.blue,
  },
  buttonView: {
    marginTop: Spacing.vs * 1.5,
  },
});
