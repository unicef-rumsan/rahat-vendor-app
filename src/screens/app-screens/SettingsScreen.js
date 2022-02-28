import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';

import {Card, CustomHeader, RegularText} from '../../components';

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

const SettingsScreen = ({navigation}) => {
  const SettingComponent = ({icon, title, onPress}) => (
    <Pressable style={styles.rowView} onPress={onPress}>
      {icon}
      <RegularText style={{paddingHorizontal: Spacing.hs}}>{title}</RegularText>
    </Pressable>
  );

  return (
    <>
      <CustomHeader title="Settings" hideBackButton />
      <View style={styles.container}>
        <>
          <RegularText
            color={colors.black}
            style={{paddingTop: Spacing.vs / 2}}>
            General
          </RegularText>
          <Card>
            <SettingComponent
              icon={<PersonIcon color={colors.gray} />}
              title="Profile"
              onPress={() => navigation.navigate('ProfileScreen')}
            />
            {/* <SettingComponent
              icon={<WalletIcon />}
              title="Payment Methods"
              onPress={() => navigation.navigate('PaymentMethodScreen')}
            /> */}
            <SettingComponent
              icon={<AgencyIcon />}
              title="Agency"
              onPress={() => navigation.navigate('AgencyScreen')}
            />
            <SettingComponent
              icon={<AboutIcon />}
              title="About"
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
            <SettingComponent
              icon={<TransferTokenIcon />}
              title="Transfer Token"
              onPress={() => navigation.navigate('TransferTokenScreen')}
            />
            <SettingComponent
              icon={<BackupWalletIcon />}
              title="Backup Wallet"
              onPress={() => navigation.navigate('BackupWalletScreen')}
            />
            <SettingComponent
              icon={<PassCodeIcon />}
              title="Rahat Passcode"
              onPress={() => navigation.navigate('PasscodeScreen')}
            />
            {/* <SettingComponent
              icon={<LanguageIcon />}
              title="Language"
              // onPress={() => alert('Soon')}
            /> */}
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
