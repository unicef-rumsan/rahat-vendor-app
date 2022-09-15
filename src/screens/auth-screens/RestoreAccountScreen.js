import {useDispatch} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import {GOOGLE_WEB_CLIENT_ID} from 'react-native-dotenv';

import {
  SmallText,
  PopupModal,
  CustomButton,
  LoaderModal,
  PasscodeModal,
} from '../../components';
import {Logo} from '../../../assets/images';
import {colors, Spacing} from '../../constants';
import {decryptionHelper} from '../../helpers';
import {restoreUsingDrive} from '../../redux/actions/walletActions';

GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ],
  offlineAccess: true,
  webClientId: GOOGLE_WEB_CLIENT_ID || '',
});

const RestoreAccountScreen = ({navigation}) => {
  let gdrive = new GDrive();
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe = GoogleSignin.signOut();
    return () => {
      unsubscribe;
    };
  }, []);

  const [values, setValues] = useState({
    showPasscodeModal: false,
    passcode: '',
  });

  const {showPasscodeModal, passcode} = values;

  const onSuccess = () => {
    setValues({...values, showPasscodeModal: false});
    LoaderModal.hide();
    navigation.navigate('LinkAgencyScreen', {from: 'restore'});
  };

  const onError = e => {
    // let error = JSON.stringify(e);
    LoaderModal.hide();
    PopupModal.show({
      popupType: 'alert',
      messageType: 'Error',
      message: String(e),
    });
  };

  const handleRestoreWallet = async data => {
    LoaderModal.show({
      message: 'Restoring your wallet. Please wait...',
    });

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

      if (walletInfo) {
        dispatch(restoreUsingDrive(walletInfo, onSuccess, onError));
      } else {
        LoaderModal.hide();
        PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Invalid backup file',
        });
      }
    } catch (e) {
      alert(e);
      let errorMessage = e?.message || e?.error || '';
      if (
        e?.message ===
        'error:1e000065:Cipher functions:OPENSSL_internal:BAD_DECRYPT'
      ) {
        errorMessage = 'Invalid Passcode. Please try again';
      }
      LoaderModal.hide();
      PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: !!errorMessage
          ? errorMessage
          : 'Something went wrong. Please try again',
      });
    }
  };

  const initializeGDrive = async () => {
    LoaderModal.show({
      message: 'Checking your drive for backup files',
    });

    try {
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      gdrive.fetchTimeout = -1;
      let data = await gdrive.files.list({
        q: new ListQueryBuilder()
          .e('name', 'rahat_v2_backup')
          .and()
          .e('mimeType', 'application/octet-stream'),
      });
      if (!data?.files?.length) {
        LoaderModal.hide();
        PopupModal.show({
          popupType: 'alert',
          messageType: 'Info',
          message: 'Sorry, Your drive does not contain rahat backup file.',
        });
      }

      handleRestoreWallet(data);
    } catch (e) {
      alert(e);
      const errorMessage = e?.message || e?.error || '';
      LoaderModal.hide();
      PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: !!errorMessage
          ? errorMessage
          : 'Something went wrong. Please try again',
      });
    }
  };

  const googleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      initializeGDrive();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Signin Cancelled',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Play services not available',
        });
      } else {
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Something went wrong. Please try again',
        });
      }
    }
  };

  const onConfirmPasscode = () => {
    setValues({...values, showPasscodeModal: false});
    googleSignin();
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
        onConfirm={onConfirmPasscode}
      />
      <View style={styles.container}>
        <View />
        <View style={styles.content}>
          <Logo />
          <SmallText center style={styles.text}>
            Supporting vulnerable communities with a simple and efficient relief
            distribution platform.
          </SmallText>
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title={'RESTORE USING SEED PHRASE'}
            onPress={() => navigation.navigate('RestoreMnemonicScreen')}
          />
          <CustomButton
            title={'RESTORE USING GOOGLE DRIVE'}
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
  text: {paddingTop: Spacing.vs * 2},
  buttonContainer: {marginBottom: Spacing.vs * 2},
  content: {justifyContent: 'center', alignItems: 'center'},
});
