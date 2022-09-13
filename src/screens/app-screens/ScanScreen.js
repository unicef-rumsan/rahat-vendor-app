import {ethers} from 'ethers';
import * as React from 'react';
import {StyleSheet, View, StatusBar, Text} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {Polygon, Text as SVGText, Svg, Rect} from 'react-native-svg';

import {PoppinsMedium, RegularText, PopupModal} from '../../components';
import {RumsanLogo} from '../../../assets/icons';
import {FontSize, Spacing, colors} from '../../constants';

//       <QRCodeScanner
//         showMarker
//         vibrate={false}
//         reactivate
//         markerStyle={{borderColor: colors.blue}}
//         cameraStyle={{height: '100%', backgroundColor: colors.blue}}
//         onRead={type === 'Charge' ? onChargeScan : onTransferScan}
//       />
const ScanScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {type} = route.params;
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const onChargeScan = res => {
    let phone, amount;
    const details = res.data.split('?');
    const phoneDetails = details[0]?.split(':');
    const amountDetails = details[1]?.split('=');
    if (phoneDetails[0] !== 'phone' || amountDetails[0] !== 'amount') {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: 'Invalid QR code',
      });
    }
    if (phoneDetails[0] === 'phone') {
      phone = phoneDetails[1].substr(4, phoneDetails[1]?.length);
    }
    if (amountDetails[0] === 'amount') {
      amount = amountDetails[1];
    }

    if (phone !== undefined && amount !== undefined) {
      navigation.navigate('ChargeDrawerScreen', {phone, amount});
    }
  };

  const onTransferScan = res => {
    let data = res.data;
    if (!ethers?.utils.isAddress(data)) {
      return PopupModal.show({
        popupType: 'alert',
        messageType: 'Error',
        message: 'Invalid QR code',
      });
    }
    navigation.navigate('TransferTokenScreen', {
      destinationAddress: data,
      fromScan: true,
    });
  };

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    console.log(barcodes);
  }, [barcodes]);

  return (
    device != null &&
    hasPermission && (
      <View style={styles.container}>
        {isFocused && (
          <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
        )}
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        {barcodes.map((barcode, idx) => (
          <Text key={idx} style={styles.barcodeTextURL}>
            {barcode.displayValue}
          </Text>
        ))}
        <View style={styles.alignCenter}>
          <PoppinsMedium
            color={colors.white}
            fontSize={FontSize.large * 1.2}
            style={{textAlign: 'center', top: 30}}>
            Scan &amp; {type}
          </PoppinsMedium>

          <PoppinsMedium
            color={colors.white}
            fontSize={FontSize.small / 1.1}
            style={styles.text}>
            Please align the QR code within the frame
          </PoppinsMedium>
        </View>

        <View style={styles.poweredByView}>
          <RegularText
            color={colors.white}
            style={{
              textAlign: 'center',
              paddingHorizontal: Spacing.hs / 3,
              fontSize: FontSize.small,
            }}>
            Powered By
          </RegularText>
          <RumsanLogo />
        </View>
      </View>
    )
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
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
});
