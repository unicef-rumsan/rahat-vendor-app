import {ethers} from 'ethers';
import {useTranslation} from 'react-i18next';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Alert, Pressable, StatusBar, StyleSheet} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import {
  Card,
  SmallText,
  RegularText,
  CustomHeader,
  CustomButton,
  CustomTextInput,
  PopupModal,
  LoaderModal,
} from '../../components';
import {QRIcon} from '../../../assets/icons';
import Contract from '../../../blockchain/contract';
import {FontSize, Spacing, colors} from '../../constants';
import {setTransactionData} from '../../redux/actions/transactionActions';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const TransferTokenScreen = ({navigation, route}) => {
  const wallet = useSelector(state => state.walletReducer.wallet);
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );
  const transactions = useSelector(
    state => state.transactionReducer.transactions,
  );

  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    amount: '',
    showLoader: false,
    destinationAddress: '',
  });

  const {amount, showLoader, destinationAddress} = values;

  useEffect(() => {
    if (showLoader) {
      if (!ethers?.utils.isAddress(destinationAddress)) {
        setValues({
          ...values,
          showLoader: false,
        });
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Invalid destination address',
        });
      }
      sendERCToken();
    }
  }, [showLoader]);

  useEffect(() => {
    if (route.params?.fromScan) {
      setValues({
        ...values,
        destinationAddress: route.params.destinationAddress,
      });
    }
  }, [route]);

  const handleTransferToken = () => {
    if (tokenBalance < amount) {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Alert',
        message: 'Amount cannot be greater than balance',
      });
    }
    if (destinationAddress === '' || amount === '') {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Alert',
        message: 'Please fill out all the fields',
      });
    }

    setValues({...values, showLoader: true});
    LoaderModal.show({
      message: 'Please wait...',
    });
  };

  const sendERCToken = async () => {
    try {
      const tokenContract = Contract({
        wallet,
        address: activeAppSettings.agency.contracts.rahat_erc20,
        type: 'erc20',
      }).get();
      await tokenContract.transfer(destinationAddress, amount);
      onSuccess();
    } catch (e) {
      onError(e);
      LoaderModal.hide();
    }
  };

  const storeReceiptSuccess = receiptData => {
    setValues({...values, showLoader: false});
    navigation.navigate('TransferReceiptScreen', {
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

  const onSuccess = () => {
    let timeElapsed = Date.now();
    let timeStamp = new Date(timeElapsed);

    let receiptData = {
      timeStamp: timeStamp.toLocaleString(),
      to: destinationAddress,
      amount,
      transactionType: 'transfer',
      balanceType: 'token',
      agencyUrl: activeAppSettings.agencyUrl,
    };
    storeReceipt(receiptData);
  };
  const onError = e => {
    setValues({...values, showLoader: false});
    Alert.alert(
      'Error',
      `${e?.error || `${t('Something went wrong. Please try again')}`}`,
      [
        {
          text: 'Ok',
        },
      ],
    );
  };

  const handleTextChange = (value, name) => {
    let tempValue;
    if (name === 'amount') {
      tempValue = value.replace(/[^0-9]/g, '');
    } else {
      tempValue = value;
    }
    setValues({
      ...values,
      [name]: tempValue,
    });
  };

  return (
    <>
      <CustomHeader
        title={t('Transfer Token')}
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <Card>
          <RegularText
            color={colors.black}
            style={{paddingBottom: Spacing.vs, fontSize: FontSize.medium}}>
            {t('Transfer Token')} :
          </RegularText>
          <View style={{flexDirection: 'row'}}>
            <CustomTextInput
              placeholder="Destination Address"
              style={{width: widthPercentageToDP(64)}}
              onChangeText={value =>
                handleTextChange(value, 'destinationAddress')
              }
              value={destinationAddress}
            />
            <View style={styles.buttonContainer}>
              <View style={styles.buttonView}>
                <Pressable
                  style={styles.qrButton}
                  onPress={() =>
                    navigation.navigate('ScanScreen', {
                      type: 'Transfer',
                    })
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
          <CustomTextInput
            placeholder={t('Enter amount')}
            keyboardType="numeric"
            onChangeText={value => handleTextChange(value, 'amount')}
            value={amount}
          />

          <SmallText style={{fontSize: FontSize.small / 1.2}}>
            {t(
              'Important: Please double check the destination address and amount before transferring. Transactions cannot be reversed.',
            )}
          </SmallText>

          <CustomButton
            title={t('Transfer Token')}
            color={colors.green}
            width={widthPercentageToDP(80)}
            // onPress={() => navigation.navigate('AgencyScreen')}
            onPress={handleTransferToken}
          />
        </Card>
      </View>
    </>
  );
};

export default TransferTokenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  header: {
    paddingTop: androidPadding,
    marginVertical: Spacing.vs,
    backgroundColor: colors.white,
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
