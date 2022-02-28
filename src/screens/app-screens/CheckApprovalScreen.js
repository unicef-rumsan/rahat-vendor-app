import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {RNToasty} from 'react-native-toasty';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {Spacing} from '../../../constants/utils';

import {
  Card,
  CustomButton,
  CustomHeader,
  PoppinsMedium,
  SmallText,
} from '../../components';
import {getUserByWalletAddress} from '../../redux/actions/auth';

const CheckApprovalScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {userData, activeAppSettings} = useSelector(state => state.auth);
  console.log(activeAppSettings, "active")
  const [values, setValues] = useState({
    // isApproved: false,
    isLoading: true,
  });

  const {isApproved, isLoading} = values;

  useEffect(() => {
    dispatch(
      getUserByWalletAddress(
        activeAppSettings.agencyUrl,
        userData.wallet_address,
        onSuccess,
        onError,
      ),
    );
  }, []);

  const onSuccess = data => {
    if (data?.agencies[0].status === 'active') {
      setValues({...values, isLoading: false});
      RNToasty.Show({title: 'Your account has been approved', duration: 1});
      navigation.pop();
    } else {
      setValues({...values, isLoading: false});
    }
  };

  const onError = () => {
    setValues({...values, isLoading: false});
  };

  return (
    <>
      <CustomHeader title="Approval" onBackPress={() => navigation.pop()} />
      <View style={styles.container}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color={colors.blue} />
          </>
        ) : (
          <>
            <PoppinsMedium color={colors.yellow}>
              Please wait for approval from agency.
            </PoppinsMedium>
            <Card>
              <SmallText color={colors.black}>
                Please contact your agency for approval
              </SmallText>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <SmallText>{activeAppSettings.agency.name} </SmallText>
                <SmallText>{activeAppSettings.agency.phone}</SmallText>
              </View>
              <CustomButton
                width={widthPercentageToDP(80)}
                title="Back To Home"
                color={colors.green}
                onPress={() => navigation.pop()}
              />
            </Card>
          </>
        )}
      </View>
    </>
  );
};

export default CheckApprovalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
});
