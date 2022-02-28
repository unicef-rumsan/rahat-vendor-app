import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {AddCircleIcon, Logo, MoreDotsIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  CustomHeader,
  RegularText,
  SmallText,
  CustomButton,
} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {switchAgency} from '../../redux/actions/auth';
import CustomLoader from '../../components/CustomLoader';

const TEMP_IMAGE =
  'https://cdn.freelogovectors.net/wp-content/uploads/2016/12/un-logo.png';

const AgencyScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userData, appSettings, activeAppSettings} = useSelector(
    state => state.auth,
  );

  const {wallet} = useSelector(state => state.wallet);
  const [showLoader, setShowLoader] = useState(false);

  // useEffect(() => {
  //   const data = {
  //     name: userData.name,
  //     phone: userData.phone,
  //     wallet_address: userData.wallet_address,
  //     email: userData.email,
  //     address: userData.address,
  //     // govt_id,
  //     govt_id_image: userData.govt_id_image,
  //     photo: userData.photo[0],
  //   };
  // }, []);

  // const swipeableRef = useRef(null);

  // const handleDelete = (name, website) => {
  //   alert(`Delete Agency : ${name}  ${website}`);
  //   swipeableRef.current.close();
  // };

  // const rightSwipeActions = (name, website) => (
  //   <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
  //     <CustomButton
  //       title="Delete"
  //       width={wp(20)}
  //       color={colors.danger}
  //       onPress={() => handleDelete(name, website)}
  //     />
  //   </View>
  // );

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
    setShowLoader(true);
    const newActiveAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(
      switchAgency(
        newActiveAppSettings,
        wallet,
        onSwitchSuccess,
        onSwitchError,
      ),
    );
  };

  const onSwitchSuccess = newActiveAppSettings => {
    dispatch({type: 'SET_ACTIVE_APP_SETTINGS', payload: newActiveAppSettings});
    setShowLoader(false);
    navigation.navigate("HomeScreen")
  };
  const onSwitchError = e => {
    console.log(e, 'e');
    setShowLoader(false);
  };

  return (
    <>
      <CustomHeader
        title="Agency"
        rightIcon={<AddCircleIcon />}
        onBackPress={() => navigation.pop()}
        onRightIconPress={() =>
          navigation.navigate('LinkAgencyQRScreen', {
            // fromAgencies: true,
            from: 'agencies',
            data: {
              name: userData.name,
              phone: userData.phone,
              wallet_address: userData.wallet_address,
              email: userData.email,
              address: userData.address,
              // govt_id,
              // govt_id_image: userData.govt_id_image,
              // photo: userData.photo[0],
            },
          })
        }
      />
      <CustomLoader
        show={showLoader}
        message="Switching agency. Please wait..."
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
