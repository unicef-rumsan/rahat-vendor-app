import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Logo} from '../../../assets/images';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {
  CustomButton,
  CustomLoader,
  CustomPopup,
  SmallText,
} from '../../components';
import {
  GDrive,
  ListQueryBuilder,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import {useDispatch} from 'react-redux';
import {restoreUsingDrive} from '../../redux/actions/wallet';
import {decryptionHelper} from '../../../constants/helper';
import {GOOGLE_WEB_CLIENT_ID} from '@env';
import {useTranslation} from 'react-i18next';
import PasscodeModal from '../../components/PasscodeModal';

GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ],
  offlineAccess: true,
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

const RestoreAccountScreen = ({navigation}) => {
  const {t} = useTranslation();
  let gdrive = new GDrive();
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe = GoogleSignin.signOut();
    return () => {
      unsubscribe;
    };
  }, []);

  const [values, setValues] = useState({
    showLoader: false,
    loaderMessage: '',
    showPopup: false,
    popupType: '',
    popupMessageType: '',
    popupMessage: '',
    showPasscodeModal: false,
    passcode: '',
  });

  const {
    showLoader,
    loaderMessage,
    popupMessage,
    popupMessageType,
    popupType,
    showPopup,
    showPasscodeModal,
    passcode,
  } = values;

  const onSuccess = () => {
    setValues({...values, showLoader: false, showPasscodeModal: false});
    navigation.navigate('LinkAgencyQRScreen', {from: 'restore'});
  };

  const onError = e => {
    console.log(e);
    let error = JSON.stringify(e);
    setValues(values => ({
      ...values,
      showLoader: false,
      showPopup: true,
      popupType: 'alert',
      popupMessageType: 'Error',
      popupMessage: error,
    }));
  };

  const handleRestoreWallet = async data => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: `${t('Restoring your wallet. Please wait...')}`,
    }));
    try {
      let binaryFileData, encryptedData;
      binaryFileData = await gdrive.files.getBinary(data.files[0].id);
      encryptedData = JSON.parse(
        String.fromCharCode.apply(null, binaryFileData),
      );
      const walletInfo = await decryptionHelper(
        encryptedData.cipher,
        encryptedData.iv,
        passcode,
      );
      dispatch(restoreUsingDrive(walletInfo, onSuccess, onError));
    } catch (e) {
      let errorMessage = '';
      if (
        e?.message ===
        'error:1e000065:Cipher functions:OPENSSL_internal:BAD_DECRYPT'
      ) {
        errorMessage = `${t('Invalid Passcode. Please try again')}`;
      }
      setValues(values => ({
        ...values,
        showLoader: false,
        showPasscodeModal: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: 'Error',
        popupMessage:
          errorMessage !== ''
            ? errorMessage
            : `${t('Something went wrong. Please try again')}`,
      }));
    }
  };

  const initializeGDrive = async () => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: `${t('Checking your drive for backup files')}`,
    }));
    try {
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      let data = await gdrive.files.list({
        q: new ListQueryBuilder()
          .e('name', 'rahat_backup')
          .and()
          .e('mimeType', 'application/octet-stream'),
      });
      if (data.files?.length === 0) {
        return setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupType: 'alert',
          popupMessageType: 'Info',
          popupMessage: `${t(
            'Sorry, Your drive does not contain rahat backup file.',
          )}`,
        }));
      }

      handleRestoreWallet(data);

      // handleBackupToDrive();
    } catch (e) {
      console.log(e);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: 'Error',
        popupMessage: `${t('Something went wrong. Please try again')}`,
      }));
    }
  };

  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      initializeGDrive();
    } catch (error) {
      console.log(error);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: 'Error',
      }));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setValues(values => ({
          ...values,
          popupMessage: `${t('Signin Cancelled')}`,
        }));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setValues(values => ({
          ...values,
          popupMessage: `${t('Play services not available')}`,
        }));
      } else {
        setValues(values => ({
          ...values,
          popupMessage: `${t('Something went wrong. Please try again')}`,
        }));
      }
    }
  };

  return (
    <>
      <PasscodeModal
        show={showPasscodeModal}
        title="Passcode"
        text="Enter 6 digit passcode to restore your wallet"
        buttonDisabled={passcode.length === 6 ? false : true}
        onChangeText={text => setValues({...values, passcode: text})}
        hide={() => setValues({...values, showPasscodeModal: false})}
        onConfirm={() => {
          setValues({...values, showPasscodeModal: false});
          googleSignin();
        }}
      />
      <View style={styles.container}>
        <CustomLoader show={showLoader} message={loaderMessage} />

        <CustomPopup
          show={showPopup}
          popupType={popupType}
          messageType={popupMessageType}
          message={popupMessage}
          onConfirm={() => setValues({...values, showPopup: false})}
        />

        <View />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Logo />
          <SmallText center style={{paddingTop: Spacing.vs * 2}}>
            {t(
              'Supporting vulnerable communities with a simple and efficient relief distribution platform.',
            )}
          </SmallText>
        </View>
        <View style={{marginBottom: Spacing.vs * 2}}>
          <CustomButton
            title={t('RESTORE USING SEED PHRASE')}
            onPress={() => navigation.navigate('RestoreMnemonicScreen')}
          />
          <CustomButton
            title={t('RESTORE USING GOOGLE DRIVE')}
            color={colors.green}
            onPress={() => setValues({...values, showPasscodeModal: true})}
          />
        </View>
      </View>
    </>
  );
};

export default RestoreAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    justifyContent: 'space-between',
  },
});
