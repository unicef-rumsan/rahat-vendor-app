import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  BackHandler,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { RNToasty } from 'react-native-toasty';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { widthPercentageToDP } from 'react-native-responsive-screen';

import {
  Logo,
  DollorIcon,
  GearIcon,
  GiftIcon,
  MoreDotsIcon,
  PersonIcon,
} from '../../../assets/icons';
import {
  Card,
  SmallText,
  RegularText,
  CustomButton,
  IndividualStatement,
  IndividualSettingView,
  CustomBottomSheet,
} from '../../components';
import { FontSize, Spacing, colors } from '../../constants';
import { getPackageDetail } from '../../helpers/nftPackageHelpers';
import {
  setWalletData,
  getWalletBalance,
  getPackageBalanceInFiat,
  getPackageBatchBalance,
} from '../../redux/actions/walletActions';

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
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['18%', '18%'], []);
  const userData = useSelector(state => state.authReducer.userData);
  const [userInAgencyStatus, setUserInAgencyStatus] = useState(false);

  const wallet = useSelector(state => state.walletReducer.wallet);
  const packageIds = useSelector(state => state.walletReducer.packageIds);
  const packages = useSelector(state => state.walletReducer.packages);
  const tokenBalance = useSelector(state => state.walletReducer.tokenBalance);
  const packageBalance = useSelector(state => state.walletReducer.packageBalance);
  const transactions = useSelector(state => state.transactionReducer.transactions);
  const activeAppSettings = useSelector(state => state.agencyReducer.activeAppSettings);
  const packageBalanceCurrency = useSelector(state => state.walletReducer.packageBalanceCurrency);
  const [values, setValues] = useState({
    refreshing: false,
    showBottomSheet: false,
    bottomSheetContent: '',
  });

  const { refreshing, bottomSheetContent } = values;

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
          title: `${'Press BACK again to exit app'}`,
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

  // useEffect(() => {
  //   // LoaderModal.show();
  // }, [])

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const getBalance = () => {
    if (wallet) {
      dispatch(
        getWalletBalance(
          wallet,
          activeAppSettings,
        ),
      );
    }
  };

  const getPackageBatchBalanceSuccess = async (tokenIds, batchBalance) => {
    if (tokenIds?.length && batchBalance?.length) {
      dispatch(getPackageBalanceInFiat(tokenIds, batchBalance));

      const packages = await getPackageDetail(
        { tokenIds, balances: batchBalance },
        'getPackages',
      );


      dispatch(setWalletData({
        packages
      }));
    }
    if (tokenIds?.length === 0 && batchBalance?.length === 0) {
      dispatch(setWalletData({
        packageBalance: 0,
        packageBalanceCurrency: '',
      }));
    }
  };

  const getPackageBalance = async () => {
    try {
      let activePackageIds = packageIds?.find(
        item => item?.agencyUrl === activeAppSettings?.agencyUrl,
      );
      if (activePackageIds?.tokenIds?.length) {
        const walletAddress = activePackageIds?.tokenIds?.map(
          () => wallet.address,
        );
        dispatch(
          getPackageBatchBalance(
            activeAppSettings?.agency?.contracts?.rahat,
            activeAppSettings?.agency?.contracts?.rahat_erc20,
            activeAppSettings?.agency?.contracts?.rahat_erc1155,
            wallet,
            walletAddress,
            activePackageIds?.tokenIds,
            getPackageBatchBalanceSuccess,
          ),
        );
      } else {
        dispatch(setWalletData({
          packages: [],
          packageBalance: 0,
          packageBalanceCurrency: '',
        }));
      }
    } catch (e) {
      dispatch(setWalletData({
        packageBalance: 0,
        packageBalanceCurrency: '',
      }));
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
  }, [packageIds]);

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
        title={'Home'}
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
        <Card>
          <View style={[styles.rowView, { paddingBottom: Spacing.vs / 2 }]}>
            <SmallText noPadding color={colors.blue}>
              {activeAppSettings.agency.name || 'Agency Name'}
            </SmallText>
            <CustomButton
              title={'Redeem'}
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
                Token Balance
              </RegularText>
            </View>
            <View>
              {packageBalance === null ? (
                <ActivityIndicator size={24} color={colors.blue} />
              ) : (
                <RegularText color={colors.gray}>
                  {`${packageBalanceCurrency} ${packageBalance}`}
                </RegularText>
              )}
              <RegularText
                color={colors.lightGray}
                style={{ paddingTop: Spacing.vs / 3 }}
                fontSize={FontSize.small * 1.1}>
                Package
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
              Please contact your agency for approval
            </RegularText>
            <CustomButton
              width={widthPercentageToDP(80)}
              title={'Check for approval'}
              color={colors.green}
              onPress={() => navigation.navigate('CheckApprovalScreen')}
            />
          </Card>
        )}
        {transactions?.length && (
          <>
            <View style={styles.recentTxnHeader}>
              <RegularText color={colors.black}>
                {'Recent Transactions'}
              </RegularText>
              <Pressable
                onPress={() =>
                  navigation.navigate('StatementScreen')
                }>
                <RegularText color={colors.blue}>{'VIEW ALL'}</RegularText>
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
