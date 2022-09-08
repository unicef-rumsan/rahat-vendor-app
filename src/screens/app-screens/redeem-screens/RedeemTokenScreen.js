import React, {useEffect, useState} from 'react';
import {RNToasty} from 'react-native-toasty';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {Pressable, StyleSheet, View, Keyboard} from 'react-native';
import {
  Card,
  RegularText,
  CustomHeader,
  LoaderModal,
  CustomButton,
  CustomTextInput,
  SwitchAgencyModal,
} from '../../../components';
import {TokenService} from '../../../services/chain';
import {FontSize, Spacing, colors} from '../../../constants';
import {setTransactionData} from '../../../redux/actions/transactionActions';

const RedeemTokenScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const userData = useSelector(state => state.authReducer.userData);
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);
  const transactions = useSelector(
    state => state.transactionReducer.transactions,
  );
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let temp = userData.agencies?.filter(
      data => data.agency === activeAppSettings.agency._id,
    );
    if (temp[0]?.status === 'new') {
      RNToasty.Show({
        title: 'Your account has not been approved',
        duration: 1,
      });
      navigation.pop();
    }
  }, [activeAppSettings]);

  const storeReceiptSuccess = receiptData => {
    LoaderModal.hide();
    navigation.replace('RedeemReceiptScreen', {
      receiptData,
    });
  };

  const storeReceipt = receiptData => {
    let updatedTransactions = [];

    if (transactions?.length) {
      updatedTransactions = [receiptData, ...transactions];
    } else {
      updatedTransactions = [receiptData];
    }

    dispatch(setTransactionData({transactions: updatedTransactions}));

    storeReceiptSuccess(receiptData);
  };

  const handleRedeem = async () => {
    let timeElapsed = Date.now();
    let timeStamp = new Date(timeElapsed);
    Keyboard.dismiss();

    if (amount === '' || amount === '0') {
      setErrorMessage('Enter amount to redeem');
      return;
    }
    if (amount > tokenBalance) {
      setErrorMessage('Amount cannot be greater than balance');
      return;
    }

    LoaderModal.show({
      message: 'Please wait...',
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
      LoaderModal.hide();
    }
  };

  const _onSwitchAgency = () => SwitchAgencyModal.show();

  return (
    <>
      <CustomHeader title={'Redeem'} onBackPress={() => navigation.pop()} />

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
              Enter amount to redeem :
            </RegularText>
            <Pressable onPress={() => setAmount(tokenBalance.toString())}>
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
          />
        </View>
        {/* <CustomButton
          title={'Switch Agency'}
          outlined
          onPress={_onSwitchAgency}
        /> */}
        <CustomButton
          title={'Redeem'}
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
