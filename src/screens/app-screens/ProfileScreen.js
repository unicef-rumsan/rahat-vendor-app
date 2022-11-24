import React from 'react';
import {View, Image, Pressable, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import {RNToasty} from 'react-native-toasty';

import {
  Card,
  SmallText,
  RegularText,
  CustomHeader,
  IndividualSettingView,
} from '../../components';
import {PersonIcon, PhoneIcon, LocationIcon} from '../../../assets/icons';
import {FontSize, Spacing, colors} from '../../constants';
import Clipboard from '@react-native-clipboard/clipboard';

const ProfileScreen = ({navigation}) => {
  const userData = useSelector(state => state.authReducer.userData);

  const copyToClipboard = string => {
    Clipboard.setString(string);
    RNToasty.Show({title: 'Copied to clipboard', duration: 0});
  };

  return (
    <>
      <CustomHeader
        title={'Profile'}
        onBackPress={() => navigation.pop()}
        // rightIcon={<EditIcon />}
        // onRightIconPress={() => navigation.navigate('EditProfile')}
      />
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri: `https://ipfs.rumsan.com/ipfs/${userData.photo[0]}`,
          }}
          style={styles.image}
        />

        <IndividualSettingView
          icon={<PersonIcon />}
          title={userData?.name}
          style={{paddingHorizontal: Spacing.hs * 2}}
        />
        <IndividualSettingView
          icon={<PhoneIcon />}
          title={userData?.phone}
          style={{paddingHorizontal: Spacing.hs * 2}}
        />
        <IndividualSettingView
          icon={<LocationIcon />}
          title={userData?.address.concat(' ', userData?.ward || '')}
          style={{paddingHorizontal: Spacing.hs * 2}}
        />

        <View
          style={{paddingHorizontal: Spacing.hs, marginVertical: Spacing.vs}}>
          <RegularText color={colors.gray}>Your Address</RegularText>
          <Card>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Spacing.vs * 2,
              }}>
              <QRCode value={userData.wallet_address} size={200} />
              <Pressable
                onPress={() => copyToClipboard(userData.wallet_address)}>
                <SmallText
                  center
                  selectable
                  style={{
                    fontSize: FontSize.xsmall,
                    paddingTop: Spacing.vs * 2,
                  }}>
                  {userData.wallet_address}
                </SmallText>
              </Pressable>
              <SmallText
                center
                color={colors.lightGray}
                style={{fontSize: FontSize.xsmall, paddingTop: Spacing.vs}}>
                This QR Code (address) is your unique identity. Use this to
                receive digital documents, assets or verify your identity.',
              </SmallText>
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: Spacing.vs * 2,
  },
});
