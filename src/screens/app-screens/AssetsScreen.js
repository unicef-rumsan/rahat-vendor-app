import {ethers} from 'ethers';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {StatusBar, StyleSheet, View, Pressable, Platform} from 'react-native';
import {FontSize, Spacing, colors} from '../../constants';
import {CustomButton, CustomHeader, Card, RegularText} from '../../components';
import {apiGetAppSettings, apiGetContractAbi} from '../../redux/api';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

// TODO
// get rahatWalletAbi from https://unicef-api.xa.rahat.io/api/v1/app/contracts/rahat_wallet
// get rahatWalletAddress from  rahat.vendorBalance(vendorAddress) =>  walletAddress

// vendorWalletInstance = makeContract(rahatWalletAbi,rahaWalletAddress)

// accept Cash Token:
//  - vendorWalletInstance.claimToken(rahat_cash_address,rahatAddress,cashAllowance)

const AssetsScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const [cashBalance, setCashBalance] = useState(0);
  const [isCashAvailable, setCashAvailable] = useState(false);
  const [cashAllowance, setCashAllowance] = useState(0);
  const [rahatWalletAbi, setRahatWalletAbi] = useState(null);
  const [rahatAbi, setRahatAbi] = useState(null);
  const [rahatWalletAddress, setRahatWalletAddress] = useState('');
  const [contractsAddresses, setContractsAddresses] = useState(null);
  const [VendorContract, setVendorContract] = useState(null);
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);
  // Importing the AsyncStorage Data
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );
  const wallet = useSelector(state => state.walletReducer.wallet);

  useEffect(() => {
    async function getAllContracts() {
      const {data} = await apiGetAppSettings(activeAppSettings?.agencyUrl);
      setContractsAddresses(data?.agency?.contracts);
    }
    getAllContracts();
  }, [activeAppSettings?.agencyUrl]);

  useEffect(() => {
    async function getRahatWalletABI() {
      try {
        const {
          data: {abi},
        } = await apiGetContractAbi(
          activeAppSettings?.agencyUrl,
          'rahat_wallet',
        );
        setRahatWalletAbi(abi);
      } catch (e) {
        console.log('err', e);
      }
    }
    getRahatWalletABI();
  }, [activeAppSettings?.agencyUrl]);

  useEffect(() => {
    async function getRahatABI() {
      try {
        const {
          data: {abi},
        } = await apiGetContractAbi(activeAppSettings?.agencyUrl, 'rahat');
        setRahatAbi(abi);
      } catch (e) {
        console.log('err', e);
      }
    }
    getRahatABI();
  }, [activeAppSettings?.agencyUrl]);

  const getRahatWalletAddress = useCallback(async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        activeAppSettings?.networkUrl,
      );
      const rahatContract = new ethers.Contract(
        contractsAddresses?.rahat,
        rahatAbi,
        provider,
      );

      const [walletAddress, cashAllow, cashBal] =
        await rahatContract.vendorBalance(wallet?.address);
      if (walletAddress) {
        setRahatWalletAddress(walletAddress);
        setCashAllowance(cashAllow.toNumber());
        setCashBalance(cashBal.toNumber());
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    activeAppSettings?.networkUrl,
    contractsAddresses,
    rahatAbi,
    wallet?.address,
  ]);

  const makeVendorContract = useCallback(() => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        activeAppSettings?.networkUrl,
      );
      const VendorContracts = new ethers.Contract(
        rahatWalletAddress,
        rahatWalletAbi,
        provider,
      );
      setVendorContract(VendorContracts);
    } catch (e) {
      console.log(e);
    }
  }, [activeAppSettings?.networkUrl, rahatWalletAbi, rahatWalletAddress]);

  const cashAccept = async () => {
    const isAccepted = await VendorContract.claimToken(
      contractsAddresses.rahat_wallet,
      contractsAddresses.rahat,
      cashAllowance,
    );
    if (isAccepted) {
      setCashAvailable(false);
    }
  };

  const getVendorData = useCallback(async () => {
    try {
      await getRahatWalletAddress();
      makeVendorContract();
    } catch (e) {
      console.log('err', e);
    }
  }, [getRahatWalletAddress, makeVendorContract]);

  useEffect(() => {
    getVendorData();
  }, [getVendorData]);

  useEffect(() => {
    setCashAvailable(true);
  }, [cashAllowance]);

  console.log({isCashAvailable, cashAllowance, cashBalance});

  return (
    <>
      <CustomHeader title={'Assets'} hideBackButton />

      <View style={styles.container}>
        {isCashAvailable ? (
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
