import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  PersonIcon,
  PhoneIcon,
  LocationIcon,
  EditIcon,
} from '../../../assets/icons';
import {
  Card,
  CustomHeader,
  IndividualSettingView,
  RegularText,
  SmallText,
} from '../../components';
import {useSelector} from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import {RNToasty} from 'react-native-toasty';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';

const ProfileScreen = ({navigation}) => {
  const {userData} = useSelector(state => state.auth);
  const {t} = useTranslation();
  // const ProfileDetail = ({icon, title}) => (
  //   <View style={styles.detailView}>
  //     {icon}
  //     <RegularText style={{paddingHorizontal: Spacing.hs}}>{title}</RegularText>
  //   </View>
  // );

  const copyToClipboard = string => {
    Clipboard.setString(string);
    RNToasty.Show({title: `${t('Copied to clipboard')}`, duration: 0});
  };

  return (
    <>
      <CustomHeader
        title={t('Profile')}
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

        {/* <View
          style={{
            paddingHorizontal: Spacing.hs * 2,
            paddingTop: Spacing.vs * 2,
          }}> */}
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
          title={userData?.address}
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
                {t(
                  'This QR Code (address) is your unique identity. Use this to receive digital documents, assets or verify your identity.',
                )}
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
  // detailView: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingTop: Spacing.vs,
  //   paddingHorizontal: Spacing.hs * 2,
  // },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: Spacing.vs * 2,
  },
});
