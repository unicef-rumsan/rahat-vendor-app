import React from 'react';
import {StyleSheet, View, Image, Pressable} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {AddCircleIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';
import {useDispatch, useSelector} from 'react-redux';
import {switchAgency} from '../../redux/actions/agency';
import {useTranslation} from 'react-i18next';
import {
  CustomHeader,
  RegularText,
  SmallText,
  CustomLoader,
  CustomPopup,
} from '../../components';

const TEMP_IMAGE =
  'https://cdn.freelogovectors.net/wp-content/uploads/2016/12/un-logo.png';

const AgencyScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {userData} = useSelector(state => state.auth);
  const {appSettings, activeAppSettings} = useSelector(state => state.agency);

  const {switchingAgency, switchAgencyLoaderMessage, switchAgencyErrorMessage} =
    useSelector(state => state.agency);

  const {wallet} = useSelector(state => state.wallet);

  const AgencyComponent = ({name, website, onPress}) => (
    <Pressable style={styles.agencyView} onPress={onPress}>
      <View style={styles.agencyDetailsView}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: TEMP_IMAGE,
            }}
            style={styles.logo}
          />
        </View>
        <View style={{paddingHorizontal: Spacing.hs}}>
          <RegularText color={colors.black}>{name}</RegularText>
          <SmallText>{website}</SmallText>
        </View>
      </View>
    </Pressable>
  );

  const handleSwitchAgency = agencyUrl => {
    const newActiveAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(
      switchAgency(newActiveAppSettings, wallet, () =>
        navigation.navigate('HomeScreen', {refresh: true}),
      ),
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
      <CustomPopup
        show={switchAgencyErrorMessage && true}
        popupType="alert"
        messageType={'Error'}
        message={`${switchAgencyErrorMessage}`}
        onConfirm={() => dispatch({type: 'SWITCH_AGENCY_CLEAR_ERROR'})}
      />
      <CustomLoader
        show={switchingAgency}
        message={`${t(switchAgencyLoaderMessage)}`}
      />
      <View style={styles.container}>
        {appSettings?.map((settings, i) => (
          <AgencyComponent
            key={i}
            name={`${settings.agency.name} ${
              activeAppSettings.agencyUrl === settings.agencyUrl
                ? `${t('(Active)')}`
                : ''
            }`}
            website={settings.agencyUrl}
            onPress={() => handleSwitchAgency(settings.agencyUrl)}
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
