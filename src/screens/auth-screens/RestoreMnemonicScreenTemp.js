import React, {useRef, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {
  SmallText,
  PopupModal,
  RegularText,
  LoaderModal,
  CustomHeader,
  CustomButton,
  CustomTextInput,
} from '../../components';
import {Spacing, colors} from '../../constants';
import {getWallet} from '../../redux/actions/walletActions';

let TOTAL_WORDS = 12;

const RestoreMnemonicScreen = ({navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [values, setValues] = useState('');

  const inputRef = useRef([]);

  const handleSubmit = () => {
    let mnemonic = '';
    if (values.split(' ').length < TOTAL_WORDS) {
      PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: 'Please fill all the 12 secret words',
      });
      return;
    }
    mnemonic = values.trim();

    // console.log('menmonic', mnemonic, values.split(' '));

    LoaderModal.show({
      message: 'Restoring your wallet. This might take a while, please wait...',
    });

    setTimeout(() => {
      dispatch(
        getWallet(
          'restoreUsingMnemonic',
          getWalletSuccess,
          handleError,
          mnemonic,
        ),
      );
    }, 200);
  };

  const handleError = e => {
    LoaderModal.hide();
    PopupModal.show({
      popupType: 'alert',
      messageType: 'Error',
      message: String(e),
    });
  };

  const getWalletSuccess = () => {
    LoaderModal.hide();
    navigation.navigate('LinkAgencyScreen', {from: 'restore'});
  };

  return (
    <>
      <CustomHeader
        title={'Restore wallet'}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.textView}>
          <RegularText>Please enter 12 word mnemonics</RegularText>
          <SmallText>One word in each box</SmallText>
        </View>

        <CustomTextInput
          label={`${t('Words')}`}
          placeholder={'Enter word'}
          onChangeText={text => setValues(text)}
          value={values}
          returnKeyType={
            values.split(' ').length === TOTAL_WORDS ? 'done' : 'next'
          }
          multiline={true}
          ref={inputRef}
          numberOfLines={3}
          autoCapitalize="none"
        />

        <View style={styles.buttonsView}>
          <CustomButton
            title={'Submit'}
            color={colors.green}
            onPress={handleSubmit}
          />
          <CustomButton
            outlined
            title={'Cancel'}
            color={colors.danger}
            onPress={() => navigation.pop()}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default RestoreMnemonicScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: Spacing.hs,
    paddingTop: Spacing.vs,
  },
  textView: {marginBottom: Spacing.vs},
  buttonsView: {marginBottom: Spacing.vs * 2},
});
