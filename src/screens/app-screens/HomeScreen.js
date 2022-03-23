import React, {useEffect, useState} from 'react';
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
import {Logo} from '../../../assets/icons';
import {FontSize, Spacing} from '../../../constants/utils';

import {widthPercentageToDP} from 'react-native-responsive-screen';
import IndividualStatement from '../../components/IndividualStatement';

import {Card, SmallText, RegularText, CustomButton} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getWalletBalance} from '../../redux/actions/wallet';
import {useBackHandler} from '@react-native-community/hooks';
import {RNToasty} from 'react-native-toasty';
import {useIsFocused} from '@react-navigation/native';
import SwitchAgencyModal from '../../components/SwitchAgencyModal';
import CustomLoader from '../../components/CustomLoader';
import {getUserByWalletAddress, switchAgency} from '../../redux/actions/auth';
import {ethers} from 'ethers';
import {useTranslation} from 'react-i18next';

let BACK_COUNT = 0;

const Header = ({title, onRightIconPress, userData}) => (
  <SafeAreaView style={styles.headerContainer}>
    <Logo />
    <Text style={styles.headerTitle}>{title}</Text>

    <Pressable onPress={onRightIconPress} hitSlop={50}>
      <Image
        source={{
          uri: `https://ipfs.rumsan.com/ipfs/${userData.photo[0]}`,
        }}
        style={styles.headerRightIcon}
        resizeMode="center"
      />
    </Pressable>
  </SafeAreaView>
);

const HomeScreen = ({navigation, route}) => {
  const refresh = route?.params?.refresh;
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {userData, appSettings, activeAppSettings} = useSelector(
    state => state.auth,
  );
  const [userInAgencyStatus, setUserInAgencyStatus] = useState(false);

  const {wallet, balance} = useSelector(state => state.wallet);

  const [values, setValues] = useState({
    refreshing: false,
    transactions: [],
    showSwitchAgencyModal: false,
    showLoader: false,
  });

  const {refreshing, transactions, showSwitchAgencyModal, showLoader} = values;

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

  const getBalance = () => {
    dispatch(
      getWalletBalance(
        activeAppSettings?.agency?.contracts?.rahat,
        wallet,
        activeAppSettings?.agency?.contracts?.token,
      ),
    );
  };

  const getTransactions = async () => {
    try {
      const transactions = await AsyncStorage.getItem('transactions');
      const parsedTransactions = JSON.parse(transactions);
      const filteredTransactions = parsedTransactions?.filter(
        item => item.agencyUrl === activeAppSettings.agencyUrl,
      );

      setValues(values => ({
        ...values,
        transactions: filteredTransactions || [],
      }));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted || refresh) {
      getBalance();
      getTransactions();
    }
    return () => (isMounted = false);
  }, [route]);

  const onRefresh = () => {
    getBalance();
    getTransactions();
  };

  const handleSwitchAgency = agencyUrl => {
    setValues({...values, showSwitchAgencyModal: false, showLoader: true});
    const newActiveAppSettings = appSettings.find(
      setting => setting.agencyUrl === agencyUrl,
    );
    dispatch(
      switchAgency(
        newActiveAppSettings,
        wallet,
        onSwitchSuccess,
        onSwitchError,
      ),
    );
  };

  const onSwitchSuccess = newActiveAppSettings => {
    dispatch({type: 'SET_ACTIVE_APP_SETTINGS', payload: newActiveAppSettings});
    setValues({...values, showLoader: false, showSwitchAgencyModal: false});
  };
  const onSwitchError = e => {
    console.log(e, 'e');
    setValues({...values, showLoader: false, showSwitchAgencyModal: false});
  };

  return (
    <>
      <Header
        title={t('Home')}
        onRightIconPress={() => navigation.navigate('ProfileScreen')}
        userData={userData}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SwitchAgencyModal
          show={showSwitchAgencyModal}
          activeAgency={activeAppSettings}
          agencies={appSettings}
          onPress={handleSwitchAgency}
          hide={() => setValues({...values, showSwitchAgencyModal: false})}
        />

        <CustomLoader
          show={showLoader}
          message={`${t('Switching agency.')} ${t('Please wait...')}`}
        />

        <Card>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <SmallText noPadding color={colors.blue}>
                {activeAppSettings.agency.name}
              </SmallText>
              <RegularText
                color={colors.lightGray}
                style={{paddingTop: Spacing.vs / 3}}
                fontSize={FontSize.small * 1.2}>
                Token Balance
              </RegularText>
              {balance === null ? (
                <ActivityIndicator size={24} color={colors.blue} />
              ) : (
                <RegularText color={colors.gray}>{balance}</RegularText>
              )}
            </View>
            <CustomButton
              title={t('Redeem')}
              borderRadius={20}
              width={widthPercentageToDP(30)}
              capitalizeText
              outlined
              fontFamily={'Lora-Regular'}
              onPress={() =>
                // userData?.agencies[0]?.status === 'new'
                //   ? navigation.navigate('CheckApprovalScreen')
                //   : navigation.navigate('RedeemScreen')
                userInAgencyStatus === 'new'
                  ? navigation.navigate('CheckApprovalScreen')
                  : navigation.navigate('RedeemScreen')
              }
              // onPress={() =>
              //   setValues({...values, showSwitchAgencyModal: true})
              // }
            />
          </View>
        </Card>

        {/* {userData?.agencies[0]?.status === 'new' && ( */}
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
                <RegularText color={colors.blue}>{t("VIEW ALL")}</RegularText>
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
                  title={
                    item.type === 'charge'
                      ? `${item.type} to ...${item.chargeTo?.slice(
                          item?.chargeTo?.length - 4,
                          item?.chargeTo?.length,
                        )}`
                      : item.type === 'transfer'
                      ? `${item.type} to ...${item.to?.slice(
                          item?.to?.length - 4,
                          item?.to?.length,
                        )}`
                      : 'redeem token'
                  }
                  type={item.type}
                  amount={item.amount}
                  date={item.timeStamp}
                  onPress={() =>
                    navigation.navigate(
                      item.type === 'charge'
                        ? 'ChargeReceiptScreen'
                        : item.type === 'transfer'
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
    paddingTop: Spacing.vs,
  },
  headerTitle: {fontFamily: 'Lora-Regular', fontSize: FontSize.regular},
  headerRightIcon: {height: 80, width: 30, borderRadius: 100},
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
