import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
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
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {English, Nepali} from '../../assets/icons/flags';
import AsyncStorage from '@react-native-async-storage/async-storage';
const languages = [
  {name: 'en', label: 'English', icon: <English />},
  {name: 'np', label: 'नेपाली', icon: <Nepali />},
];

const LanguagePicker = ({show, hide}) => {
  const {i18n} = useTranslation(); //i18n instance

  const LanguageItem = ({name, label, icon}) => (
    <Pressable
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: widthPercentageToDP(50),
        marginBottom: Spacing.vs,
      }}
      onPress={async () => {
        i18n.changeLanguage(name);
        await AsyncStorage.setItem('activeLanguage', JSON.stringify(name));
        hide();
      }}>
      {icon}
      <RegularText
        style={{
          color: i18n.language === name ? colors.blue : colors.black,
          fontSize: FontSize.large * 1.1,
        }}>
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View style={styles.centeredView}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            <View style={styles.modalView}>
              {languages.map(item => (
                <LanguageItem
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default LanguagePicker;

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // maxHeight: heightPercentageToDP(80)
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
