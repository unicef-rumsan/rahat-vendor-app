import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Spacing, colors } from '../../constants';

import {
  CustomButton,
  CustomHeader,
  RegularText,
  SmallText,
} from '../../components';

const BackupMnemonicScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const walletInfo = useSelector(state => state.walletReducer.walletInfo);

  const data = route?.params?.data;
  const secretWords = walletInfo?.mnemonic?.split(' ') || [];

  const WordComponent = ({ count, secret }) => (
    <View style={styles.wordView}>
      <SmallText noPadding style={{ paddingTop: Spacing.vs / 2 }}>
        {t('Word')}: {`${t(count)}`}
      </SmallText>
      <RegularText color={colors.black}>{secret}</RegularText>
    </View>
  );

  const handleButtonClick = () => navigation.pop();

  return (
    <>
      <CustomHeader
        title={'Backup Wallet'}
        hideBackButton={!!data}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <SmallText>
          Here is your 12 words secret. Please write down these words in sequence (using the word number) and store safely
        </SmallText>

        {secretWords?.map((item, index) => (
          <WordComponent key={index} count={index + 1} secret={item} />
        ))}

        <CustomButton
          title={'I have written it down'}
          onPress={handleButtonClick}
          style={styles.button}
        />
      </ScrollView>
    </>
  );
};

export default BackupMnemonicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  wordView: {
    height: hp(9),
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: Spacing.hs,
    marginBottom: Spacing.vs * 1.5,
  },
  button: { marginBottom: Spacing.vs },
});
