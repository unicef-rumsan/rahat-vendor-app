import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../../constants/colors';
import {
  DollorIcon,
  GearIcon,
  GiftIcon,
  Logo,
  MoreDotsIcon,
  PersonIcon,
  SettingsIcon,
} from '../../../assets/icons';
import { FontSize, Spacing } from '../../../constants/utils';

import { widthPercentageToDP } from 'react-native-responsive-screen';
import IndividualStatement from '../../components/IndividualStatement';

import {
  Card,
  SmallText,
  RegularText,
  CustomButton,
  IndividualSettingView,
} from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPackageBalanceInFiat,
  getPackageBatchBalance,
  getWalletBalance,
} from '../../redux/actions/wallet';
import { useBackHandler } from '@react-native-community/hooks';
import { RNToasty } from 'react-native-toasty';
import { useIsFocused } from '@react-navigation/native';
import CustomLoader from '../../components/CustomLoader';
import { useTranslation } from 'react-i18next';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import { getPackageDetail } from '../../../constants/helper';

let BACK_COUNT = 0;

const Header = ({ title, onRightIconPress }) => (
  <SafeAreaView style={styles.headerContainer}>
    <Logo />
    <Text style={styles.headerTitle}>{title}</Text>
    <Pressable onPress={onRightIconPress} hitSlop={50}>
      <MoreDotsIcon />
    </Pressable>
  </SafeAreaView>
);

