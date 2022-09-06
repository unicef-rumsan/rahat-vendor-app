import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import { PoppinsMedium } from '../../components';
import { FontSize, Spacing,colors } from '../../constants';

export const CustomButton = ({
  color,
  title,
  onPress,
  style,
  icon,
  width,
  outlined,
  disabled,
  isSubmitting,
  borderRadius,
  capitalizeText,
  fontFamily,
  fontSize,
  paddingVertical,
}) => {
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.buttonView,
        { borderRadius: borderRadius ? borderRadius : 10 },
      ]}>
      <Pressable
        onPress={onPress}
        style={[
          styles.button,
          {
            borderRadius: borderRadius ? borderRadius : 10,
            backgroundColor: outlined ? 'transparent' : color || colors.blue,
            borderWidth: outlined ? 1 : 0,
            borderColor: color || colors.blue,
            width: width || wp(90),
            opacity: disabled ? 0.8 : 1,
          },
          { ...style },
        ]}
        android_ripple={{
          color: 'rgba(0,0,0, 0.1)',
          borderless: false,
        }}
        disabled={disabled}>
        {isSubmitting ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {outlined ? (
              <Text
                style={[
                  {
                    color: color || colors.blue,
                    textTransform: capitalizeText ? 'capitalize' : 'uppercase',
                    fontFamily: fontFamily ? fontFamily : 'Poppins-Medium',
                    fontSize: fontSize || FontSize.medium,
                    paddingVertical: paddingVertical || Spacing.vs / 3,
                  },
                ]}>
                {t(title || '')}
              </Text>
            ) : (
              <>
                <PoppinsMedium style={styles.buttonText}>
                  {t(title || '')}
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

const styles = StyleSheet.create({
  buttonView: {
    alignSelf: 'center',
    overflow: 'hidden',
    // borderRadius: 10,
    marginVertical: Spacing.vs / 2,
  },
  button: {
    paddingVertical: Spacing.vs / 4,
    alignItems: 'center',
    justifyContent: 'center',
    // width: wp(90),
  },
  buttonText: {
    // fontSize: FontSize.medium,
    textTransform: 'uppercase',
    color: colors.white,
    paddingHorizontal: Spacing.hs / 2,
  },
  outlinedButtonText: {
    paddingVertical: Spacing.vs / 3,
  },
});
