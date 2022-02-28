import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import PoppinsMedium from './PoppinsMedium';
import CustomButton from './CustomButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SmallText} from '.';
const TEMP_IMAGE =
  'https://cdn.freelogovectors.net/wp-content/uploads/2016/12/un-logo.png';

const SwitchAgencyModal = ({
  show,
  hide,
  message,
  agencies,
  onPress,
  activeAgency,
}) => {
  const AgencyComponent = ({name, website, onPress}) => (
    <Pressable style={styles.agencyView} onPress={() => onPress(website)}>
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
          <RegularText fontSize={FontSize.medium} color={colors.black}>
            {name}
          </RegularText>
          <SmallText>{website}</SmallText>
        </View>
      </View>
    </Pressable>
  );
  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={show}
      onRequestClose={hide}>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onPress={hide}>
        <View style={styles.centeredView}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <View style={styles.modalView}>
              {agencies?.map((settings, i) => (
                <AgencyComponent
                  key={i}
                  name={`${settings.agency.name} ${
                    activeAgency.agencyUrl === settings.agencyUrl
                      ? '(Active)'
                      : ''
                  }`}
                  website={settings.agencyUrl}
                  onPress={onPress}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default SwitchAgencyModal;

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: Spacing.vs,
    paddingHorizontal: Spacing.hs,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: Spacing.vs / 3,
    textAlign: 'center',
  },
  subtitle: {
    marginVertical: Spacing.vs,

    textAlign: 'center',
    // textTransform: 'uppercase',
  },

  container: {
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
    // marginHorizontal: Spacing.hs
  },
  logoContainer: {
    borderWidth: 2,
    borderColor: colors.gray,
    borderRadius: 10,
    width: wp(15),
    height: hp(7.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {height: hp(8), width: wp(12), resizeMode: 'contain'},
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
