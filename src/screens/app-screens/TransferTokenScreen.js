import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {QRIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  CustomHeader,
  Card,
  CustomButton,
  CustomTextInput,
  RegularText,
  SmallText,
} from '../../components';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const TransferTokenScreen = ({navigation}) => {
  return (
    <>
      <CustomHeader
        title="Transfer Token"
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <Card>
          <RegularText
            color={colors.black}
            style={{paddingBottom: Spacing.vs, fontSize: FontSize.medium}}>
            Transfer Token :
          </RegularText>
          <View style={{flexDirection: 'row'}}>
            <CustomTextInput
              placeholder="Destination Address"
              style={{width: widthPercentageToDP(64)}}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.buttonView}>
                <Pressable
                  style={styles.qrButton}
                  onPress={() =>
                    navigation.navigate('ScanScreen', {
                      type: 'Transfer',
                    })
                  }
                  android_ripple={{
                    color: 'rgba(0,0,0, 0.1)',
                    borderless: false,
                  }}>
                  <QRIcon />
                </Pressable>
              </View>
            </View>
          </View>
          <CustomTextInput placeholder="Enter amount" keyboardType="numeric" />

          <SmallText style={{fontSize: FontSize.small / 1.2}}>
            Important: Please double check the phone number and amount before
            charging. Transactions cannot be reversed.
          </SmallText>

          <CustomButton
            title="Transfer Token"
            color={colors.green}
            width={widthPercentageToDP(80)}
            onPress={() => navigation.navigate('AgencyScreen')}
          />
        </Card>
      </View>
    </>
  );
};

export default TransferTokenScreen;

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
  buttonContainer: {
    marginHorizontal: Spacing.hs / 1.5,
    marginTop: Spacing.vs / 5,
  },
  buttonView: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  qrButton: {
    backgroundColor: colors.blue,
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
