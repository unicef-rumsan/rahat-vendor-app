import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Alert} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../../constants/colors';
import {FontSize, Spacing} from '../../../../constants/utils';
import {
  CustomHeader,
  Card,
  RegularText,
  SmallText,
  CustomTextInput,
  CustomButton,
  CustomLoader,
  SwitchAgencyModal,
} from '../../../components';
import {
  switchAgency,
  switchAgencyClearError,
} from '../../../redux/actions/agency';
import {useTranslation} from 'react-i18next';
import {TokenService} from '../../../services/chain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toggleSwitchAgencyModal} from '../../../redux/actions/agency';

const RedeemTokenScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {tokenBalance, wallet} = useSelector(state => state.wallet);
  const {userData} = useSelector(state => state.auth);
  const {
    switchingAgency,
    switchAgencyLoaderMessage,
    switchAgencyErrorMessage,
    activeAppSettings,
    appSettings,
    showSwitchAgencyModal,
    switchAgencyError,
  } = useSelector(state => state.agency);

  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [values, setValues] = useState({
    showLoader: false,
    loaderMessage: '',
  });
  const {loaderMessage, showLoader} = values;

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

  const storeReceiptSuccess = receiptData => {
    setValues({...values, showLoader: false});
    navigation.replace('RedeemReceiptScreen', {
      receiptData,
    });
  };

  const storeReceipt = async receiptData => {
    try {
      let transactions,
        parsedTransactions = [],
        finalTransactions = [];
      transactions = await AsyncStorage.getItem('transactions');

      if (transactions !== null) {
        parsedTransactions = JSON.parse(transactions);
        finalTransactions = [receiptData, ...parsedTransactions];
      } else {
        finalTransactions = [receiptData];
      }
      await AsyncStorage.setItem(
        'transactions',
        JSON.stringify(finalTransactions),
      );
      dispatch({type: 'SET_TRANSACTIONS', transactions: finalTransactions});
      storeReceiptSuccess(receiptData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRedeem = async () => {
    let timeElapsed = Date.now();
    let timeStamp = new Date(timeElapsed);

    if (amount === '' || amount === '0') {
      setErrorMessage(`${t('Enter amount to redeem')}`);
      return;
    }
    if (amount > tokenBalance) {
      setErrorMessage(`${t('Amount cannot be greater than balance')}`);
      return;
    }
    setValues({
      ...values,
      showLoader: true,
      loaderMessage: `${t('Please wait...')}`,
    });
    try {
      const receipt = await TokenService(
        activeAppSettings?.agency?.contracts?.rahat, //agency address
        wallet,
        activeAppSettings?.agency?.contracts?.rahat_erc20,
        activeAppSettings?.agency?.contracts?.rahat_erc1155,
      ).transfer(activeAppSettings.agency.contracts.rahat_admin, amount);

      let receiptData = {
        timeStamp: timeStamp.toLocaleString(),
        to: receipt.to,
        amount,
        transactionType: 'redeem',
        balanceType: 'token',
        agencyUrl: activeAppSettings.agencyUrl,
      };

      storeReceipt(receiptData);
    } catch (e) {
      console.log(e);
      setValues({...values, showLoader: false});
    }
  };

  const handleSwitchAgency = agencyUrl => {
    const newActiveAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(switchAgency(newActiveAppSettings, wallet));
  };

  return (
    <>
      <CustomHeader title={t('Redeem')} onBackPress={() => navigation.pop()} />
      {switchAgencyError &&
        Alert.alert('Error', `${switchAgencyErrorMessage}`, [
          {text: 'OK', onPress: () => dispatch(switchAgencyClearError())},
        ])}
      <SwitchAgencyModal
        activeAgency={activeAppSettings}
        agencies={appSettings}
        show={showSwitchAgencyModal}
        onPress={handleSwitchAgency}
        hide={() => dispatch(toggleSwitchAgencyModal(showSwitchAgencyModal))}
      />
      <CustomLoader
        show={showLoader || switchingAgency}
        message={loaderMessage || switchAgencyLoaderMessage}
      />
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
                {t('Token Balance')}
              </RegularText>
            </View>
            <RegularText color={colors.black}>{tokenBalance}</RegularText>
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
              {t('Enter amount to redeem')} :
            </RegularText>
            <Pressable onPress={() => setAmount(tokenBalance.toString())}>
              <RegularText fontSize={FontSize.medium} color={colors.blue}>
                {t('MAX')}
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
          />
        </View>
        <CustomButton
          title={t('Switch Agency')}
          outlined
          onPress={() =>
            dispatch(toggleSwitchAgencyModal(showSwitchAgencyModal))
          }
        />
        <CustomButton
          title={t('Redeem')}
          color={colors.green}
          onPress={handleRedeem}
          style={{marginBottom: Spacing.vs * 2}}
        />
      </View>
    </>
  );
};

export default RedeemTokenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  inputContainer: {paddingTop: Spacing.vs, flex: 1},
});
