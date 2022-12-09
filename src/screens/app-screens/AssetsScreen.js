import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import {StatusBar, StyleSheet, View, Pressable, Platform} from 'react-native';
import {FontSize, Spacing, colors} from '../../constants';
import {CustomButton, CustomHeader, Card, RegularText} from '../../components';
import {getBalances} from '../../redux/actions/walletActions';
import {LoaderModal} from '../../components/LoaderModal';
import {makeWalletContract} from '../../services/chain';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const AssetsScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [VendorContract, setVendorContract] = useState(null);
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);
  // Importing the AsyncStorage Data
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );
  const wallet = useSelector(state => state.walletReducer.wallet);
  const cashAllowance = useSelector(state => state.walletReducer.cashAllowance);
  const vendorWalletContract = useSelector(
    state => state.walletReducer.vendorWalletContract,
  );
  const cashBalance = useSelector(state => state.walletReducer.cashBalance);

  const fetchBalances = () => {
    if (wallet) {
      dispatch(getBalances(wallet, activeAppSettings));
    }
  };

  const makeVendorWalletContract = useCallback(() => {
    try {
      const VendorContracts = makeWalletContract(vendorWalletContract, wallet);
      setVendorContract(VendorContracts);
    } catch (e) {
      console.log(e);
    }
  }, [vendorWalletContract, wallet]);

  const cashAccept = async () => {
    try {
      LoaderModal.show({message: 'Accepting Cash...'});
      const tx = await VendorContract.claimToken(
        activeAppSettings?.agency?.contracts?.rahat_cash || '',
        activeAppSettings?.agency?.contracts?.rahat || '',
        cashAllowance,
      );
      const receipt = await tx.wait();
      if (receipt.status) {
        RNToasty.Success({
          title: 'Cash Accepted',
          duration: 0,
          position: 'top',
        });
      } else {
        RNToasty.Error({
          title: 'Transaction Fialed',
          duration: 1,
          position: 'top',
        });
      }
    } catch (e) {
      console.log(e);
      RNToasty.Error({
        title: 'Transaction Error',
        duration: 1,
        position: 'top',
      });
    } finally {
      LoaderModal.hide();
      fetchBalances();
    }
  };

  useEffect(() => {
    let processing = true;
    if (processing) {
      fetchBalances();
    }
    return () => (processing = false);
  }, []);

  useEffect(() => {
    makeVendorWalletContract();
  }, [makeVendorWalletContract]);

  return (
    <>
      <CustomHeader title={'Assets'} hideBackButton />

      <View style={styles.container}>
        {cashAllowance ? (
          <Card style={styles.cashAcceptCard}>
            <RegularText color={colors.gray} style={styles.cashAlert}>
              {`You have received ${cashAllowance} cash from Palika`}
            </RegularText>
            <CustomButton
              color={colors.blue}
              title={t('Accept')}
              width={widthPercentageToDP(35)}
              disabled={false}
              onPress={cashAccept}
            />
          </Card>
        ) : null}
        <Pressable onPress={() => navigation.navigate('RedeemTokenScreen')}>
          <Card style={styles.tokenDetailCard}>
            <RegularText
              color={colors.gray}
              style={{fontSize: FontSize.medium * 1.1}}>
              Token Balance:
            </RegularText>
            <RegularText
              color={colors.gray}
              style={{
                fontSize: FontSize.medium * 1.1,
                paddingHorizontal: Spacing.hs,
              }}>
              {tokenBalance}
            </RegularText>
          </Card>
        </Pressable>
        <Card style={styles.tokenDetailCard}>
          <RegularText
            color={colors.gray}
            style={{fontSize: FontSize.medium * 1.1}}>
            Cash Balance:
          </RegularText>
          <RegularText
            color={colors.gray}
            style={{
              fontSize: FontSize.medium * 1.1,
              paddingHorizontal: Spacing.hs,
            }}>
            {cashBalance}
          </RegularText>
        </Card>
      </View>
    </>
  );
};

export default AssetsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  tokenDetailCard: {
    paddingVertical: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cashAcceptCard: {
    paddingVertical: Spacing.vs * 0.8,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cashAlert: {
    fontSize: FontSize.medium * 1.1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
