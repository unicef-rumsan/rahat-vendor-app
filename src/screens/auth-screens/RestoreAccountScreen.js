import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Logo} from '../../../assets/images';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {CustomButton, SmallText} from '../../components';

const RestoreAccountScreen = ({navigation}) => {
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
          title="RESTORE USING SEED PHRASE"
          onPress={() => navigation.navigate('RestoreMnemonicScreen')}
        />
        <CustomButton title="RESTORE USING GOOGLE DRIVE" color={colors.green} />
      </View>
    </View>
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
});
