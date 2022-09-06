import React, { useEffect, useState } from 'react';
import { RNToasty } from 'react-native-toasty';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';

import {
  Card,
  SmallText,
  CustomButton,
  CustomHeader,
  PoppinsMedium,
} from '../../components';
import { Spacing, colors } from '../../constants';
import { getUserByWalletAddress, setAuthData } from '../../redux/actions/authActions';

const CheckApprovalScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.authReducer.userData);
  const activeAppSettings = useSelector(state => state.agencyReducer.activeAppSettings);
  const [values, setValues] = useState({
    isLoading: true,
  });

  const { isLoading } = values;

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
      setValues({ ...values, isLoading: false });
      RNToasty.Show({
        title: 'Your account has been approved',
        duration: 1,
      });
      dispatch(setAuthData({userData: data}));
      navigation.pop();
    } else {
      setValues({ ...values, isLoading: false });
    }
  };

  const onError = (e) => {
    console.log(e)
    setValues({ ...values, isLoading: false });
  };

  return (
    <>
      <CustomHeader
        title={'Approval'}
        onBackPress={() => navigation.pop()}
      />
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
                style={styles.rowView}>
                <SmallText>
                  {activeAppSettings.agency.name}
                </SmallText>
                <SmallText>
                  {activeAppSettings.agency.phone}
                </SmallText>
              </View>
              <CustomButton
                width={widthPercentageToDP(80)}
                title={'Back To Home'}
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
  rowView: { flexDirection: 'row', justifyContent: 'space-between' }
});
