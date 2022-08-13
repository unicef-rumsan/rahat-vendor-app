import React from 'react';
import RNModal from 'react-native-modal';
import { BackHandler, StyleSheet, View, ScrollView } from 'react-native';

import { RegularText } from '..'
import { colors, FontSize, Spacing } from '../../constants';
import { CustomButton } from '../CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { PoppinsMedium } from '../PoppinsMedium';
import { useFocusEffect } from '@react-navigation/native';

export const PopupModal = () => {
  const [state, setState] = React.useState({
    visible: false,
  });

  React.useEffect(() => {
    PopupModal.setStateRef = setState;
  }, []);

  const _cleanup = React.useCallback(() => {
    const callback = PopupModal.onDidHideCallback;
    if (callback) {
      if (typeof callback === 'function') {
        callback();
        PopupModal.onDidHideCallback = undefined;
      }
    }
  }, []);

  const _close = React.useCallback(() => {
    setState((state) => ({
      ...state,
      visible: false,
    }));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => true;
      if (state.visible) {
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [state.visible]));

  return (
    <RNModal
      avoidKeyboard
      useNativeDriver
      hasBackdrop={false}
      coverScreen={false}
      onModalHide={_cleanup}
      style={styles.modal}
      onBackdropPress={_close}
      isVisible={state.visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      backdropColor={'transparent'}
      swipeDirection={state.options?.nonDismissible ? undefined : 'right'}
    >

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <ScrollView
        contentContainerStyle={{
          flexGrow:1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Ionicons
                name={
                  state.messageType === 'success' ? 'checkmark-circle' : 'alert-circle'
                }
                size={62}
                color={colors.blue}
                style={{ padding: 0 }}
              />
              <PoppinsMedium
                fontSize={FontSize.large * 1.2}
                style={styles.title}
                color={colors.gray}>
                {state.messageType}
              </PoppinsMedium>
              <RegularText
                fontSize={FontSize.medium}
                style={styles.subtitle}
                color={colors.gray}>
                {state.message}
              </RegularText>
              {state.popupType === 'alert' ? (
                <CustomButton
                  width={widthPercentageToDP(80)}
                  title="Okay"
                  color={colors.green}
                  onPress={state.onConfirm || _close}
                />
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <CustomButton
                    title="Cancel"
                    color={colors.gray}
                    width={widthPercentageToDP(35)}
                    style={{ marginRight: Spacing.hs }}
                    onPress={_close}
                  />
                  <CustomButton
                    title="Okay"
                    width={widthPercentageToDP(35)}
                    onPress={state.onConfirm || _close}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </RNModal>
  )
};

PopupModal.hide = () => {
  const setState = PopupModal.setStateRef;
  if (setState) {
    setState((state) => ({ ...state, visible: false }));
  }
};

PopupModal.show = (options) => {
  if (options?.onDidHideCallback) {
    PopupModal.onDidHideCallback = options.onDidHideCallback;
  }
  const setState = PopupModal.setStateRef;
  if (setState) {
    setState({
      visible: true,
      message: options?.message,
      popupType: options?.popupType,    //alert or popup
      onConfirm: options?.onConfirm,
      messageType: options?.messageType  // Error or Info
    });
  }
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
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