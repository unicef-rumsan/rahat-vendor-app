import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import PoppinsMedium from './PoppinsMedium';
import CustomButton from './CustomButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const CustomPopup = ({
  show,
  hide,
  onConfirm,
  message,
  messageType,
  popupType,
}) => {
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
            <Ionicons
              name={
                messageType === 'success' ? 'checkmark-circle' : 'alert-circle'
              }
              size={62}
              color={colors.blue}
              style={{padding: 0}}
            />
            <PoppinsMedium
              fontSize={FontSize.large * 1.2}
              style={styles.title}
              color={colors.gray}>
              {messageType}
            </PoppinsMedium>
            <RegularText
              fontSize={FontSize.medium}
              style={styles.subtitle}
              color={colors.gray}>
              {message}
            </RegularText>
            {popupType === 'alert' ? (
              <CustomButton
                width={widthPercentageToDP(80)}
                title="Okay"
                color={colors.green}
                onPress={onConfirm || hide}
              />
            ) : (
              <View style={{flexDirection: 'row'}}>
                <CustomButton
                  title="Cancel"
                  color={colors.gray}
                  width={widthPercentageToDP(35)}
                  style={{marginRight: Spacing.hs}}
                  onPress={hide}
                />
                <CustomButton
                  title="Okay"
                  width={widthPercentageToDP(35)}
                  onPress={onConfirm || hide}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPopup;

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
    marginBottom: Spacing.vs,

    textAlign: 'center',
    // textTransform: 'uppercase',
  },
});
