import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';

import {
  Card,
  CustomHeader,
  IndividualSettingView,
  RegularText,
} from '../../components';

import {
  AboutIcon,
  AgencyIcon,
  BackupWalletIcon,
  DollorIcon,
  LanguageIcon,
  PassCodeIcon,
  PersonIcon,
  TransferTokenIcon,
  WalletIcon,
} from '../../../assets/icons';
import {useTranslation} from 'react-i18next';
import LanguagePicker from '../../components/LanguagePicker';

const SettingsScreen = ({navigation}) => {
  const {t} = useTranslation();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  return (
    <>
      <CustomHeader
        title={t('Settings')}
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <LanguagePicker
          show={showLanguagePicker}
          hide={() => setShowLanguagePicker(false)}
        />
        <>
          <RegularText
            color={colors.black}
            style={{paddingTop: Spacing.vs / 2}}>
            General
          </RegularText>
          <Card>
            <IndividualSettingView
              icon={<PersonIcon color={colors.gray} />}
              title={t('Profile')}
              onPress={() => navigation.navigate('ProfileScreen')}
            />
            {/* <SettingComponent
              icon={<WalletIcon />}
              title="Payment Methods"
              onPress={() => navigation.navigate('PaymentMethodScreen')}
            /> */}
            <IndividualSettingView
              icon={<AgencyIcon />}
              title={t('Agency')}
              onPress={() => navigation.navigate('AgencyScreen')}
            />
            <IndividualSettingView
              icon={<AboutIcon />}
              title={t('About Us')}
              onPress={() => navigation.navigate('AboutScreen')}
            />
          </Card>
        </>
        <>
          <RegularText
            color={colors.black}
            style={{paddingTop: Spacing.vs / 2}}>
            {t('Advanced')}
          </RegularText>
          <Card>
            <IndividualSettingView
              icon={<TransferTokenIcon />}
              title={t('Transfer Token')}
              onPress={() => navigation.navigate('TransferTokenScreen')}
            />
            <IndividualSettingView
              icon={<BackupWalletIcon />}
              title={t('Backup Wallet')}
              onPress={() => navigation.navigate('BackupWalletScreen')}
            />
            <IndividualSettingView
              icon={<PassCodeIcon />}
              title={t('Rahat Passcode')}
              onPress={() => navigation.navigate('PasscodeScreen')}
            />
            <IndividualSettingView
              icon={<LanguageIcon />}
              title={t('Language')}
              onPress={() => setShowLanguagePicker(true)}
            />
          </Card>
        </>
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.vs / 2,
  },
});
