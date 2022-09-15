import {ethers} from 'ethers';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Keyboard,
  Platform,
} from 'react-native';

import {
  RegularText,
  PopupModal,
  LoaderModal,
  CustomButton,
  PoppinsMedium,
  CustomTextInput,
} from '../../components';
import {
  setAuthData,
  registerVendor,
  getAppSettings,
  getRestoreUserData,
  clearRegistrationFormData,
} from '../../redux/actions/authActions';
import {FontSize, Spacing, colors} from '../../constants';
import {setWalletData} from '../../redux/actions/walletActions';
import {setAppSettings} from '../../redux/actions/agencyActions';
import {setTransactionData} from '../../redux/actions/transactionActions';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const LinkAgencyScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const appSettings = useSelector(state => state.agencyReducer.appSettings);
  const registrationFormData = useSelector(
    state => state.authReducer.registrationFormData,
  );

  const [agencyCode, setAgencyCode] = useState('');

  const handleLinkAgencyWithCode = () => {
    Keyboard.dismiss();
    if (
      route.params?.from === 'agencies' &&
      appSettings?.some(item => item.agencyUrl === agencyCode)
    ) {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Info',
        message:
          'Already linked to this agency. Cannot link same agency twice.',
      });
    }
    LoaderModal.show({
      message: 'Fetching agency details.',
    });

    dispatch(
      getAppSettings(
        agencyCode,
        onGetAppSettingsSuccess,
        onGetAppSettingsError,
      ),
    );
  };

  const registerNewUser = agencySettings => {
    const data = registrationFormData
      ? registrationFormData
      : route?.params?.data;
    LoaderModal.show({
      message: 'Setting up your rahat account',
    });
    setTimeout(() => {
      dispatch(
        registerVendor(
          agencySettings,
          data,
          onRegisterSuccess,
          onRegisterError,
        ),
      );
    }, 200);
  };
  const linkNewAgency = agencySettings => {
    LoaderModal.show({
      message: 'Linking your new agency',
    });

    setTimeout(() => {
      dispatch(
        registerVendor(
          agencySettings,
          route.params.data,
          onRegisterSuccess,
          onLinkNewAgencyError,
        ),
      );
    }, 200);
  };

  const restoreUser = agencySettings => {
    LoaderModal.show({
      message: 'Retrieving user data',
    });

    setTimeout(() => {
      dispatch(
        getRestoreUserData(
          agencySettings,
          wallet.address,
          onRegisterSuccess,
          onRestoreUserDataError,
        ),
      );
    }, 200);
  };

  const onRestoreUserDataError = (e, agencySettings) => {
    let errorMessage = '';
    if (e.message === 'Not registered') {
      errorMessage = `Sorry, the user with wallet address ${wallet?.address} is not registered in ${agencySettings?.agencyUrl}`;
    }
    onRegisterError({message: errorMessage});
  };

  const onGetAppSettingsSuccess = agencySettings => {
    if (agencySettings.isSetup === true) {
      if (route.params?.from === 'signup' || registrationFormData) {
        registerNewUser(agencySettings);
      }
      if (route.params?.from === 'restore') {
        restoreUser(agencySettings);
      }
      if (route.params?.from === 'agencies') {
        linkNewAgency(agencySettings);
      }
    }
  };

  const onGetAppSettingsError = e => {
    LoaderModal.hide();
    let errorMessage = 'Invalid agency code';

    if (e?.message === 'Network Error') {
      errorMessage =
        'Network Error. Please check your internet connection and the agency url';
    }
    PopupModal.show({
      popupType: 'alert',
      messageType: 'Error',
      message: errorMessage,
    });
  };

  const onRegisterSuccess = async (data, agencySettings) => {
    dispatch(clearRegistrationFormData());

    let provider = new ethers.providers.JsonRpcProvider(
      agencySettings?.networkUrl,
    );
    let connectedWallet = wallet.connect(provider);
    dispatch(setWalletData({wallet: connectedWallet}));
    dispatch(
      setAppSettings({
        appSettings: [...appSettings, agencySettings],
        activeAppSettings: agencySettings,
      }),
    );

    if (route.params?.from === 'restore') {
      LoaderModal.hide();
      dispatch(setAuthData({userData: data}));
      return navigation.replace('Tabs');
    }

    if (route.params?.from === 'signup') {
      LoaderModal.hide();
      return navigation.replace('RegisterSuccessScreen', {data});
    }

    if (route.params?.from === 'agencies') {
      LoaderModal.hide();
      dispatch(setAuthData({userData: data}));
      dispatch(
        setTransactionData({
          packagesWithActiveAgency: null,
          transactionsWithActiveAgency: null,
        }),
      );
      navigation.pop();
    }
  };

  const onRegisterError = e => {
    console.log({e: e.response});
    const errorMessage = e?.response ? e?.response?.data?.message : e?.message;

    LoaderModal.hide();

    PopupModal.show({
      popupType: 'alert',
      messageType: 'Error',
      message: errorMessage || 'Something went wrong. Please try again.',
    });
  };

  const onLinkNewAgencyError = e => {
    const errorMessage = e?.response ? e.response?.data?.message : e?.message;
    LoaderModal.hide();
    PopupModal.show({
      popupType: 'alert',
      messageType: 'Error',
      message: errorMessage || 'Something went wrong. Please try again.',
    });
  };

  return (
    <>
      <View style={styles.linkWithCodeUIContainer}>
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
              Link agency using code
            </RegularText>
            <CustomTextInput
              placeholder={'Enter Code'}
              keyboardType="url"
              autoCapitalize="none"
              onChangeText={value => setAgencyCode(value)}
            />
          </View>

          <View>
            <CustomButton
              title={'Continue'}
              onPress={handleLinkAgencyWithCode}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default LinkAgencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: hp(35),
    width: wp(100),
    position: 'absolute',
    backgroundColor: 'rgba(43, 126, 193, 0.5)',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    height: hp(39.35),
    width: wp(100),
    backgroundColor: 'rgba(43, 126, 193, 0.5)',
  },
  side: {
    top: hp(35),
    height: hp(32),
    width: wp(22),
    position: 'absolute',
    backgroundColor: 'rgba(43, 126, 193, 0.5)',
  },
  alignCenter: {
    position: 'absolute',
    left: 0,
    top: 40,
    right: 0,
  },
  text: {textAlign: 'center', top: 25},
  buttonView: {position: 'absolute', bottom: 120, left: 0, right: 0},
  poweredByView: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40,
    right: 0,
    left: 0,
  },

  linkWithCodeUIContainer: {
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
