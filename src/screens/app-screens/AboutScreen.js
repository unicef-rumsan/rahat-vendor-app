import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {CustomHeader, RegularText, SmallText} from '../../components';

const AboutScreen = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <>
      <CustomHeader
        title={t('About Us')}
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <View style={styles.aboutView}>
          <RegularText>{t('What Is Rahat?')}</RegularText>
          <SmallText style={styles.description}>
            {t(
              'Rahat (relief in Nepali) is an open source blockchain-based token cash and voucher assistance platform.',
            )}
          </SmallText>
          <SmallText style={styles.description}>
            {t(
              'Rahat manages and monitors the flow of transactions in token distribution projects maintaining end to end transparency for humanitarian agencies who need a transparent, efficient and cheaper way to distribute cash or goods in emergency response.',
            )}
          </SmallText>
        </View>
        <View style={styles.aboutView}>
          <RegularText>{t('Our Mission')}</RegularText>
          <SmallText style={styles.description}>
            {t(
              'We aim to make humanitarian aid distribution efficient and transparent to support marginalized communities.',
            )}
          </SmallText>
          <SmallText style={styles.description}>
            {t(
              'Rahat strengthens financial inclusion for vulnerable community members and helps them receive cash transfers through local vendors in their communities.',
            )}
          </SmallText>
        </View>
      </View>
    </>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  description: {textAlign: 'justify', color: colors.lightGray},
  aboutView: {paddingTop: Spacing.vs},
});
