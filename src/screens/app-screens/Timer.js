import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {FontSize, Spacing, colors} from '../../constants';
import {Card, RegularText} from '../../components';

const Timer = props => {
  const [count, setCount] = useState(0);

  const {onChange} = props;
  onChange(count);

  useEffect(() => {
    const timer = () => {
      setCount(count + 1);
    };
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <Card style={styles.tokenDetailCard}>
      <RegularText
        color={colors.gray}
        style={{fontSize: FontSize.medium * 1.1}}>
        OTP Duration (Secs):
      </RegularText>
      <RegularText
        color={colors.gray}
        style={{
          fontSize: FontSize.medium * 1.1,
          paddingHorizontal: Spacing.hs,
        }}>
        {count}
      </RegularText>
    </Card>
  );
};

export default Timer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  tokenDetailCard: {
    paddingVertical: Spacing.vs * 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// Call like this in Parent Component; Add getTimeFromTimer function
// <Timer onChange={getTimeFromTimer} />
