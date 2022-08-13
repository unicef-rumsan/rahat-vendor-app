import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import { ExpandingDot } from 'react-native-animated-pagination-dots';

import {RightArrowIcon} from '../../../assets/icons';
import { AppIntro } from '../../../contents/AppIntro';
import { Spacing, colors, WINDOW_WIDTH } from '../../constants';
import { RegularText, SmallText, LanguagePicker, FlagImage } from '../../components';

const LandingScreen = ({ navigation }) => {
  var scrollX = useRef(new Animated.Value(0)).current;
  const { activeLanguage } = useSelector(state => state.languageReducer);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.introContainer}>
        <Image
          source={item.image}
          style={{ height: hp(40), width: wp(90), marginTop: Spacing.vs * 2 }}
        />
        <View>
          <RegularText center>{item.title}</RegularText>
          <SmallText center>{item.description}</SmallText>
        </View>
      </View>
    );
  };

  const showPicker = () => setShowLanguagePicker(true);
  const hidePicker = () => setShowLanguagePicker(false);

  return (
    <View style={styles.container}>
      <LanguagePicker
        show={showLanguagePicker}
        hide={hidePicker}
      />
      <View style={styles.languageButtonContainer}>
        <Pressable
          style={styles.languageButton}
          onPress={showPicker}>
          <FlagImage name={activeLanguage.flagName} />
        </Pressable>
      </View>
      <RightArrowIcon color={colors.black} />
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
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
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

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('GetStartedScreen')}>
        <View
          style={styles.getStartedButton}>
          <RegularText
            center
            style={{ paddingHorizontal: Spacing.hs / 2, color: colors.black }}>
            GET STARTED
          </RegularText>
          <RightArrowIcon color={colors.black} />
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
    width: WINDOW_WIDTH,
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
  button: { marginBottom: Spacing.vs * 5 },
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
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  }
});
