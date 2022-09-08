import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useBackHandler} from '@react-native-community/hooks';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {
  CustomButton,
  CustomHeader,
  RegularText,
  SmallText,
} from '../../components';
import {Spacing, colors} from '../../constants';
import {setAuthData} from '../../redux/actions/authActions';

const RegisterSuccessScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.walletReducer.wallet);
  const {data} = route?.params;
  const secretWords = (wallet?._mnemonic().phrase || '').split(' ');

  const _storeUserData = data => dispatch(setAuthData({userData: data}));

  useBackHandler(() => {
    if (data) {
      _storeUserData(data);
      return true;
    }
    return false;
  });

  const WordComponent = ({count, secret}) => (
    <View style={styles.wordView}>
      <SmallText noPadding style={{paddingTop: Spacing.vs / 2}}>
        {t('Word')}: {`${t(count)}`}
      </SmallText>
      <RegularText color={colors.black}>{secret}</RegularText>
    </View>
  );

  const handleButtonClick = () => {
    if (data) {
      _storeUserData(data);
    }
  };

  return (
    <>
      <CustomHeader
        title={'Backup Wallet'}
        hideBackButton={!!data}
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <SmallText>
          Here is your 12 words secret. Please write down these words in
          sequence (using the word number) and store safely
        </SmallText>

        {secretWords?.map((item, index) => (
          <WordComponent key={index} count={index + 1} secret={item} />
        ))}

        <CustomButton
          style={styles.button}
          onPress={handleButtonClick}
          title={'I have written it down'}
        />
      </ScrollView>
    </>
  );
};

export default RegisterSuccessScreen;

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
  button: {marginBottom: Spacing.vs},
});
