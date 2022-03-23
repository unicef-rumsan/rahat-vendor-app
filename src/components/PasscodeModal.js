import React, {useRef} from 'react';
import {Modal, StyleSheet, Text, View, ScrollView} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import PoppinsMedium from './PoppinsMedium';
import CustomButton from './CustomButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import CustomTextInput from './CustomTextInput';
import SmallText from './SmallText';
import {useTranslation} from 'react-i18next';

const PasscodeModal = ({
  show,
  hide,
  onConfirm,
  message,
  messageType,
  popupType,
  onChangeText,
  title,
  text,
  buttonDisabled,
}) => {
  const inputRef = useRef(null);
  const {t} = useTranslation();
  return (
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        onRequestClose={hide}
        onShow={() => inputRef.current.focus()}
        persistTaps
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
              <PoppinsMedium
                color={colors.blue}
                fontSize={FontSize.medium * 1.5}
                style={{textAlign: 'left', paddingVertical: 0}}>
                {title}
              </PoppinsMedium>
              <SmallText
                style={{paddingVertical: 0, paddingBottom: Spacing.vs}}>
                {text}
              </SmallText>

              <CustomTextInput
                ref={inputRef}
                placeholder={t('6 digit Passcode')}
                keyboardType="number-pad"
                maxLength={6}
                width={widthPercentageToDP(75)}
                onChangeText={text => onChangeText(text)}
              />
              <CustomButton
                color={colors.blue}
                title={t('Confirm')}
                width={widthPercentageToDP(75)}
                disabled={buttonDisabled}
                onPress={onConfirm}
              />
            </View>
          </View>
        </View>
      </Modal>
  );
};

export default PasscodeModal;

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
    // alignItems: 'center',
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
