import React from 'react';
import RNModal from 'react-native-modal';
import {StyleSheet, View, ActivityIndicator, BackHandler} from 'react-native';

import {RegularText} from '../../components';
import {colors, FontSize, Spacing} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';

export const LoaderModal = () => {
  const [state, setState] = React.useState({
    visible: false,
  });

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      LoaderModal.setStateRef = setState;
    }
    return () => {
      isMounted = false;
    };
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
    }, [state.visible]),
  );

  const _cleanup = React.useCallback(() => {
    const callback = LoaderModal.onDidHideCallback;
    if (callback) {
      if (typeof callback === 'function') {
        callback();
        LoaderModal.onDidHideCallback = undefined;
      }
    }
  }, []);

  const _close = React.useCallback(() => {
    setState(state => ({
      ...state,
      visible: false,
    }));
  }, []);

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
      swipeDirection={state.options?.nonDismissible ? undefined : 'right'}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size="large" color={colors.blue} />
          {state?.message && (
            <RegularText
              fontSize={FontSize.medium}
              style={styles.message}
              color={colors.gray}>
              {state?.message}
            </RegularText>
          )}
        </View>
      </View>
    </RNModal>
  );
};

LoaderModal.hide = () => {
  const setState = LoaderModal.setStateRef;
  if (setState) {
    setState(state => ({...state, visible: false}));
  }
};

LoaderModal.show = options => {
  if (options?.onDidHideCallback) {
    LoaderModal.onDidHideCallback = options.onDidHideCallback;
  }
  const setState = LoaderModal.setStateRef;
  if (setState) {
    setState({
      options,
      visible: true,
      message: options?.message,
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
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: Spacing.vs * 2,
    paddingHorizontal: Spacing.hs * 2,
  },
  message: {
    paddingTop: Spacing.vs,
    textAlign: 'center',
  },
});
