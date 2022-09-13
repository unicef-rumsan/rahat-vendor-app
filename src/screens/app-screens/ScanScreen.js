import {ethers} from 'ethers';
import * as React from 'react';
import {Dimensions, StyleSheet, View, StatusBar, Platform} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

import * as REA from 'react-native-reanimated';
import {Svg, Rect} from 'react-native-svg';

import {PoppinsMedium, RegularText, PopupModal} from '../../components';
import {RumsanLogo} from '../../../assets/icons';
import {FontSize, Spacing, colors} from '../../constants';
import {useCallback} from 'react';

const ScanScreen = ({navigation, route}) => {
  const netInfo = useNetInfo();
  const mounted = REA.useSharedValue(true);
  const rotated = REA.useSharedValue(false);
  const isFocused = useIsFocused();
  const {type} = route.params;
  const [isActive, setIsActive] = React.useState(true);
  const [regionEnabled, setRegionEnabled] = React.useState(true);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [frameWidth, setFrameWidth] = React.useState(1280);
  const [frameHeight, setFrameHeight] = React.useState(720);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const onChargeScan = useCallback(
    res => {
      let phone, amount;
      const details = res.split('?');
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
        if (phoneDetails[1].length > 10) {
          phone = phoneDetails[1].substr(4, phoneDetails[1]?.length);
        } else {
          phone = phoneDetails[1];
        }
      }
      if (amountDetails[0] === 'amount') {
        amount = amountDetails[1];
      }

      if (phone !== undefined && amount !== undefined) {
        if (netInfo.isConnected && netInfo.isInternetReachable) {
          navigation.navigate('ChargeDrawerScreen', {phone, amount});
        } else {
          navigation.navigate('OfflineChargeDrawerScreen', {phone, amount});
        }
      }
    },
    [navigation, netInfo],
  );

  const onTransferScan = useCallback(
    res => {
      let data = res;
      if (!ethers?.utils.isAddress(data)) {
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'Invalid QR code',
        });
      }
      if (netInfo.isConnected && netInfo.isInternetReachable) {
        navigation.navigate('TransferTokenScreen', {
          destinationAddress: data,
          fromScan: true,
        });
      } else {
        return PopupModal.show({
          popupType: 'alert',
          messageType: 'Error',
          message: 'You must be online to transfer token',
        });
      }
    },
    [navigation, netInfo],
  );

  const getViewBox = () => {
    const frameSize = getFrameSize();
    const viewBox = '0 0 ' + frameSize[0] + ' ' + frameSize[1];
    updateRotated();
    return viewBox;
  };

  const getFrameSize = () => {
    let width, height;
    if (HasRotation()) {
      width = frameHeight;
      height = frameWidth;
    } else {
      width = frameWidth;
      height = frameHeight;
    }
    return [width, height];
  };

  const HasRotation = () => {
    let value = false;
    if (Platform.OS === 'android') {
      if (
        !(
          frameWidth > frameHeight &&
          Dimensions.get('window').width > Dimensions.get('window').height
        )
      ) {
        value = true;
      }
    }
    return value;
  };

  const updateRotated = () => {
    rotated.value = HasRotation();
  };

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    mounted.value = true;
    if (barcodes.length > 0 && barcodes[0].rawValue) {
      setIsActive(false);
      const result = barcodes[0].rawValue;
      if (type === 'Charge') {
        onChargeScan(result);
      } else {
        onTransferScan(result);
      }
    }
    return () => {
      setIsActive(true);
      mounted.value = false;
    };
  }, [barcodes, mounted, type, onChargeScan, onTransferScan]);

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
          isActive={isActive}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
        <Svg style={StyleSheet.absoluteFill} viewBox={getViewBox()}>
          {regionEnabled && (
            <Rect
              x={0.1 * getFrameSize()[0]}
              y={0.3 * getFrameSize()[1]}
              width={0.8 * getFrameSize()[0]}
              height={0.45 * getFrameSize()[1]}
              strokeWidth="2"
              stroke={colors.blue}
              zIndex="2"
            />
          )}
        </Svg>
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