const HomeScreen = ({ navigation, route }) => {
  const refresh = route?.params?.refresh;
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['18%', '18%'], []);
  const { userData } = useSelector(state => state.auth);
  const { activeAppSettings } = useSelector(state => state.agency);
  const [userInAgencyStatus, setUserInAgencyStatus] = useState(false);

  const {
    wallet,
    tokenBalance,
    packageBalance,
    packageBalanceCurrency,
    transactions,
    storedTokenIds,
  } = useSelector(state => state.wallet);

  const [values, setValues] = useState({
    refreshing: false,
    showLoader: false,
    showBottomSheet: false,
    bottomSheetContent: '',
  });

  const { refreshing, showLoader, bottomSheetContent } = values;

  useEffect(() => {
    let temp = userData.agencies?.filter(
      data => data.agency === activeAppSettings.agency._id,
    );
    setUserInAgencyStatus(temp[0]?.status);
  }, [activeAppSettings, userData, refreshing]);

  useBackHandler(() => {
    if (route.name === 'HomeScreen' && isFocused) {
      if (BACK_COUNT < 1) {
        BACK_COUNT++;
        RNToasty.Show({
          title: `${t('Press BACK again to exit app')}`,
          position: 'center',
        });
        setTimeout(() => {
          BACK_COUNT = 0;
        }, 2000);
        return true;
      } else {
        BackHandler.exitApp();
        return false;
      }
    }
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const getBalance = () => {
    dispatch(
      getWalletBalance(
        activeAppSettings?.agency?.contracts?.rahat,
        wallet,
        activeAppSettings?.agency?.contracts?.rahat_erc20,
        activeAppSettings?.agency?.contracts?.rahat_erc1155,
      ),
    );
  };

  const getPackageBatchBalanceSuccess = async (tokenIds, batchBalance) => {
    if (tokenIds?.length && batchBalance?.length) {
      dispatch(getPackageBalanceInFiat(tokenIds, batchBalance));
      const packages = await getPackageDetail(
        { tokenIds, balances: batchBalance },
        'getPackages',
      );
      dispatch({ type: 'SET_PACKAGES', packages });
    }
    if (tokenIds?.length === 0 && batchBalance?.length === 0) {
      dispatch({
        type: 'SET_PACKAGE_BALANCE',
        packageBalance: 0,
        packageBalanceCurrency: '',
      });
    }
  };

  const getPackageBalance = async () => {
    try {
      let activeStoredTokenIds = storedTokenIds?.find(
        item => item?.agencyUrl === activeAppSettings?.agencyUrl,
      );
      if (activeStoredTokenIds?.tokenIds?.length) {
        const walletAddress = activeStoredTokenIds?.tokenIds?.map(
          () => wallet.address,
        );
        dispatch(
          getPackageBatchBalance(
            activeAppSettings?.agency?.contracts?.rahat,
            activeAppSettings?.agency?.contracts?.rahat_erc20,
            activeAppSettings?.agency?.contracts?.rahat_erc1155,
            wallet,
            walletAddress,
            activeStoredTokenIds?.tokenIds,
            getPackageBatchBalanceSuccess,
          ),
        );
      } else {
        dispatch({
          type: 'SET_PACKAGE_BALANCE',
          packageBalance: 0,
          packageBalanceCurrency: '',
        });
      }
    } catch (e) {
      console.log(e);
      dispatch({
        type: 'SET_PACKAGE_BALANCE',
        packageBalance: 0,
        packageBalanceCurrency: '',
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted || refresh) {
      getBalance();
      getPackageBalance();
    }
    return () => (isMounted = false);
  }, [route]);

  useEffect(() => {
    getPackageBalance();
  }, [storedTokenIds]);

  const onRefresh = () => {
    getBalance();
    getPackageBalance();
  };

  const renderBottomSheet = () => (
    <CustomBottomSheet
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enablePanDownToClose>
      {bottomSheetContent === 'more' ? (
        <>
          <IndividualSettingView
            icon={<PersonIcon color={colors.gray} />}
            title={'Profile'}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate('ProfileScreen');
            }}
          />
          <IndividualSettingView
            icon={<GearIcon color={colors.gray} />}
            title={'Settings'}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate('SettingsScreen');
            }}
          />
        </>
      ) : (
        <>
          <IndividualSettingView
            icon={<DollorIcon color={colors.gray} />}
            title={'Token'}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate('RedeemTokenScreen');
            }}
          />
          <IndividualSettingView
            icon={<GiftIcon color={colors.gray} />}
            title={'Packages'}
            onPress={() => {
              bottomSheetModalRef.current?.dismiss();
              navigation.navigate('RedeemPackageScreen');
            }}
          />
        </>
      )}
    </CustomBottomSheet>
  );

  return (
    <>
      <Header
        title={t('Home')}
        onRightIconPress={() => {
          setValues({ ...values, bottomSheetContent: 'more' });
          handlePresentModalPress();
        }}
      />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <CustomLoader
          show={showLoader}
          message={`${t('Switching agency.')} ${t('Please wait...')}`}
        />
        <Card>
          <View style={[styles.rowView, { paddingBottom: Spacing.vs / 2 }]}>
            <SmallText noPadding color={colors.blue}>
              {activeAppSettings.agency.name || 'Agency Name'}
            </SmallText>
            <CustomButton
              title={t('Redeem')}
              borderRadius={20}
              width={widthPercentageToDP(30)}
              capitalizeText
              outlined
              fontFamily={'Lora-Regular'}
              paddingVertical={Spacing.vs / 8}
              fontSize={FontSize.medium}
              onPress={() => {
                if (userInAgencyStatus === 'new') {
                  navigation.navigate('CheckApprovalScreen');
                }
                setValues({ ...values, bottomSheetContent: 'redeem' });
                handlePresentModalPress();
              }}
            />
          </View>
          <View style={styles.rowView}>
            <View>
              {tokenBalance === null ? (
                <ActivityIndicator size={24} color={colors.blue} />
              ) : (
                <RegularText color={colors.gray}>{tokenBalance}</RegularText>
              )}
              <RegularText
                color={colors.lightGray}
                style={{ paddingTop: Spacing.vs / 3 }}
                fontSize={FontSize.small * 1.1}>
                {t('Token Balance')}
              </RegularText>
            </View>
            <View>
              {packageBalance === null ? (
                <ActivityIndicator size={24} color={colors.blue} />
              ) : (
                <RegularText color={colors.gray}>
                  {packageBalanceCurrency} {packageBalance}
                </RegularText>
              )}
              <RegularText
                color={colors.lightGray}
                style={{ paddingTop: Spacing.vs / 3 }}
                fontSize={FontSize.small * 1.1}>
                {t('Package')}
              </RegularText>
            </View>
          </View>
        </Card>
        {userInAgencyStatus === 'new' && (
          <Card>
            <RegularText
              color={colors.gray}
              style={{
                fontSize: FontSize.medium,
                paddingVertical: Spacing.vs / 2,
              }}>
              {t('Please contact your agency for approval')}
            </RegularText>
            <CustomButton
              width={widthPercentageToDP(80)}
              title={t('Check for approval')}
              color={colors.green}
              onPress={() => navigation.navigate('CheckApprovalScreen')}
            />
          </Card>
        )}
        {transactions?.length !== 0 && (
          <>
            <View style={styles.recentTxnHeader}>
              <RegularText color={colors.black}>
                {t('Recent Transactions')}
              </RegularText>
              <Pressable
                onPress={() =>
                  navigation.navigate('StatementScreen', {
                    transactions,
                    balance,
                  })
                }>
                <RegularText color={colors.blue}>{t('VIEW ALL')}</RegularText>
              </Pressable>
            </View>
            <Card>
              {transactions?.slice(0, 3).map((item, index) => (
                <IndividualStatement
                  // lastItem={index === transactions.length - 1 ? true : false}
                  lastItem={
                    transactions.length < 4
                      ? index === transactions.length - 1
                        ? true
                        : false
                      : index === 2
                        ? true
                        : false
                  }
                  key={index}
                  balanceType={item?.balanceType}
                  transactionType={item?.transactionType}
                  icon={
                    item?.packages ? item.packages[0]?.imageUri : item?.imageUri
                  }
                  title={
                    item?.transactionType === 'charge'
                      ? `${item?.transactionType} to ...${item.chargeTo?.slice(
                        item?.chargeTo?.length - 4,
                        item?.chargeTo?.length,
                      )}`
                      : item?.transactionType === 'transfer'
                        ? `${item?.transactionType} to ...${item.to?.slice(
                          item?.to?.length - 4,
                          item?.to?.length,
                        )}`
                        : item?.transactionType === 'redeem' &&
                          item?.balanceType === 'package'
                          ? 'redeem package'
                          : 'redeem token'
                  }
                  type={item?.transactionType}
                  amount={item?.amount}
                  date={item?.timeStamp}
                  onPress={() =>
                    navigation.navigate(
                      item?.transactionType === 'charge'
                        ? 'ChargeReceiptScreen'
                        : item?.transactionType === 'transfer'
                          ? 'TransferReceiptScreen'
                          : 'RedeemReceiptScreen',
                      {
                        receiptData: item,
                      },
                    )
                  }
                />
              ))}
            </Card>
          </>
        )}
      </ScrollView>
      {renderBottomSheet()}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.hs,
    backgroundColor: colors.white,
    paddingTop: Spacing.vs * 2,
  },
  headerTitle: { fontFamily: 'Lora-Regular', fontSize: FontSize.regular },
  headerRightIcon: { height: 80, width: 30, borderRadius: 100 },
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },

  recentTxnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.vs,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
