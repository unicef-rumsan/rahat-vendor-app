import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import colors from '../../../constants/colors';
import {AppIntro} from '../../../contents/AppIntro';
import RightArrow from '../../../assets/icons/RightArrow';
import {Spacing} from '../../../constants/utils';
import {CustomButton, RegularText, SmallText} from '../../components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import LanguagePicker from '../../components/LanguagePicker';
import {English, Nepali} from '../../../assets/icons/flags';

const {width} = Dimensions.get('window');
const languages = [
  {name: 'en', label: 'English', icon: <English />},
  {name: 'np', label: 'Nepali', icon: <Nepali />},
];

const LandingScreen = ({navigation}) => {
  var scrollX = useRef(new Animated.Value(0)).current;
  const {t, i18n} = useTranslation();
  console.log(i18n.languages);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState([]);
  // const clearAll = async () => {
  //   try {
  //     await AsyncStorage.clear();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // useEffect(() => {
  //   clearAll();
  // }, []);

  useEffect(() => {
    let active = languages.filter(item => item.name === i18n.language);
    setActiveLanguage(active);
  }, [showLanguagePicker]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.introContainer}>
        <Image
          source={item.image}
          style={{height: hp(40), width: wp(90), marginTop: Spacing.vs * 2}}
        />
        <View>
          <RegularText center>{t(item.title)}</RegularText>
          <SmallText center>{t(item.description)}</SmallText>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LanguagePicker
        show={showLanguagePicker}
        hide={() => setShowLanguagePicker(false)}
      />
      <View style={styles.languageButtonContainer}>
        <Pressable
          style={styles.languageButton}
          onPress={() => setShowLanguagePicker(true)}>
          {activeLanguage[0]?.icon}
        </Pressable>
      </View>
      <RightArrow color={colors.black} />
      <FlatList
        data={AppIntro}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate={'normal'}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
      />
      <ExpandingDot
        data={AppIntro}
        expandingDotWidth={30}
        scrollX={scrollX}
        inActiveDotOpacity={0.6}
        activeDotColor={colors.blue}
        inActiveDotColor={colors.gray}
        dotStyle={styles.dotStyle}
        containerStyle={styles.dotContainerStyle}
      />
      {/* <CustomButton
        title="Get Started"
        icon={<RightArrow />}
        style={styles.button}
        onPress={() => navigation.navigate('GetStartedScreen')}
      /> */}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('GetStartedScreen')}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <RegularText
            center
            style={{paddingHorizontal: Spacing.hs / 2, color: colors.black}}>
            {t('GET STARTED')}
          </RegularText>
          <RightArrow color={colors.black} />
        </View>
      </Pressable>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  introContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.hs,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotContainerStyle: {
    bottom: 140,
  },
  button: {marginBottom: Spacing.vs * 5},
  languageButton: {
    // backgroundColor: '#66b6d2',
    borderRadius: 30,
    height: hp(6),
    paddingHorizontal: Spacing.hs / 2,
    paddingVertical: Spacing.vs / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 50,
    zIndex: 1,
  },
});
