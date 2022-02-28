import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import PoppinsMedium from './PoppinsMedium';
import CustomButton from './CustomButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const CustomLoader = ({show, hide, message}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={show}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color={colors.blue} />
            <RegularText
              fontSize={FontSize.medium}
              style={styles.subtitle}
              color={colors.gray}>
              {message}
            </RegularText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
});
