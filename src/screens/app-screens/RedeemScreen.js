import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import {
  CustomHeader,
  Card,
  RegularText,
  SmallText,
  CustomTextInput,
  CustomButton,
} from '../../components';
import CustomLoader from '../../components/CustomLoader';
import SwitchAgencyModal from '../../components/SwitchAgencyModal';
import {getUserByWalletAddress, switchAgency} from '../../redux/actions/auth';
import {useTranslation} from 'react-i18next';
import {TokenService} from '../../services/chain';

const RedeemScreen = ({navigation, route}) => {
  // const agencyName = route.params?.agencyName;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {balance, wallet} = useSelector(state => state.wallet);
  const {appSettings, activeAppSettings, userData} = useSelector(
    state => state.auth,
  );
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    showSwitchAgencyModal: false,
    isSubmitting: false,
    showLoader: false,
    loaderMessage: '',
  });
  const {isSubmitting, showSwitchAgencyModal, loaderMessage, showLoader} =
    values;

  useEffect(() => {
    let temp = userData.agencies?.filter(
      data => data.agency === activeAppSettings.agency._id,
    );
    if (temp[0]?.status === 'new') {
      RNToasty.Show({
        title: `${t('Your account has not been approved')}`,
        duration: 1,
      });
      navigation.pop();
    }
  }, [activeAppSettings]);

  const handleRedeem = async () => {
    let timeElapsed = Date.now();
    let timeStamp = new Date(timeElapsed);

    if (amount === '' || amount === '0') {
      setErrorMessage(`${t('Enter amount to redeem')}`);
      return;
    }
    if (amount > balance) {
      setErrorMessage(`${t('Amount cannot be greater than balance')}`);
      return;
    }
    setValues({...values, isSubmitting: true});
    try {
      const receipt = await TokenService(
        activeAppSettings?.agency?.contracts?.rahat, //agency address
        wallet,
        activeAppSettings?.agency?.contracts?.token,
      ).transfer(activeAppSettings.agency.contracts.rahat_admin, amount);

      let receiptData = {
        timeStamp: timeStamp.toLocaleString(),
        to: receipt.to,
        amount,
        type: 'redeem',
        agencyUrl: activeAppSettings.agencyUrl,
      };
      // setIsSubmitting(false);
      navigation.replace('RedeemReceiptScreen', {
        receiptData,
        from: 'redeemScreen',
      });
    } catch (e) {
      console.log(e);
      setValues({...values, isSubmitting: false});
    }
  };

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

  return (
    <>
      <CustomHeader title={t('Redeem')} onBackPress={() => navigation.pop()} />
      <SwitchAgencyModal
        activeAgency={activeAppSettings}
        agencies={appSettings}
        show={showSwitchAgencyModal}
        onPress={handleSwitchAgency}
        hide={() => setValues({...values, showSwitchAgencyModal: false})}
      />
      <CustomLoader show={showLoader} message={loaderMessage} />
      <View style={styles.container}>
        <RegularText
          fontSize={FontSize.medium}
          color={colors.gray}
          style={{paddingVertical: Spacing.vs / 2}}>
          {activeAppSettings.agency.name}
        </RegularText>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <RegularText fontSize={FontSize.medium}>
                Token Balance
              </RegularText>
            </View>
            <RegularText color={colors.black}>{balance}</RegularText>
          </View>
        </Card>
        <View style={styles.inputContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: Spacing.vs,
            }}>
            <RegularText fontSize={FontSize.medium}>
              Enter amount to redeem:
            </RegularText>
            <Pressable onPress={() => setAmount(balance.toString())}>
              <RegularText fontSize={FontSize.medium} color={colors.blue}>
                MAX
              </RegularText>
            </Pressable>
          </View>
          <CustomTextInput
            placeholder={t('Enter amount')}
            value={amount}
            onChangeText={text => {
              setAmount(text);
              setErrorMessage('');
            }}
            keyboardType="numeric"
            error={errorMessage !== '' && errorMessage}
            editable={!isSubmitting}
          />
        </View>
        <CustomButton
          title={t('Switch Agency')}
          disabled={isSubmitting}
          outlined
          onPress={() => setValues({...values, showSwitchAgencyModal: true})}
        />
        <CustomButton
          title={t('Redeem')}
          color={colors.green}
          onPress={handleRedeem}
          style={{marginBottom: Spacing.vs * 2}}
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
        />
      </View>
    </>
  );
};

export default RedeemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  inputContainer: {paddingTop: Spacing.vs, flex: 1},
});
