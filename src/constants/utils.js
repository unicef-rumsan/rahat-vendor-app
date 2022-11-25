import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Dimensions} from 'react-native';

export const Spacing = {
  hs: wp(5),
  vs: hp(2),
};

export const FontSize = {
  extraSmall: hp(1.4),
  xsmall: hp(1.5),
  small: hp(1.8),
  regular: hp(2.4),
  medium: hp(2),
  large: hp(2.6),
  xlarge: hp(3),
};

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
