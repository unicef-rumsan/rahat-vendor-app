import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {useSelector} from 'react-redux';
import {TokenService} from '../../services/chain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {userData, appSettings} = useSelector(state => state.auth);
  const {wallet} = useSelector(state => state.wallet);
  const [values, setValues] = useState({
    balance: null,
    refreshing: false,
    transactions: null,
  });

  const {balance, refreshing, transactions} = values;

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (refreshing || balance === null) {
        getBalanceFunc();
      }
    }
    return () => (isMounted = false);
  }, [refreshing]);

  const getBalanceFunc = async () => {
    try {
      let tokenBalance = await TokenService(
        appSettings.agency.contracts.rahat,
        wallet,
      ).getBalance(userData.wallet_address);

      if (isFocused) {
        setValues(values => ({
          ...values,
          balance: tokenBalance.toNumber(),
          refreshing: false,
        }));
      }
    } catch (e) {
      console.log(e);
      alert(e);
      if (isFocused) {
        setValues({...values, balance: 0, refreshing: false});
      }
    }
  };

  const getTransactions = async () => {
    try {
      const transactions = await AsyncStorage.getItem('transactions');
      const parsedTransactions = JSON.parse(transactions);

      setValues(values => ({...values, transactions: parsedTransactions}));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (refreshing || mounted) {
      getTransactions();
    }

    return () => (mounted = false);
  }, [refreshing]);

  const Header = ({title, onRightIconPress}) => (
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

  const onRefresh = () => {
    setValues({...values, refreshing: true});
  };

  return (
    <>
      <Header
        title="Home"
        onRightIconPress={() => navigation.navigate('ProfileScreen')}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Card>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <SmallText noPadding color={colors.green}>
                Agency Name
              </SmallText>
              <SmallText>Token Balance</SmallText>
              {balance === null ? (
                <ActivityIndicator size={24} color={colors.blue} />
              ) : (
                <RegularText color={colors.black} center>
                  {balance}
                </RegularText>
              )}
            </View>
            <CustomButton
              title="Redeem"
              width={widthPercentageToDP(30)}
              outlined
            />
          </View>
        </Card>

        {userData?.agencies[0]?.status === 'new' && (
          <Card>
            <RegularText
              color={colors.black}
              style={{fontSize: FontSize.medium}}>
              Please contact your agency for approval
            </RegularText>
            <CustomButton
              width={widthPercentageToDP(80)}
              title="Check for approval"
              color={colors.green}
              onPress={() => navigation.navigate('CheckApprovalScreen')}
            />
          </Card>
        )}

        {
          transactions && (
            <>
              <View style={styles.recentTxnHeader}>
                <RegularText color={colors.black}>
                  Recent Transactions
                </RegularText>
                <Pressable
                  onPress={() =>
                    navigation.navigate('StatementScreen', {
                      transactions,
                      balance,
                    })
                  }>
                  <RegularText color={colors.blue}>VIEW ALL</RegularText>
                </Pressable>
              </View>
              <Card>
                {transactions.slice(0, 3).map((item, index) => (
                  <IndividualStatement
                    key={index}
                    title={
                      item.type === 'charge'
                        ? `${item.type} to ${item.chargeTo}`
                        : 'Redeem token'
                    }
                    type={item.type}
                    amount={item.amount}
                    date={item.timeStamp}
                    onPress={() =>
                      navigation.navigate('ChargeReceiptScreen', {
                        receiptData: item,
                      })
                    }
                  />
                ))}
              </Card>
            </>
          )
          // <>
          //   <View style={styles.recentTxnHeader}>
          //     <RegularText color={colors.black}>
          //       Recent Transactions
          //     </RegularText>
          //     <Pressable onPress={() => navigation.navigate('StatementScreen')}>
          //       <RegularText color={colors.blue}>VIEW ALL</RegularText>
          //     </Pressable>
          //   </View>
          //   <Card>
          //     <IndividualStatement
          //       title="Redeem Tokens"
          //       type="redeem"
          //       amount="150"
          //       date="2021/08/23 5:25 pm"
          //     />
          //     <IndividualStatement
          //       title="Charge to X897"
          //       type="charge"
          //       amount="200"
          //       date="2021/08/24 5:25 pm"
          //     />
          //     <IndividualStatement
          //       title="Charge to X1123"
          //       type="charge"
          //       amount="250"
          //       date="2021/08/25 5:25 pm"
          //     />
          //   </Card>
          // </>
        }

        {/* <>
          <RegularText color={colors.black}>Your Address</RegularText>
          <Card>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: Spacing.vs * 2,
              }}>
              <QRCode
                value="0xA767CB61b16ea1c83d796E41bD17298b0643eFa"
                size={200}
              />

              <SmallText center style={{fontSize: FontSize.xsmall}}>
                0xA767CB61b16ea1c83d796E41bD17298b0643eFad
              </SmallText>
              <SmallText center style={{fontSize: FontSize.xsmall}}>
                This QR Code (address) is your unique identity. Use this to
                receive digital documents, assets or verify your identity.
              </SmallText>
            </View>
          </Card>
        </> */}
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
    paddingTop: Spacing.vs / 3,
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
