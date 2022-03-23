import {t} from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {Logo} from '../../../assets/images';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {CustomButton, SmallText} from '../../components';

const GetStartedScreen = ({navigation}) => {
  const {t,} = useTranslation();
  return (
    <View style={styles.container}>
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
          title={t('Create new account')}
          onPress={() => navigation.navigate('SignupScreen')}
        />
        <CustomButton
          title={t('Restore account')}
          color={colors.green}
          onPress={() => navigation.navigate('RestoreAccountScreen')}
        />
      </View>
    </View>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    justifyContent: 'space-between',
  },
});
