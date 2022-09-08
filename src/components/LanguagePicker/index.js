import React from 'react';
import {View, Modal, Pressable, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {RegularText, FlagImage} from '../../components';
import {setActiveLanguageAction} from '../../redux/actions/languageActions';
import {availableLanguages, FontSize, Spacing, colors} from '../../constants';

export const LanguagePicker = ({show, hide}) => {
  const dispatch = useDispatch();
  const {activeLanguage} = useSelector(state => state.languageReducer);

  const handleLanguageItemPress = (name, label, flagName) => {
    dispatch(
      setActiveLanguageAction({activeLanguage: {name, label, flagName}}),
    );
    hide();
  };

  const LanguageItem = ({name, label, flagName}) => (
    <Pressable
      style={styles.languageItem}
      onPress={() => handleLanguageItemPress(name, label, flagName)}>
      <FlagImage name={flagName} />
      <RegularText style={styles.languageItemLabel(activeLanguage.name, name)}>
        {label}
      </RegularText>
    </Pressable>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={show}>
      <View style={styles.modalContainer}>
        <View style={styles.centeredView}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.modalView}>
              {availableLanguages.map(item => (
                <LanguageItem
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  flagName={item.flagName}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: widthPercentageToDP(50),
    marginBottom: Spacing.vs,
  },
  languageItemLabel: (activeName, name) => ({
    fontSize: FontSize.large * 1.1,
    color: activeName === name ? colors.blue : colors.black,
  }),
  flagIcon: {height: 30, width: 40, resizeMode: 'contain'},
  contentContainer: {flexGrow: 1, justifyContent: 'center'},
});
