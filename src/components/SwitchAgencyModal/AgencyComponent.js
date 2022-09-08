import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Pressable} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import {PopupModal} from '../PopupModal';
import {LoaderModal} from '../LoaderModal';
import {PoppinsMedium} from '../PoppinsMedium';
import {RegularText, SmallText} from '../index';
import {SwitchAgencyModal} from '../../components';
import {FontSize, Spacing, colors} from '../../constants';
import {switchAgencyAction} from '../../redux/actions/agencyActions';

const AgencyComponent = ({name, website}) => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.walletReducer.wallet);
  const appSettings = useSelector(state => state.agencyReducer.appSettings);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const onError = error => {
    LoaderModal.hide();
    return PopupModal.show({
      message: String(error),
      popupType: 'alert',
      messageType: 'Error',
    });
  };

  const onSuccess = () => LoaderModal.hide();

  const _onPress = () => {
    if (activeAppSettings.agencyUrl === website) {
      SwitchAgencyModal.hide();
      return;
    }
    LoaderModal.show();
    SwitchAgencyModal.hide();
    const newAppSettings = appSettings.find(
      setting => setting.agencyUrl === website,
    );

    dispatch(
      switchAgencyAction({
        newAppSettings,
        wallet,
        onError,
        onSuccess,
      }),
    );
  };

  return (
    <Pressable style={styles.agencyView} onPress={_onPress}>
      <View style={styles.agencyDetailsView}>
        <View style={styles.logoContainer}>
          {/* <Image
            source={{
              uri: TEMP_IMAGE,
            }}
            style={styles.logo}
          /> */}
          <PoppinsMedium color={colors.blue} fontSize={FontSize.large * 1.2}>
            {name?.[0]}
          </PoppinsMedium>
        </View>
        <View style={{paddingHorizontal: Spacing.hs}}>
          <RegularText fontSize={FontSize.medium} color={colors.black}>
            {name}
          </RegularText>
          <SmallText exact>{website}</SmallText>
        </View>
      </View>
    </Pressable>
  );
};

export default AgencyComponent;

const styles = StyleSheet.create({
  logo: {
    height: heightPercentageToDP(8),
    width: widthPercentageToDP(12),
    resizeMode: 'contain',
  },
  agencyDetailsView: {
    paddingVertical: Spacing.vs / 2,
    flexDirection: 'row',
  },
  agencyView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  logoContainer: {
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.gray,
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(7.5),
  },
});
