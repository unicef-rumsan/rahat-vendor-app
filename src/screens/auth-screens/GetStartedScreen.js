import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Logo} from '../../../assets/images';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {CustomButton, SmallText} from '../../components';

const GetStartedScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Logo />
        <SmallText center style={{paddingTop: Spacing.vs * 2}}>
          Supporting vulnerable communities with a simple and efficient relief
          distribution platform.
        </SmallText>
      </View>
      <View style={{marginBottom: Spacing.vs * 2}}>
        <CustomButton
          title="Create new account"
          onPress={() => navigation.navigate('SignupScreen')}
        />
        <CustomButton
          title="Restore account"
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
