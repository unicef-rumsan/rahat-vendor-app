import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Spacing, colors} from '../../constants';
import {CustomHeader, RegularText, SmallText} from '../../components';

const AboutScreen = ({navigation}) => {
  return (
    <>
      <CustomHeader title={'About Us'} onBackPress={() => navigation.pop()} />
      <View style={styles.container}>
        <View style={styles.aboutView}>
          <RegularText>What Is Rahat?</RegularText>
          <SmallText style={styles.description}>
            Rahat (relief in Nepali) is an open source blockchain-based token
            cash and voucher assistance platform.
          </SmallText>
          <SmallText style={styles.description}>
            Rahat manages and monitors the flow of transactions in token
            distribution projects maintaining end to end transparency for
            humanitarian agencies who need a transparent, efficient and cheaper
            way to distribute cash or goods in emergency response.
          </SmallText>
        </View>
        <View style={styles.aboutView}>
          <RegularText>Our Mission</RegularText>
          <SmallText style={styles.description}>
            We aim to make humanitarian aid distribution efficient and
            transparent to support marginalized communities.
          </SmallText>
          <SmallText style={styles.description}>
            Rahat strengthens financial inclusion for vulnerable community
            members and helps them receive cash transfers through local vendors
            in their communities.
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
  aboutView: {paddingTop: Spacing.vs},
  description: {textAlign: 'justify', color: colors.lightGray},
});
