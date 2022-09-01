import React, {useEffect, useState} from 'react';
import {GOOGLE_WEB_CLIENT_ID} from 'react-native-dotenv';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, ScrollView, Keyboard} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
  ListQueryBuilder,
} from '@robinbobin/react-native-google-drive-api-wrapper';

import {
  SmallText,
  RegularText,
  CustomButton,
  CustomHeader,
  PasscodeModal,
  LoaderModal,
  PopupModal,
} from '../../components';
import {encryptionHelper} from '../../helpers';
import {Spacing, colors} from '../../constants';
import {updateBackingupToDriveStatus} from '../../redux/actions/authActions';

GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ],
  offlineAccess: true,
  webClientId: GOOGLE_WEB_CLIENT_ID || '',
});
console.log({GOOGLE_WEB_CLIENT_ID});
const BackupWalletScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  let gdrive = new GDrive();
  const walletInfo = useSelector(state => state.walletReducer.walletInfo);

  const [values, setValues] = useState({
    showPasscodeModal: false,
    passcode: '',
  });

  const {showPasscodeModal, passcode} = values;

  useEffect(() => {
    GoogleSignin.signOut();
  }, []);

  const handleBackupToDrive = async () => {
    LoaderModal.show({
      message: 'Encrypting your wallet. Please wait...',
    });

    try {
      let encryptedData = await encryptionHelper(walletInfo, passcode);
      if (encryptedData.cipher) {
        await gdrive.files
          .newMultipartUploader()
          .setData(JSON.stringify(encryptedData), MimeTypes.BINARY)
          .setRequestBody({
            name: 'rahat_v2_backup',
          })
          .execute();
        LoaderModal.hide();
        PopupModal.show({
          popupType: 'alert',
          messageType: 'Success',
          message: 'Wallet backed up to your google drive successfully',
        });
      }
    } catch (e) {
      LoaderModal.hide();
      PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: 'Something went wrong. Please try again',
      });
    }
  };

  const initializeGDrive = async () => {
    LoaderModal.show({
      message: 'Checking your drive for backup',
    });
    try {
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      let data = await gdrive.files.list({
        q: new ListQueryBuilder()
          .e('name', 'rahat_v2_backup')
          .and()
          .e('mimeType', 'application/octet-stream'),
      });
      if (data.files?.length !== 0) {
        LoaderModal.hide();
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Info',
          message: 'Your wallet is already backed up in your google drive',
        });
      }
      handleBackupToDrive();
    } catch (e) {
      LoaderModal.hide();
      PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: 'Something went wrong. Please try again',
      });
    }
  };

  const googleSignin = async () => {
    dispatch(updateBackingupToDriveStatus({backingUpToDriveStatus: true}));

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      initializeGDrive();
    } catch (error) {
      dispatch(updateBackingupToDriveStatus({backingUpToDriveStatus: false}));
      LoaderModal.hide();

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Signin Cancelled',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Play services not available',
        });
      } else {
        PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Something went wrong. Please try again',
        });
      }
    }
  };

  const handleSetupPasscode = text => {
    setValues({...values, passcode: text});
    text.length === 6 && Keyboard.dismiss();
  };

  return (
    <>
      <CustomHeader
        title={'Backup Wallet'}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <PasscodeModal
          show={showPasscodeModal}
          title={t('Setup Passcode')}
          text={t(
            'You will need this 6 digit passcode to restore your wallet using google drive',
          )}
          buttonDisabled={passcode.length === 6 ? false : true}
          onChangeText={handleSetupPasscode}
          hide={() => setValues({...values, showPasscodeModal: false})}
          onConfirm={() => {
            setValues({...values, showPasscodeModal: false});
            googleSignin();
          }}
        />

        <View style={styles.aboutView}>
          <RegularText style={{paddingBottom: Spacing.vs / 2}}>
            {t('Backup your wallet')}
          </RegularText>
          <SmallText color={colors.danger} noPadding>
            {t('Important! Read very carefully')}
          </SmallText>
          <SmallText noPadding style={styles.description}>
            {t(
              "For the privacy and security, this application never sends any of your private key and wallet information to our or any of our server. This means that if you lose or reset your device, we won't be able to recover your wallet or any fund associated with it. Hence, creating backup of your wallet is very important. There are two ways to backup your wallet. You have complete control over your backups.",
            )}
          </SmallText>
        </View>
        <View style={styles.aboutView}>
          <SmallText>
            {t('Option 1: Write down your 12 secret words (mnemonic).')}
          </SmallText>
          <SmallText style={styles.description}>
            {t(
              'This is the safest way to backup your wallet. Click the button below to reveal your secret words. Check no one is looking your screen. Make sure you write down in a paper (or save in an encrypted file) and store safely. NEVER lose it. If you ever need to restore your wallet use these secret words. You can even use these secret words to restore wallet in other blockchain based wallet. Be careful where you restore your wallet. There a lot of scammers out there.',
            )}
          </SmallText>
          <CustomButton
            color={colors.green}
            title={t('Backup Secret Words')}
            onPress={() => navigation.navigate('BackupMnemonicScreen')}
          />
        </View>
        <View style={styles.aboutView}>
          <SmallText>Option 2: Backup to Google Drive.</SmallText>
          <SmallText style={styles.description}>
            {t(
              "Another easier way to backup is just storing an encrypted form of your wallet in your Google Drive. You still have to remember or write down your 6 digit app passcode, as the app uses this passcode to encrypt the wallet before sending to Google Drive, for security. You will need to sign in with Google and give access to Drive. The app will create a folder called 'eSatyaWalletBackup'. NEVER delete it or any contents within it.",
            )}
          </SmallText>
          <CustomButton
            color={colors.blue}
            title={t('Backup to Google Drive')}
            onPress={() => setValues({...values, showPasscodeModal: true})}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default BackupWalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  description: {textAlign: 'justify', color: colors.lightGray},
  aboutView: {marginBottom: Spacing.vs},
});
