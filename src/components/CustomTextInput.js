import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import SmallText from './SmallText';

const CustomTextInput = forwardRef((props, ref) => {
  const {t} = useTranslation();
  return (
    <View style={{marginBottom: props.error ? Spacing.vs / 2 : Spacing.vs}}>
      <TextInput
        ref={ref && ref}
        {...props}
        placeholder={props.placeholder}
        style={[styles.textInput, {...props.style}]}
      />

      {props.error && (
        <SmallText
          noPadding
          color={colors.danger}
          style={{paddingHorizontal: Spacing.hs, paddingTop: Spacing.vs / 5}}>
          {t(props.error)}
        </SmallText>
      )}
    </View>
  );
});

export default CustomTextInput;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.gray,
    paddingHorizontal: Spacing.hs,
    fontSize: FontSize.medium,
    color: colors.gray,
  },
});
