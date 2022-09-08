import React from 'react';
import {StyleSheet, Image} from 'react-native';

export const FlagImage = ({name}) => {
  return (
    <Image
      source={{uri: `https://flagcdn.com/w40/${name}.png`}}
      style={styles.flag}
    />
  );
};

const styles = StyleSheet.create({
  flag: {height: 35, width: 35, resizeMode: 'contain'},
});
