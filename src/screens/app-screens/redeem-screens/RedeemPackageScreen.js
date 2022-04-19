import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../../constants/colors';
import {FontSize, Spacing} from '../../../../constants/utils';
import {
  CustomHeader,
  Card,
  RegularText,
  CustomButton,
} from '../../../components';
import CustomLoader from '../../../components/CustomLoader';

import {useTranslation} from 'react-i18next';
import {ERC1155_Service, TokenService} from '../../../services/chain';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import IndividualPackageView from '../../../components/IndividualPackageView';
import CheckBox from '@react-native-community/checkbox';
import {getPackageBalanceInFiat} from '../../../redux/actions/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RedeemPackageScreen = ({navigation, route}) => {
  // const agencyName = route.params?.agencyName;
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {packages, wallet, packageTokenIds} = useSelector(
    state => state.wallet,
  );

  const {activeAppSettings, userData} = useSelector(state => state.auth);
  // const [amount, setAmount] = useState('');
  const [values, setValues] = useState({
    isSubmitting: false,
    showLoader: false,
    loaderMessage: '',
    combinedPackages: [],
    selectedPackages: [],
  });
  const {
    isSubmitting,
    loaderMessage,
    showLoader,
    combinedPackages,
    selectedPackages,
  } = values;

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

      let updatedPackageTokenIds = packageTokenIds.filter(
        obj => tokenIds.indexOf(obj) === -1,
      );
      let remainingPackages = packages.filter(
        item => selectedPackages.indexOf(item) === -1,
      );

      AsyncStorage.setItem('packages', JSON.stringify(remainingPackages))
        .then(() => {
          dispatch({
            type: 'SET_PACKAGE_TOKEN_IDS',
            packageTokenIds: updatedPackageTokenIds,
          });
          dispatch({
            type: 'SET_PACKAGES',
            packages: remainingPackages,
          });
          navigation.replace('RedeemReceiptScreen', {
            receiptData,
            from: 'redeemScreen',
          });
        })
        .catch(e => alert('Error while storing updated packages'));
    } catch (e) {
      console.log(e);
      alert(e);
      setValues({...values, isSubmitting: false});
    }
  };

  const onGetBalanceinFiatError = () => {
    alert('Error while getting balance in fiat');
    setValues(values => ({...values, isSubmitting: false}));
  };

  const handleRedeem = async () => {
    let tokenIds = [],
      amounts = [];

    setValues({...values, isSubmitting: true});

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
      setValues({...values, selectedPackages: [...selectedPackages, item]});
    } else {
      let temp = selectedPackages.filter(i => i.tokenId !== item.tokenId);
      setValues({...values, selectedPackages: temp});
    }
  };

  return (
    <>
      <CustomHeader title={t('Redeem')} onBackPress={() => navigation.pop()} />

      <CustomLoader show={showLoader} message={loaderMessage} />
      <View style={styles.container}>
        <RegularText
          fontSize={FontSize.medium}
          color={colors.gray}
          style={{paddingVertical: Spacing.vs / 2}}>
          {activeAppSettings.agency.name}
        </RegularText>
        <Card>
          <RegularText fontSize={FontSize.medium}>{t('Packages')}</RegularText>
          <View style={styles.selectAllCheckBox}>
            <CheckBox
              style={{marginRight: Spacing.hs / 2}}
              value={
                packages?.length && packages.length === selectedPackages.length
                  ? true
                  : false
              }
              onValueChange={value =>
                value
                  ? setValues({...values, selectedPackages: packages})
                  : setValues({...values, selectedPackages: []})
              }
              tintColor={colors.blue}
              tintColors={{true: colors.blue, false: colors.gray}}
            />
            <RegularText fontSize={FontSize.medium}>
              {t('Select All')}
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
              amount={item.amount}
            />
          ))}
        </Card>

        <CustomButton
          title={t('Redeem')}
          color={colors.green}
          onPress={handleRedeem}
          style={{marginBottom: Spacing.vs * 2}}
          disabled={isSubmitting || (selectedPackages.length === 0 && true)}
          isSubmitting={isSubmitting}
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
  inputContainer: {paddingTop: Spacing.vs, flex: 1},
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
