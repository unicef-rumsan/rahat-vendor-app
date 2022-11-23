import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

const Timer = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = () => {
      setCount(count + 1);
    };
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, [count]);

  return <Text>Duration (Secs): {count}</Text>;
};

export default Timer;
