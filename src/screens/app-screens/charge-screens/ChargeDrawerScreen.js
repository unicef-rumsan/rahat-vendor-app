import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {
  CustomButton,
  CustomHeader,
  CustomLoader,
  CustomPopup,
  CustomTextInput,
  SmallText,
  SwitchAgencyModal,
} from '../../../components';
import {useTranslation} from 'react-i18next';
import CustomBottomSheet from '../../../components/CustomBottomSheet';
import {useSelector} from 'react-redux';
import colors from '../../../../constants/colors';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {FontSize, Spacing} from '../../../../constants/utils';
import {useDispatch} from 'react-redux';
import {switchAgency} from '../../../redux/actions/auth';
import {RahatService} from '../../../services/chain';
import {getPackageDetail} from '../../../../constants/helper';
import {QRIcon} from '../../../../assets/icons';

const ChargeDrawerScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {appSettings, userData, activeAppSettings} = useSelector(
    state => state.auth,
  );
  const {wallet} = useSelector(state => state.wallet);
  const [phone, setPhone] = useState('');
  const [values, setValues] = useState({
    // phone: '',
    isSubmitting: false,
    showSwitchAgencyModal: false,
    showLoader: false,
    loaderMessage: '',
    showPopup: '',
    popupType: '',
    messageType: '',
    message: '',
  });
  const {
    // phone,
    isSubmitting,
    showSwitchAgencyModal,
    loaderMessage,
    showLoader,
    message,
    messageType,
    popupType,
    showPopup,
  } = values;

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '50%'], []);

  useEffect(() => {
    const scanPhone = route?.params?.phone;
    if (scanPhone) {
      setValues({...values, phone: scanPhone});
    }
  }, [route]);

  useEffect(() => {
    if (userData?.agencies[0]?.status === 'new') {
      return setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: `${'Alert'}`,
        message: `${t('Your account has not been approved')}`,
      });
    }
    bottomSheetModalRef.current?.present();
  }, [activeAppSettings]);

  const handleSwitchAgency = agencyUrl => {
    setValues({
      ...values,
      showSwitchAgencyModal: false,
      showLoader: true,
      loaderMessage: `${t('Switching agency.')} ${t('Please wait...')}`,
    });
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
    setValues({...values, showLoader: false, showSwitchAgencyModal: false});
  };
  const onSwitchError = e => {
    console.log(e, 'e');
    setValues({...values, showLoader: false, showSwitchAgencyModal: false});
  };

  const handleProceed = async () => {
    if (phone === '') {
      return setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: 'Info',
        message: 'Please enter phone number',
      });
    }
    setValues(values => ({...values, isSubmitting: true}));

    try {
      let rahatService = RahatService(
        activeAppSettings.agency.contracts.rahat,
        wallet,
        activeAppSettings.agency.contracts.rahat_erc20,
        activeAppSettings.agency.contracts.rahat_erc1155,
      );

      let balance = await rahatService.getErc20Balance(phone);
      let totalERC1155Balance = await rahatService.getTotalERC1155Balance(
        phone,
      );
      if (balance === 0 && totalERC1155Balance?.tokenIds?.length === 0) {
        return setValues(values => ({
          ...values,
          isSubmitting: false,
          showPopup: true,
          popupType: 'alert',
          messageType: 'Info',
          message: 'Insuffiecient fund and packages',
        }));
      }

      let packages = await getPackageDetail(
        totalERC1155Balance,
        'totalERCBalance',
      );

      setValues({...values, isSubmitting: false});
      navigation.navigate('ChargeScreen', {
        tokenBalance: balance,
        packages: packages || [],
        beneficiaryPhone: phone,
      });
    } catch (e) {
      alert(e);
      setValues({...values, isSubmitting: false});
    }
  };

  return (
    <>
      <CustomHeader title={t('Charge')} hideBackButton />
      <SwitchAgencyModal
        agencies={appSettings}
        activeAgency={activeAppSettings}
        show={showSwitchAgencyModal}
        onPress={handleSwitchAgency}
        hide={() => setValues({...values, showSwitchAgencyModal: false})}
      />
      <CustomLoader show={showLoader} message={loaderMessage} />
      <CustomPopup
        message={message}
        messageType={messageType}
        show={showPopup}
        popupType={popupType}
        onConfirm={() =>
          messageType === `${t('Your account has not been approved')}`
            ? navigation.navigate('HomeScreen')
            : setValues({...values, showPopup: false})
        }
      />
      <View style={styles.container}>
        <CustomBottomSheet
          enablePanDownToClose={false}
          disableBackdrop
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}>
          <SmallText
            color={colors.gray}
            style={{fontSize: FontSize.small * 1.1}}>
            {activeAppSettings.agency.name}
          </SmallText>
          <View style={{flexDirection: 'row'}}>
            <CustomTextInput
              placeholder={t('Phone Number')}
              keyboardType="phone-pad"
              style={{width: widthPercentageToDP(75)}}
              value={phone}
              onChangeText={value => {
                setPhone(value);
              }}
              editable={!isSubmitting}
              onSubmitEditing={handleProceed}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.buttonView}>
                <Pressable
                  style={styles.qrButton}
                  disabled={isSubmitting}
                  onPress={() =>
                    navigation.navigate('ScanScreen', {type: 'Charge'})
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
          <SmallText
            style={{fontSize: FontSize.small / 1.4}}
            color={colors.lightGray}>
            {t(
              'Important: Please double check the phone number and amount before charging. Transactions cannot be reversed.',
            )}
          </SmallText>

          <CustomButton
            title={t('Switch Agency')}
            width={widthPercentageToDP(90)}
            disabled={isSubmitting}
            outlined
            onPress={() => setValues({...values, showSwitchAgencyModal: true})}
          />
          <CustomButton
            title={t('Proceed')}
            color={colors.green}
            width={widthPercentageToDP(90)}
            onPress={handleProceed}
            isSubmitting={isSubmitting}
            disabled={isSubmitting}
          />
        </CustomBottomSheet>
      </View>
    </>
  );
};

export default ChargeDrawerScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
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
