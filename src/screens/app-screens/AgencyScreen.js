import React, {useRef} from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {AddCircleIcon, Logo, MoreDotsIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  CustomHeader,
  RegularText,
  SmallText,
  CustomButton,
} from '../../components';

const TEMP_IMAGE =
  'https://cdn.freelogovectors.net/wp-content/uploads/2016/12/un-logo.png';

const AgencyScreen = ({navigation}) => {
  const swipeableRef = useRef(null);

  const handleDelete = (name, website) => {
    alert(`Delete Agency : ${name}  ${website}`);
    swipeableRef.current.close();
  };

  const rightSwipeActions = (name, website) => (
    <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
      <CustomButton
        title="Delete"
        width={wp(20)}
        color={colors.danger}
        onPress={() => handleDelete(name, website)}
      />
    </View>
  );

  const AgencyComponent = ({name, website}) => (
    <Swipeable
      renderRightActions={() => rightSwipeActions(name, website)}
      shouldCancelWhenOutside={true}
      ref={swipeableRef}>
      <View style={styles.agencyView}>
        <View style={styles.agencyDetailsView}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: TEMP_IMAGE,
              }}
              style={styles.logo}
            />
          </View>
          <View style={{paddingHorizontal: Spacing.hs}}>
            <RegularText color={colors.black}>{name}</RegularText>
            <SmallText>{website}</SmallText>
          </View>
        </View>
        <Pressable
          style={{paddingHorizontal: Spacing.hs / 2}}
          onPress={() => swipeableRef.current.openRight()}
          hitSlop={40}>
          <MoreDotsIcon />
        </Pressable>
      </View>
    </Swipeable>
  );

  return (
    <>
      <CustomHeader
        title="Agency"
        rightIcon={<AddCircleIcon />}
        onBackPress={() => navigation.pop()}
        onRightIconPress={() => navigation.navigate('LinkAgencyQRScreen')}
      />
      <View style={styles.container}>
        <AgencyComponent
          name="Rahat Vendor"
          website="rahat-vendor.agency.com"
        />
        <AgencyComponent
          name="Unicef Nepal"
          website="unicef-nepal.agency.com"
        />
      </View>
    </>
  );
};

export default AgencyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  logoContainer: {
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: 10,
    width: wp(20),
    height: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {height: hp(8), width: wp(17), resizeMode: 'contain'},
  agencyDetailsView: {
    paddingVertical: Spacing.vs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
});
