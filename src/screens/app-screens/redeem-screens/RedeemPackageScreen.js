import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RNToasty } from 'react-native-toasty';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import {
  Card,
  CustomHeader,
  RegularText,
  CustomButton,
  IndividualPackageView,
  PopupModal,
  LoaderModal,
} from '../../../components';
import { ERC1155_Service } from '../../../services/chain';
import { FontSize, Spacing, colors } from '../../../constants';
import { getPackageBalanceInFiat, setWalletData } from '../../../redux/actions/walletActions';
import { setTransactionData } from '../../../redux/actions/transactionActions';

const RedeemPackageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const wallet = useSelector(state => state.walletReducer.wallet);
  const userData = useSelector(state => state.authReducer.userData);
  const packages = useSelector(state => state.walletReducer.packages);
  const packageIds = useSelector(state => state.walletReducer.packageIds);
  const transactions = useSelector(state => state.transactionReducer.transactions);
  const activeAppSettings = useSelector(state => state.agencyReducer.activeAppSettings);

  const [values, setValues] = useState({
    selectedPackages: [],
  });
  const {
    selectedPackages,
  } = values;

  useEffect(() => {
    let temp = userData.agencies?.filter(
      data => data.agency === activeAppSettings?.agency?._id,
    );
    if (temp[0]?.status === 'new') {
      RNToasty.Show({
        title: `${t('Your account has not been approved')}`,
        duration: 1,
      });
      navigation.pop();
    }
  }, [activeAppSettings]);

  const storeReceiptSuccess = (receiptData) => {
    LoaderModal.hide();
    RNToasty.Success({ title: `${t('Success')}`, duration: 1 });
    navigation.replace('RedeemReceiptScreen', {
      receiptData,
    });
  }

  const storeReceipt = (receiptData, selectedTokenIds) => {
    let updatedPackageIds = [], updatedTransactions = [];

      updatedPackageIds = packageIds?.map((item) => {
        if (item.agencyUrl === activeAppSettings.agencyUrl) {
          item.tokenIds = item.tokenIds.filter(value => !selectedTokenIds.includes(value))
        }
        return item
      })

    if (transactions?.length) {
      updatedTransactions = [receiptData, ...transactions];
    } else {
      updatedTransactions = [receiptData];
    }

    dispatch(setWalletData({ packageIds: updatedPackageIds }));
    dispatch(setTransactionData({ transactions: updatedTransactions }));

    storeReceiptSuccess(receiptData);
  }

  const onGetBalanceinFiatSuccess = async (
    balanceInFiat,
    tokenIds,
    amounts,
  ) => {
    let timeElapsed, timeStamp;
    timeElapsed = Date.now();
    timeStamp = new Date(timeElapsed);
    try {
      const receipt = await ERC1155_Service(
        activeAppSettings?.agency?.contracts?.rahat, //agency address
        activeAppSettings?.agency?.contracts?.rahat_erc20,
        activeAppSettings?.agency?.contracts?.rahat_erc1155,
        wallet,
      ).batchRedeem(
        wallet.address,
        activeAppSettings?.agency?.contracts?.rahat_admin,
        tokenIds,
        // [1],
        amounts,
        [],
      );
      let receiptData = {
        timeStamp: timeStamp.toLocaleString(),
        to: receipt.to,
        transactionHash: receipt?.transactionHash,
        amount: balanceInFiat,
        transactionType: 'redeem',
        balanceType: 'package',
        agencyUrl: activeAppSettings.agencyUrl,
        packages: selectedPackages,
      };

      storeReceipt(receiptData, tokenIds)
    } catch (e) {
      // alert(e);
      LoaderModal.hide();
    }
  };

  const onGetBalanceinFiatError = () => {
    LoaderModal.hide();
    PopupModal.show({
      popupType: 'alert',
      messageType: 'Error',
      message: 'Error while getting balance in fiat'
    })
  };

  const handleRedeem = async () => {
    let tokenIds = [],
      amounts = [];

    LoaderModal.show({
      message: 'Please wait...'
    })

    selectedPackages.map(item => {
      tokenIds = [...tokenIds, item.tokenId];
      amounts = [...amounts, item.balance];
    });

    dispatch(
      getPackageBalanceInFiat(
        tokenIds,
        amounts,
        onGetBalanceinFiatSuccess,
        onGetBalanceinFiatError,
      ),
    );
  };

  const handlePackageSelect = (item, value) => {
    if (value) {
      setValues({ ...values, selectedPackages: [...selectedPackages, item] });
    } else {
      let temp = selectedPackages.filter(i => i.tokenId !== item.tokenId);
      setValues({ ...values, selectedPackages: temp });
    }
  };

  return (
    <>
      <CustomHeader title={'Redeem'} onBackPress={() => navigation.pop()} />

      <View style={styles.container}>
        <RegularText
          fontSize={FontSize.medium}
          color={colors.gray}
          style={{ paddingVertical: Spacing.vs / 2 }}>
          {activeAppSettings.agency.name}
        </RegularText>
        <Card>
          <RegularText fontSize={FontSize.medium}>
            Packages
          </RegularText>
          <View style={styles.selectAllCheckBox}>
            <CheckBox
              style={{ marginRight: Spacing.hs / 2 }}
              value={
                packages?.length && packages.length === selectedPackages.length
                  ? true
                  : false
              }
              onValueChange={value =>
                value
                  ? setValues({ ...values, selectedPackages: packages })
                  : setValues({ ...values, selectedPackages: [] })
              }
              tintColor={colors.blue}
              tintColors={{ true: colors.blue, false: colors.gray }}
            />
            <RegularText fontSize={FontSize.medium}>
              Select All
            </RegularText>
          </View>
          {packages?.map((item, index) => (
            <IndividualPackageView
              selectable
              isSelected={selectedPackages.some(
                i => i.tokenId === item.tokenId,
              )}
              onSelect={value => handlePackageSelect(item, value)}
              key={index}
              icon={
                <Image
                  source={{
                    uri: `https://ipfs.rumsan.com/ipfs/${item.imageUri}`,
                  }}
                  style={styles.packageIcon}
                />
              }
              title={item.name}
              balance={item.balance}
            />
          ))}
        </Card>

        <CustomButton
          title={'Redeem'}
          color={colors.green}
          onPress={handleRedeem}
          style={{ marginBottom: Spacing.vs * 2 }}
          disabled={selectedPackages.length === 0 && true}
        />
      </View>
    </>
  );
};

export default RedeemPackageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  inputContainer: { paddingTop: Spacing.vs, flex: 1 },
  packageIcon: {
    height: hp(6),
    width: wp(9),
    marginRight: Spacing.hs,
  },
  selectAllCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.vs,
  },
});
