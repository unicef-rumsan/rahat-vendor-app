import React from 'react';
import RNModal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, View, BackHandler, ScrollView} from 'react-native';

import {Spacing} from '../../constants';
import AgencyComponent from './AgencyComponent';

export const SwitchAgencyModal = () => {
  const appSettings = useSelector(state => state.agencyReducer.appSettings);
  const activeAppSettings = useSelector(
    state => state.agencyReducer.activeAppSettings,
  );

  const [state, setState] = React.useState({
    visible: false,
  });

  React.useEffect(() => {
    SwitchAgencyModal.setStateRef = setState;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        setState({...state, visible: false});
        return true;
      };
      if (state.visible) {
        BackHandler.addEventListener('hardwareBackPress', backAction);
      }

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [state.visible]),
  );

  const _cleanup = React.useCallback(() => {
    const callback = SwitchAgencyModal.onDidHideCallback;
    if (callback) {
      if (typeof callback === 'function') {
        callback();
        SwitchAgencyModal.onDidHideCallback = undefined;
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
      hasBackdrop={true}
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
        <ScrollView
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          <View style={styles.modalView}>
            {appSettings?.map((settings, i) => (
              <AgencyComponent
                key={i}
                name={`${settings.agency.name} ${
                  activeAppSettings.agencyUrl === settings.agencyUrl
                    ? '(Active)'
                    : ''
                }`}
                website={settings.agencyUrl}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </RNModal>
  );
};

SwitchAgencyModal.hide = () => {
  const setState = SwitchAgencyModal.setStateRef;
  if (setState) {
    setState(state => ({...state, visible: false}));
  }
};

SwitchAgencyModal.show = options => {
  if (options?.onDidHideCallback) {
    SwitchAgencyModal.onDidHideCallback = options.onDidHideCallback;
  }
  const setState = SwitchAgencyModal.setStateRef;
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
    paddingHorizontal: Spacing.hs * 1.5,
  },
});
