import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {
  Card,
  RegularText,
  CustomHeader,
  LanguagePicker,
  IndividualSettingView,
} from '../../components';
import {
  AboutIcon,
  AgencyIcon,
  PersonIcon,
  LanguageIcon,
  PassCodeIcon,
  BackupWalletIcon,
  TransferTokenIcon,
} from '../../../assets/icons';
import {Spacing, colors} from '../../constants';

const SettingsScreen = ({navigation}) => {
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  return (
    <>
      <CustomHeader title={'Settings'} onBackPress={() => navigation.pop()} />
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
              title={'Profile'}
              onPress={() => navigation.navigate('ProfileScreen')}
            />
            <IndividualSettingView
              icon={<AgencyIcon />}
              title={'Agency'}
              onPress={() => navigation.navigate('AgencyScreen')}
            />
            <IndividualSettingView
              icon={<AboutIcon />}
              title={'About Us'}
              onPress={() => navigation.navigate('AboutScreen')}
            />
          </Card>
        </>
        <>
          <RegularText
            color={colors.black}
            style={{paddingTop: Spacing.vs / 2}}>
            Advanced
          </RegularText>
          <Card>
            <IndividualSettingView
              icon={<TransferTokenIcon />}
              title={'Transfer Token'}
              onPress={() => navigation.navigate('TransferTokenScreen')}
            />
            <IndividualSettingView
              icon={<BackupWalletIcon />}
              title={'Backup Wallet'}
              onPress={() => navigation.navigate('BackupWalletScreen')}
            />
            <IndividualSettingView
              icon={<PassCodeIcon />}
              title={'Rahat Passcode'}
              onPress={() => navigation.navigate('PasscodeScreen')}
            />
            <IndividualSettingView
              icon={<LanguageIcon />}
              title={'Language'}
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
