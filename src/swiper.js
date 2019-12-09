import React from 'react';
import { Animated } from 'react-native';

import styles from './styles';

const DynamicSwiper = ({ nextCard, renderCard }) => {
  const nextCardDefaults = {
    first: false,
    left: false,
    right: false,
    previousCards: []
  };
  const firstCardData = nextCard({ ...nextCardDefaults, first: true });
  const leftCardData = nextCard({ ...nextCardDefaults, left: true });
  const rightCardData = nextCard({ ...nextCardDefaults, right: true });
  return (
    <Animated.View style={styles.card}>
      {renderCard(firstCardData)}
    </Animated.View>
  );
};

export default DynamicSwiper;
