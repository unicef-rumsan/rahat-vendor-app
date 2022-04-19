import React, {useState} from 'react';
import {StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useIsFocused} from '@react-navigation/native';
import {RumsanLogo} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  PoppinsMedium,
  RegularText,
  CustomButton,
  CustomPopup,
  CustomTextInput,
} from '../../components';
import CustomLoader from '../../components/CustomLoader';
import {
  getAppSettings,
  getRestoreUserData,
  getUserByWalletAddress,
  registerVendor,
  storeUserData,
} from '../../redux/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ethers} from 'ethers';
import {setWallet} from '../../redux/actions/wallet';
import {useTranslation} from 'react-i18next';
let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const LinkAgencyScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {wallet} = useSelector(state => state.wallet);

  const [linkAgencyType, setLinkAgencyType] = useState('qr');

  const [values, setValues] = useState({
    isSubmitting: false,
    loaderMessage: '',
    showPopup: false,
    popupType: '',
    messageType: '',
    message: '',
    agencyCode: '',
  });
  const {
    isSubmitting,
    loaderMessage,
    showPopup,
    message,
    messageType,
    popupType,
    agencyCode,
  } = values;

  const onScan = res => {
    const agencyUrl = res?.data;
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Fetching agency details.')} ${t('Please wait...')}`,
    });
    dispatch(
      getAppSettings(agencyUrl, onGetAppSettingsSuccess, onGetAppSettingsError),
    );
  };
  const handleLinkAgencyWithCode = () => {
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Fetching agency details.')} ${t('Please wait...')}`,
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
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Setting up your rahat account.')} ${t(
        'Please wait...',
      )}`,
    });
    setTimeout(() => {
      dispatch(
        registerVendor(
          agencySettings,
          route.params.data,
          onRegisterSuccess,
          onRegisterError,
        ),
      );
    }, 200);
  };
  const linkNewAgency = agencySettings => {
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Linking your new agency.')} ${t('Please wait...')}`,
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
    setValues({
      ...values,
      isSubmitting: true,
      loaderMessage: `${t('Retrieving user data.')} ${t('Please wait...')}`,
    });
    setTimeout(() => {
      dispatch(
        getRestoreUserData(
          agencySettings,
          wallet.address,
          onRegisterSuccess,
          onRegisterError,
        ),
      );
    }, 200);
  };

  const onGetAppSettingsSuccess = agencySettings => {
    setValues({
      ...values,
      isSubmitting: false,
    });
    if (agencySettings.isSetup === true) {
      if (route.params?.from === 'signup') {
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
    setValues({
      ...values,
      isSubmitting: false,
      showPopup: true,
      popupType: 'alert',
      messageType: `${t('Error')}`,
      message: `${t('Invalid agency code')}`,
    });
  };

  const onRegisterSuccess = async (data, agencySettings) => {
    try {
      const storedAppSettings = await AsyncStorage.getItem('storedAppSettings');
      let provider = new ethers.providers.JsonRpcProvider(
        agencySettings?.networkUrl,
      );
      let connectedWallet = wallet.connect(provider);
      dispatch(setWallet(connectedWallet));
      if (storedAppSettings !== null) {
        let parsedAppSettings = JSON.parse(storedAppSettings);
        let newAppSettings = [...parsedAppSettings, agencySettings];

        await AsyncStorage.setItem(
          'storedAppSettings',
          JSON.stringify(newAppSettings),
        );
        dispatch({type: 'SET_APP_SETTINGS', payload: newAppSettings});
      } else {
        let dataToStore = [agencySettings];
        await AsyncStorage.setItem(
          'storedAppSettings',
          JSON.stringify(dataToStore),
        );
        dispatch({type: 'SET_APP_SETTINGS', payload: dataToStore});
      }
      dispatch({type: 'SET_ACTIVE_APP_SETTINGS', payload: agencySettings});

      if (route.params?.from === 'signup') {
        navigation.replace('RegisterSuccessScreen', {data});
      }
      if (route.params?.from === 'restore') {
        dispatch({type: 'SET_USERDATA', userData: data});
        navigation.replace('Tabs');
      }
      if (route.params?.from === 'agencies') {
        dispatch({type: 'SET_USERDATA', userData: data});
        navigation.pop();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRegisterError = e => {
    console.log(e);
    AsyncStorage.clear()
      .then(() => {
        const errorMessage = e.response ? e.response?.data?.error : e?.message;
        setValues({...values, isSubmitting: false});
        alert(errorMessage || 'Something went wrong', 'register error');
      })
      .catch(e => {
        console.log(e, 'asycn clear error');
      });
  };
  const onLinkNewAgencyError = e => {
    const errorMessage = e.response ? e.response?.data?.message : e.message;
    alert(
      errorMessage || `${t('Something went wrong. Please try again')}`,
      'register error',
    );
    setValues({...values, isSubmitting: false});
  };

  const LinkWithQRUI = () => (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
      )}

      {!isSubmitting && !showPopup && (
        <QRCodeScanner
          cameraStyle={{height: '100%'}}
          showMarker
          markerStyle={{borderColor: 'white'}}
          reactivate
          onRead={onScan}
        />
      )}

      <View style={styles.alignCenter}>
        <PoppinsMedium
          color={colors.white}
          fontSize={FontSize.large * 1.3}
          style={{textAlign: 'center'}}>
          {t('Link Agency')}
        </PoppinsMedium>
        <PoppinsMedium
          color={colors.white}
          fontSize={FontSize.large}
          style={styles.text}>
          {t('Scan QR code to link agency')}
        </PoppinsMedium>
        <PoppinsMedium
          color={colors.white}
          fontSize={FontSize.small / 1.1}
          style={styles.text}>
          {t('Please align the QR code within the frame')}
        </PoppinsMedium>
      </View>
      <View style={styles.buttonView}>
        <CustomButton
          title={t('LINK AGENCY USING CODE')}
          onPress={() => setLinkAgencyType('code')}
        />
      </View>
      <View style={styles.poweredByView}>
        <RegularText
          color={colors.white}
          style={{
            textAlign: 'center',
            paddingHorizontal: Spacing.hs / 3,
            fontSize: FontSize.small,
          }}>
          {t('Powered By')}
        </RegularText>
        <RumsanLogo />
      </View>
    </View>
  );

  const LinkWithCodeUI = () => (
    <View style={styles.linkWithCodeUIContainer}>
      <SafeAreaView style={styles.header}>
        <PoppinsMedium style={{fontSize: FontSize.large}}>
          {t('Link Agency')}
        </PoppinsMedium>
      </SafeAreaView>
      <CustomLoader show={isSubmitting} message={loaderMessage} />
      <CustomPopup
        show={showPopup}
        popupType={popupType}
        messageType={messageType}
        message={message}
        onConfirm={() => setValues({...values, showPopup: false})}
      />
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
            {t('Link agency using code:')}
          </RegularText>
          <CustomTextInput
            placeholder={t('Enter Code')}
            keyboardType="url"
            autoCapitalize="none"
            onChangeText={value => setValues({...values, agencyCode: value})}
          />
        </View>

        <View>
          <CustomButton
            title={t('LINK AGENCY WITH QR SCAN')}
            onPress={() => setLinkAgencyType('qr')}
            outlined
          />
          <CustomButton
            title={t('Continue')}
            onPress={handleLinkAgencyWithCode}
          />
        </View>
      </View>
    </View>
  );

  return (
    <>
      <CustomLoader show={isSubmitting} message={loaderMessage} />

      <CustomPopup
        show={showPopup}
        popupType={popupType}
        messageType={messageType}
        message={message}
        onConfirm={() => setValues({...values, showPopup: false})}
      />
      {linkAgencyType === 'qr' ? LinkWithQRUI() : LinkWithCodeUI()}
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
