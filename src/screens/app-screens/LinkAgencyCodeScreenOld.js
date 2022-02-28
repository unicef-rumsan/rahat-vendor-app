import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  CustomButton,
  CustomTextInput,
  PoppinsMedium,
  RegularText,
} from '../../components';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const LinkAgencyCodeScreen = ({navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <PoppinsMedium style={{fontSize: FontSize.large}}>
            Link Agency
          </PoppinsMedium>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            marginBottom: Spacing.vs * 3,
          }}>
          <View>
            <RegularText
              fontSize={FontSize.medium}
              style={{paddingBottom: Spacing.vs}}>
              Link agency using code:{' '}
            </RegularText>
            <CustomTextInput placeholder="Enter Code" />
          </View>

          <CustomButton
            title="Continue"
            onPress={() => navigation.navigate('AgencyScreen')}
          />
        </View>
      </View>
    </>
  );
};

export default LinkAgencyCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  header: {
    paddingTop: androidPadding,
    marginVertical: Spacing.vs,
    backgroundColor: colors.white,
  },
});
