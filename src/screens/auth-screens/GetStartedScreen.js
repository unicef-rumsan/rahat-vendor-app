import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Logo} from '../../../assets/images';
import {Spacing, colors} from '../../constants';
import {CustomButton, SmallText} from '../../components';

const GetStartedScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View />
      <View style={styles.content}>
        <Logo />
        <SmallText center style={styles.text}>
            Supporting vulnerable communities with a simple and efficient relief distribution platform
        </SmallText>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title={'Create new account'}
          onPress={() => navigation.navigate('SignupScreen')}
        />
        <CustomButton
          title={'Restore account'}
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
  text: {paddingTop: Spacing.vs * 2},
  buttonContainer: {marginBottom: Spacing.vs * 2},
  content: {justifyContent: 'center', alignItems: 'center'},
});
