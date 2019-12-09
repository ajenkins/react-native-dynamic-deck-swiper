import React, { useState } from 'react';
import { Animated } from 'react-native';

import styles from './styles';

const DynamicSwiper = ({ nextCard, renderCard }) => {
  const [previousCards, setPreviousCards] = useState([]);

  const nextCardDefaults = {
    first: false,
    left: false,
    right: false
  };
  const firstCardData = nextCard({
    ...nextCardDefaults,
    first: true,
    previousCards
  });
  return (
    <Animated.View style={styles.card}>
      {renderCard(firstCardData)}
    </Animated.View>
  );
};

export default DynamicSwiper;
