import React, {useState, useEffect} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {QRIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import Contract from '../../../blockchain/contract';
import {
  CustomHeader,
  Card,
  CustomButton,
  CustomTextInput,
  RegularText,
  SmallText,
  CustomLoader,
  CustomPopup,
} from '../../components';
import {useSelector} from 'react-redux';
import {ethers} from 'ethers';
import {useTranslation} from 'react-i18next';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const TransferTokenScreen = ({navigation, route}) => {
  const {balance} = useSelector(state => state.wallet);
  const {t} = useTranslation();
  const [values, setValues] = useState({
    destinationAddress: '',
    amount: '',
    showLoader: false,
    loaderMessage: '',
    showPopup: false,
    popupType: '',
    popupMessageType: '',
    popupMessage: '',
  });

  const {
    destinationAddress,
    amount,
    loaderMessage,
    showLoader,
    popupMessage,
    popupMessageType,
    popupType,
    showPopup,
  } = values;

  const {activeAppSettings} = useSelector(state => state.auth);
  const {wallet} = useSelector(state => state.wallet);

  useEffect(() => {
    if (showLoader) {
      if (!ethers?.utils.isAddress(destinationAddress)) {
        setValues({
          ...values,
          showLoader: false,
        });
        return alert(`${t('Invalid destination address')}`);
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
    if (balance < amount) {
      return setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        popupMessage: `${t('Amount cannot be greater than balance')}`,
        popupMessageType: `${t('Alert')}`,
      });
    }
    if (destinationAddress === '' || amount === '') {
      return setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        popupMessage: `${t('Please fill out all the fields')}`,
        popupMessageType: `${t('Alert')}`,
      });
    }
    setValues({
      ...values,
      showLoader: true,
      loaderMessage: `${t('Transferring token.')} ${t('Please wait...')}`,
    });
  };

  const sendERCToken = async () => {
    try {
      const tokenContract = Contract({
        wallet,
        address: activeAppSettings.agency.contracts.token,
        type: 'erc20',
      }).get();
      await tokenContract.transfer(destinationAddress, amount);
      onSuccess();
    } catch (e) {
      onError(e);
      setValues({
        ...values,
        showLoader: false,
      });
    }
  };

  const onSuccess = () => {
    let timeElapsed = Date.now();
    let timeStamp = new Date(timeElapsed);

    let receiptData = {
      timeStamp: timeStamp.toLocaleString(),
      to: destinationAddress,
      amount,
      type: 'transfer',
      agencyUrl: activeAppSettings.agencyUrl,
    };
    setValues({...values, showLoader: false});
    navigation.replace('TransferReceiptScreen', {
      receiptData,
      from: 'transferToken',
    });
  };
  const onError = e => {
    console.log(e.error, 'error');
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
        <CustomLoader message={loaderMessage} show={showLoader} />
        <CustomPopup
          show={showPopup}
          message={popupMessage}
          messageType={popupMessageType}
          popupType={popupType}
          onConfirm={() => setValues({...values, showPopup: false})}
        />
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
