import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {
  CustomButton,
  CustomHeader,
  RegularText,
  SmallText,
} from '../../components';

const BackupWalletScreen = ({navigation}) => {
  return (
    <>
      <CustomHeader
        title="Backup Wallet"
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.aboutView}>
          <RegularText style={{paddingBottom: Spacing.vs / 2}}>
            Backup your wallet
          </RegularText>
          <SmallText color={colors.danger} noPadding>
            Important! Read very carefully
          </SmallText>
          <SmallText noPadding style={styles.description}>
            For the privacy and security, this application never sends any of
            your private key and wallet information to our or any of our server.
            This means that if you lose or reset your device, we won't be able
            to recover your wallet or any fund associated with it. Hence,
            creating backup of your wallet is very important. There are two ways
            to backup your wallet. You have complete control over your backups.
          </SmallText>
        </View>
        <View style={styles.aboutView}>
          <SmallText>
            Option 1: Write down your 12 secret words (mnemonic).
          </SmallText>
          <SmallText style={styles.description}>
            This is the safest way to backup your wallet. Click the button below
            to reveal your secret words. Check no one is looking your screen.
            Make sure you write down in a paper (or save in an encrypted file)
            and store safely. NEVER lose it. If you ever need to restore your
            wallet use these secret words. You can even use these secret words
            to restore wallet in other blockchain based wallet. Be careful where
            you restore your wallet. There a lot of scammers out there.
          </SmallText>
          <CustomButton
            color={colors.green}
            title="Backup Secret Words"
            onPress={() => navigation.navigate('BackupMnemonicScreen')}
          />
        </View>
        {/* <View style={styles.aboutView}>
          <SmallText>Option 2: Backup to Google Drive.</SmallText>
          <SmallText style={styles.description}>
            Another easier way to backup is just storing an encrypted form of
            your wallet in your Google Drive. You still have to remember or
            write down your 6 digit app passcode, as the app uses this passcode
            to encrypt the wallet before sending to Google Drive, for security.
            You will need to sign in with Google and give access to Drive. The
            app will create a folder called 'eSatyaWalletBackup'. NEVER delete
            it or any contents within it.
          </SmallText>
          <CustomButton color={colors.blue} title="Backup to Google Drive" />
        </View> */}
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
