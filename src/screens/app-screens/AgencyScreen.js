import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Pressable} from 'react-native';

import {Spacing, colors, FontSize} from '../../constants';
import {AddCircleIcon} from '../../../assets/icons';
import {
  SmallText,
  RegularText,
  CustomHeader,
  PoppinsMedium,
  LoaderModal,
  PopupModal,
} from '../../components';
import {switchAgencyAction} from '../../redux/actions/agencyActions';

const AgencyComponent = ({name, website, onPress}) => {
  return (
    <Pressable style={styles.agencyView} onPress={onPress}>
      <View style={styles.agencyDetailsView}>
        <View style={styles.logoContainer}>
          {/* <Image
          source={{
            uri: TEMP_IMAGE,
          }}
          style={styles.logo}
        /> */}
          <PoppinsMedium color={colors.blue} fontSize={FontSize.large * 1.2}>
            {name?.[0]}
          </PoppinsMedium>
        </View>
        <View style={{paddingHorizontal: Spacing.hs}}>
          <RegularText color={colors.black}>{name}</RegularText>
          <SmallText exact>{website}</SmallText>
        </View>
      </View>
    </Pressable>
  );
};

const AgencyScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.authReducer.userData);
  const appSettings = useSelector(state => state.agencyReducer.appSettings);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const wallet = useSelector(state => state.walletReducer.wallet);

  // const handleSwitchAgency = agencyUrl => {
  //   const newActiveAppSettings = appSettings.find(
  //     setting => setting.agencyUrl === agencyUrl,
  //   );
  //   dispatch(
  //     switchAgency(newActiveAppSettings, wallet, () =>
  //       navigation.navigate('HomeScreen', { refresh: true }),
  //     ),
  //   );
  // };

  const onError = error => {
    LoaderModal.hide();
    return PopupModal.show({
      message: String(error),
      popupType: 'alert',
      messageType: 'Error',
    });
  };

  const onSuccess = () => {
    LoaderModal.hide();
    navigation.navigate('HomeScreen');
  };

  const _onSwitchAgency = agencyUrl => () => {
    if (activeAppSettings.agencyUrl === agencyUrl) return;

    LoaderModal.show();
    const newAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(
      switchAgencyAction({
        wallet,
        onError,
        onSuccess,
        newAppSettings,
      }),
    );
  };

  return (
    <>
      <CustomHeader
        title="Agency"
        rightIcon={<AddCircleIcon />}
        onBackPress={() => navigation.pop()}
        onRightIconPress={() =>
          navigation.navigate('LinkAgencyScreen', {
            from: 'agencies',
            data: {
              name: userData.name,
              phone: userData.phone,
              wallet_address: userData.wallet_address,
              email: userData.email,
              address: userData.address,
              // govt_id,
              // govt_id_image: userData.govt_id_image,
              photo: userData.photo[0],
            },
          })
        }
      />
      <View style={styles.container}>
        {appSettings?.map((settings, i) => (
          <AgencyComponent
            key={i}
            name={`${settings.agency.name} ${
              activeAppSettings.agencyUrl === settings.agencyUrl
                ? '(Active)'
                : ''
            }`}
            website={settings.agencyUrl}
            onPress={_onSwitchAgency(settings.agencyUrl)}
          />
        ))}
      </View>
    </>
  );
};

export default AgencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  logoContainer: {
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: 10,
    width: wp(20),
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {height: hp(8), width: wp(17), resizeMode: 'contain'},
  agencyDetailsView: {
    paddingVertical: Spacing.vs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
});
