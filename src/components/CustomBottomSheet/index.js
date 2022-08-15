import React, {forwardRef} from 'react';
import { StyleSheet, ScrollView} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {Spacing} from '../../constants';

export const CustomBottomSheet = forwardRef((props, ref) => {
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
      android_keyboardInputMode='adjustResize'
        enablePanDownToClose={props.enablePanDownToClose}
        backdropComponent={backdropProps =>
          !props.disableBackdrop && <BottomSheetBackdrop {...backdropProps} />
        }
        ref={ref}
        style={styles.bottomSheet}
        index={1}
        snapPoints={props.snapPoints}
        // onChange={handleSheetChanges}
      >
        <ScrollView style={styles.contentContainer}>
          {props.children}
        </ScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.hs,
    // alignItems: 'center',
  },
  bottomSheet: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 1000,
  },
});