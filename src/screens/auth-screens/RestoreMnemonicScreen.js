import React, {useRef, useState, createRef, useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FontSize, Spacing} from '../../../constants/utils';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import SmallText from '../../components/SmallText';
import colors from '../../../constants/colors';
import {
  CustomHeader,
  RegularText,
  CustomTextInput,
  CustomPopup,
  CustomButton,
} from '../../components';
import {useDispatch} from 'react-redux';
import {getWallet} from '../../redux/actions/wallet';
import {getUserByWalletAddress} from '../../redux/actions/auth';
import CustomLoader from '../../components/CustomLoader';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

let TOTAL_WORDS = 12;

const RestoreMnemonicScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    showPopup: false,
    popupType: '', // can be alert or confirm
    messageType: '', // success or error or info
    popupMessage: '',
    isSubmitting: false,
    mnemonic: '',
  });

  const {
    showPopup,
    popupType,
    messageType,
    popupMessage,
    isSubmitting,
    mnemonic,
  } = values;

  const inputRef = useRef([]);

  useEffect(() => {
    if (isSubmitting) {
      setTimeout(() => {
        dispatch(
          getWallet(
            'restoreUsingMnemonic',
            getWalletSuccess,
            handleError,
            mnemonic.trim(),
          ),
        );
      }, 1000);
    }
  }, [isSubmitting]);

  const handleSubmit = () => {
    let temp = '';

    if (Object.keys(values).length < 6 + TOTAL_WORDS) {
      setValues({
        showPopup: true,
        popupType: 'alert',
        messageType: 'Info',
        popupMessage: `Please fill all the ${TOTAL_WORDS} secret words`,
      });
      return;
    }

    for (let i = 1; i <= TOTAL_WORDS; i++) {
      temp = `${temp} ${values[`word${i}`]}`;
    }
    setValues({...values, isSubmitting: true, mnemonic: temp});
  };

  const handleError = e => {
    console.log(e);
    alert(e);
    setValues({...values, isSubmitting: false});
  };

  const getWalletSuccess = wallet => {
    setValues({...values, isSubmitting: false});
    // dispatch(getUserByWalletAddress(wallet.address, () => {}, handleError));
    // navigation.navigate('LinkAgencyQRScreen', {fromRestore: true});
    navigation.navigate('LinkAgencyQRScreen', {from: 'restore'});
  };

  // const getUserSuccess = () => {
  //   console.log('success');
  // };

  return (
    <>
      <CustomHeader title="Restore" onBackPress={() => navigation.pop()} />
      <ScrollView style={styles.container}>
        <CustomPopup
          show={showPopup}
          hide={() => setValues({...values, showPopup: false})}
          popupType={popupType}
          messageType={messageType}
          message={popupMessage}
        />
        <CustomLoader
          show={isSubmitting}
          message="Restoring your wallet. This might take a while, please wait..."
        />
        <View style={styles.textView}>
          <RegularText>Please enter 12 word mnemonics</RegularText>
          <SmallText>One word in each box</SmallText>
        </View>

        {Array.from({length: 12}).map((_, index) => (
          <CustomTextInput
            key={index}
            placeholder={`Word ${index + 1}`}
            onChangeText={text =>
              setValues({
                ...values,
                [`word${index + 1}`]: text,
                errorFlag: false,
              })
            }
            returnKeyType={index + 1 === TOTAL_WORDS ? 'done' : 'next'}
            ref={el => (inputRef.current[index] = el)}
            onSubmitEditing={
              index + 1 < TOTAL_WORDS
                ? () => inputRef.current[index + 1].focus()
                : null
            }
            error={values[`word${index + 1}`] === '' ? 'Required' : null}
            blurOnSubmit={index + 1 === TOTAL_WORDS ? true : false}
            autoCapitalize="none"
          />
        ))}

        <View style={styles.buttonsView}>
          <CustomButton
            title="Submit"
            color={colors.green}
            onPress={handleSubmit}
            // isSubmitting={isSubmitting}
            disabled={isSubmitting}
          />
          <CustomButton
            disabled={!isSubmitting}
            title="Cancel"
            outlined
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
