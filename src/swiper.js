import React, { useState } from 'react';
import { Animated, PanResponder, View } from 'react-native';

import styles from './styles';

// TODO: Figure out how to let the user indicate that
// they've reached the last card, which should not be
// swipable.

// TODO: Fix bug where moving card across the middle
// plane calls setSwipeDirection which changes the value
// of swipeDirection and triggers a re-render, which then
// resets the value of position back to the middle.

const nextCardProps = ({
  first = false,
  swipeDirection,
  previousCards = []
}) => ({
  first,
  left: swipeDirection == 'left',
  right: swipeDirection == 'right',
  previousCards
});

const DynamicSwiper = ({ getNextCardData, renderCard }) => {
  const [previousCards, setPreviousCards] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const position = new Animated.ValueXY();

  const _getNextCardData = (obj) => getNextCardData(nextCardProps(obj));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
      if (gestureState.dx > 0) {
        setSwipeDirection('right');
      } else if (gestureState.dx < 0) {
        setSwipeDirection('left');
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 4
      }).start();
    }
  });

  const firstCardData = _getNextCardData({ first: true });
  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          { transform: position.getTranslateTransform() },
          styles.topCard
        ]}
      >
        {renderCard(firstCardData)}
      </Animated.View>
      <View style={styles.nextCard}>
        {renderCard(_getNextCardData({ swipeDirection, previousCards }))}
      </View>
    </>
  );
};

export default DynamicSwiper;
