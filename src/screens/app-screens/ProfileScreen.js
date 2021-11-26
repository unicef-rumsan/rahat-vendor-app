import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  PersonIcon,
  PhoneIcon,
  LocationIcon,
  EditIcon,
} from '../../../assets/icons';
import {Card, CustomHeader, RegularText, SmallText} from '../../components';
import {useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

const ProfileScreen = ({navigation}) => {
  const {userData} = useSelector(state => state.auth);
  const ProfileDetail = ({icon, title}) => (
    <View style={styles.detailView}>
      {icon}
      <RegularText style={{paddingHorizontal: Spacing.hs}}>{title}</RegularText>
    </View>
  );

  return (
    <>
      <CustomHeader
        title="Profile"
        onBackPress={() => navigation.pop()}
        rightIcon={<EditIcon />}

        // onRightIconPress={() => navigation.navigate('EditProfile')}
      />
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri: `https://ipfs.rumsan.com/ipfs/${userData.photo[0]}`,
          }}
          style={styles.image}
        />

        {/* <View
          style={{
            paddingHorizontal: Spacing.hs * 2,
            paddingTop: Spacing.vs * 2,
          }}> */}
        <ProfileDetail icon={<PersonIcon />} title={userData?.name} />
        <ProfileDetail icon={<PhoneIcon />} title={userData?.phone} />
        <ProfileDetail icon={<LocationIcon />} title={userData?.address} />

        <View
          style={{paddingHorizontal: Spacing.hs, marginVertical: Spacing.vs}}>
          <RegularText color={colors.gray}>Wallet Address</RegularText>
          <Card>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Spacing.vs * 2,
              }}>
              <QRCode
                value="0xA767CB61b16ea1c83d796E41bD17298b0643eFa"
                size={200}
              />

              <SmallText center style={{fontSize: FontSize.xsmall}}>
                0xA767CB61b16ea1c83d796E41bD17298b0643eFad
              </SmallText>
              <SmallText center style={{fontSize: FontSize.xsmall}}>
                This QR Code (address) is your unique identity. Use this to
                receive digital documents, assets or verify your identity.
              </SmallText>
            </View>
          </Card>
        </View>
        {/* </View> */}
      </ScrollView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.white,
  },
  detailView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.vs,
    paddingHorizontal: Spacing.hs * 2,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: Spacing.vs * 2,
  },
});
