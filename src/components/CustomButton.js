import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../constants/colors';
import PoppinsMedium from './PoppinsMedium';

const CustomButton = ({
  color,
  title,
  onPress,
  style,
  icon,
  width,
  outlined,
  disabled,
  isSubmitting,
}) => {
  return (
    <View style={styles.buttonView}>
      <Pressable
        onPress={onPress}
        style={[
          styles.button,
          {
            // backgroundColor: color || colors.blue,
            backgroundColor: outlined ? 'transparent' : color || colors.blue,
            borderWidth: outlined ? 1 : 0,
            borderColor: color || colors.blue,
            width: width || wp(90),
            opacity: disabled ? 0.8 : 1,
          },
          {...style},
        ]}
        android_ripple={{
          color: 'rgba(0,0,0, 0.1)',
          borderless: false,
        }}
        disabled={disabled}>
        {isSubmitting ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {outlined ? (
              <Text
                style={[
                  styles.outlinedButtonText,
                  {color: color || colors.blue},
                ]}>
                {title || ''}
              </Text>
            ) : (
              <>
                <PoppinsMedium style={styles.buttonText}>
                  {title || ''}
                </PoppinsMedium>
                {icon && icon}
              </>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonView: {
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    marginVertical: Spacing.vs / 2,
  },
  button: {
    paddingVertical: Spacing.vs / 4,
    alignItems: 'center',
    justifyContent: 'center',
    // width: wp(90),
    borderRadius: 10,
  },
  buttonText: {
    // fontSize: FontSize.medium,
    textTransform: 'uppercase',
    color: colors.white,
    paddingHorizontal: Spacing.hs / 2,
  },
  outlinedButtonText: {
    fontFamily: 'Lora-Regular',
    paddingVertical: Spacing.vs / 2,
  },
});
