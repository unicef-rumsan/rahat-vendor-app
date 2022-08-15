import React, { useState } from 'react';
import { RNToasty } from 'react-native-toasty';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { useDispatch } from 'react-redux';

import { EyeIcon } from '../../../assets/icons';
import { FontSize, Spacing, colors } from '../../constants';
import {
  SmallText,
  RegularText,
  CustomButton,
  CustomHeader,
  PopupModal,
  LoaderModal,
} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { setRahatPasscode } from '../../redux/actions/authActions';
let CELL_COUNT = 4;

const PasscodeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isPasscodeVisible, setIsPasscodeVisible] = useState(false);
  const [isConfirmPasscodeVisible, setIsConfirmPasscodeVisible] =
    useState(false);

  const ref = useBlurOnFulfill({ passcode, cellCount: CELL_COUNT });
  const ref2 = useBlurOnFulfill({ confirmPasscode, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: passcode,
    setValue: setPasscode,
  });
  const [props2, getCellOnLayoutHandler2] = useClearByFocusCell({
    value: confirmPasscode,
    setValue: setConfirmPasscode,
  });

  const renderCell = (index, symbol, isFocused, type) => {
    let textChild = null;
    if (type === 'passcode') {
      if (symbol) {
        textChild = isPasscodeVisible ? symbol : '*';
      } else if (isFocused) {
        textChild = <Cursor />;
      }
    }
    if (type === 'confirmPasscode') {
      if (symbol) {
        textChild = isConfirmPasscodeVisible ? symbol : '*';
      } else if (isFocused) {
        textChild = <Cursor />;
      }
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={
          type === 'passcode'
            ? getCellOnLayoutHandler(index)
            : getCellOnLayoutHandler2(index)
        }>
        {textChild}
      </Text>
    );
  };

  const handleSetPasscode = () => {
    if (passcode !== confirmPasscode) {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Info',
        message: 'New and confirm passcode does not match',
      })
    }

    LoaderModal.show();

    dispatch(setRahatPasscode({rahatPasscode: passcode}));

    RNToasty.Show({title: 'Passcode setup successfully', duration: 1});

    navigation.navigate('HomeScreen');
  };

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
              {t('Rahat passcode can be used to')}:
            </RegularText>
            <SmallText>{t('Unlock Rahat Vendor App')}</SmallText>
          </View>
          <View style={styles.inputView}>
            <RegularText style={{ paddingVertical: Spacing.vs }}>
              {`${t('New')} ${'Rahat Passcode'}`}
            </RegularText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CodeField
                {...props}
                ref={ref}
                value={passcode}
                onChangeText={setPasscode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="password"
                // renderCell={renderCell}
                renderCell={({ index, symbol, isFocused }) =>
                  renderCell(index, symbol, isFocused, 'passcode')
                }
              />
              <Pressable
                hitSlop={30}
                style={{ paddingTop: Spacing.vs }}
                onPress={() =>
                  setIsPasscodeVisible(isPasscodeVisible => !isPasscodeVisible)
                }>
                <EyeIcon
                  color={isPasscodeVisible ? colors.blue : colors.lightGray}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.inputView}>
            <RegularText style={{ paddingVertical: Spacing.vs }}>
              {`${t('Confirm')} ${'Rahat Passcode'}`}
            </RegularText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CodeField
                {...props2}
                ref={ref2}
                value={confirmPasscode}
                onChangeText={setConfirmPasscode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="newPassword"
                renderCell={({ index, symbol, isFocused }) =>
                  renderCell(index, symbol, isFocused, 'confirmPasscode')
                }
              />
              <Pressable
                hitSlop={30}
                style={{ paddingTop: Spacing.vs }}
                onPress={() =>
                  setIsConfirmPasscodeVisible(
                    isConfirmPasscodeVisible => !isConfirmPasscodeVisible,
                  )
                }>
                <EyeIcon
                  color={
                    isConfirmPasscodeVisible ? colors.blue : colors.lightGray
                  }
                />
              </Pressable>
            </View>
          </View>
          {/* <View style={styles.inputView}>
            <RegularText style={{paddingVertical: Spacing.vs}}>
              Enter your 12 word seed phrase
            </RegularText>
            <CustomTextInput
              placeholder="Enter your 12 word seed phrase"
              onChangeText={text => setSeedPhrase(text)}
              // value={scanAmount}
              // editable={false}
            />
          </View> */}
        </View>
        <CustomButton
          title={t('Set Passcode')}
          disabled={
            confirmPasscode.length === 4 && passcode.length === 4 ? false : true
          }
          onPress={handleSetPasscode}
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
  otpInputs: { flexDirection: 'row', paddingBottom: Spacing.vs },
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
    marginRight: Spacing.hs / 3,
    paddingVertical: Spacing.vs / 1.2,
  },
  focusCell: {
    borderColor: colors.blue,
  },
  inputView: {
    paddingBottom: Spacing.vs,
  },
});