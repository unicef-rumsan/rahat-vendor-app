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
} from '../../components';
import {useSelector} from 'react-redux';
import {ethers} from 'ethers';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const TransferTokenScreen = ({navigation, route}) => {
  const [values, setValues] = useState({
    destinationAddress: '',
    amount: '',
    showLoader: false,
    loaderMessage: '',
  });

  const {destinationAddress, amount, loaderMessage, showLoader} = values;

  const {activeAppSettings} = useSelector(state => state.auth);
  const {wallet} = useSelector(state => state.wallet);

  useEffect(() => {
    if (showLoader) {
      if (!ethers?.utils.isAddress(destinationAddress)) {
        setValues({
          ...values,
          showLoader: false,
        });
        return alert('Invalid destination address');
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
    if (destinationAddress === '' || amount === '') {
      Alert.alert('Info', `Please fill out all the fields`, [
        {
          text: 'Ok',
        },
      ]);
      return;
    }
    setValues({
      ...values,
      showLoader: true,
      loaderMessage: 'Transferring token. Please wait...',
    });
  };

  const sendERCToken = async () => {
    // let receiptData = {
    //   // timeStamp: timeStamp.toLocaleString(),
    //   timeStamp: '25/02/2022, 10:55:13',
    //   to: destinationAddress,
    //   amount,
    //   type: 'transfer',
    // };
    // navigation.replace('TransferReceiptScreen', {
    //   receiptData,
    //   from: 'transferToken',
    // });
    try {
      const tokenContract = Contract({
        wallet,
        address: activeAppSettings.agency.contracts.token,
        type: 'erc20',
      }).get();
      // const decimal = await tokenContract.decimals();
      // let parsedAmount = ethers.utils.parseUnits(amount, decimal);
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
    // setIsSubmitting(false);
    setValues({...values, showLoader: false});
    navigation.replace('TransferReceiptScreen', {
      receiptData,
      from: 'transferToken',
    });
    // Alert.alert(
    //   'Success',
    //   `Sent ${amount} token to ${destinationAddress} successfully`,
    //   [
    //     {
    //       text: 'Ok',
    //       onPress: () => navigation.replace('Tabs'),
    //     },
    //   ],
    // );
  };
  const onError = e => {
    console.log(e.error, 'error');
    setValues({...values, showLoader: false});
    Alert.alert(
      'Error',
      `${e?.error || 'Something went wrong. Please try again'}`,
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
        title="Transfer Token"
        onBackPress={() => navigation.pop()}
      />
      <View style={styles.container}>
        <CustomLoader message={loaderMessage} show={showLoader} />

        <Card>
          <RegularText
            color={colors.black}
            style={{paddingBottom: Spacing.vs, fontSize: FontSize.medium}}>
            Transfer Token :
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
            placeholder="Enter amount"
            keyboardType="numeric"
            onChangeText={value => handleTextChange(value, 'amount')}
            value={amount}
          />

          <SmallText style={{fontSize: FontSize.small / 1.2}}>
            Important: Please double check the destination address and amount
            before transferring. Transactions cannot be reversed.
          </SmallText>

          <CustomButton
            title="Transfer Token"
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
