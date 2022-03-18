import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {
  CustomButton,
  CustomHeader,
  CustomLoader,
  CustomPopup,
  RegularText,
  SmallText,
} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  ListQueryBuilder,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import {encryptionHelper} from '../../../constants/helper';
import {GOOGLE_WEB_CLIENT_ID} from '@env';
import {useTranslation} from 'react-i18next';

GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ],
  offlineAccess: true,
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

const BackupWalletScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  let gdrive = new GDrive();
  const {walletInfo} = useSelector(state => state.wallet);

  const [values, setValues] = useState({
    showLoader: false,
    loaderMessage: '',
    showPopup: false,
    popupType: '',
    popupMessageType: '',
    popupMessage: '',
  });

  const {
    showLoader,
    loaderMessage,
    popupMessage,
    popupMessageType,
    popupType,
    showPopup,
  } = values;

  useEffect(() => {
    GoogleSignin.signOut();
  }, []);

  const handleBackupToDrive = async () => {
    setValues(values => ({
      ...values,
      loaderMessage: `${t('Encrypting your wallet.')} ${t('Please wait...')}`,
    }));

    try {
      let encryptedData = await encryptionHelper(walletInfo);
      if (encryptedData.cipher) {
        await gdrive.files
          .newMultipartUploader()
          .setData(JSON.stringify(encryptedData), MimeTypes.BINARY)
          .setRequestBody({
            name: 'rahat_backup',
          })
          .execute();
        setValues(values => ({
          ...values,
          showLoader: false,
          loaderMessage: '',
          showPopup: true,
          popupType: 'alert',
          popupMessageType: `${t('Success')}`,
          popupMessage: `${t(
            'Wallet backed up to your google drive successfully',
          )}`,
        }));
      }
    } catch (e) {
      console.log(e);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: `${t('Error')}`,
        popupMessage: `${t('Something went wrong. Please try again')}`,
      }));
    }
  };

  const initializeGDrive = async () => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: `${t('Checking your drive for backup')}`,
    }));
    try {
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      let data = await gdrive.files.list({
        q: new ListQueryBuilder()
          .e('name', 'rahat_backup')
          .and()
          .e('mimeType', 'application/octet-stream'),
      });
      if (data.files?.length !== 0) {
        return setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupType: 'alert',
          popupMessageType: `${t('Info')}`,
          popupMessage: `${t(
            'Your wallet is already backed up in your google drive',
          )}`,
        }));
      }
      handleBackupToDrive();
    } catch (e) {
      console.log(e);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: `${t('Error')}`,
        popupMessage: `${t('Something went wrong. Plese try again later')}`,
      }));
    }
  };

  const googleSignin = async () => {
    dispatch({type: 'BACKUP_TO_DRIVE_STATUS', payload: true});

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      initializeGDrive();
    } catch (error) {
      dispatch({type: 'BACKUP_TO_DRIVE_STATUS', payload: false});
      console.log(error);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: `${t('Error')}`,
        popupMessage: `${t('Something went wrong. Plese try again later')}`,
      }));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <>
      <CustomHeader
        title={t('Backup Wallet')}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <CustomLoader show={showLoader} message={loaderMessage} />

        <CustomPopup
          show={showPopup}
          popupType={popupType}
          messageType={popupMessageType}
          message={popupMessage}
          onConfirm={() => setValues({...values, showPopup: false})}
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
            onPress={googleSignin}
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
