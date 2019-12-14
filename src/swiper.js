import React, { useState, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, Text, View } from 'react-native';

import styles from './styles';

// TODO: Figure out how to let the user indicate that
// they've reached the last card, which should not be
// swipable.

// TODO: Fix bug where moving card across the middle
// plane calls setSwipeDirection which changes the value
// of swipeDirection and triggers a re-render, which then
// resets the value of position back to the middle.

const { height, width } = Dimensions.get('window');

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
  const _getNextCardData = (obj) => getNextCardData(nextCardProps(obj));

  const [topCardData, setTopCardData] = useState(
    _getNextCardData({ first: true })
  );
  const [previousCards, setPreviousCards] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const position = new Animated.ValueXY();

  // For debugging
  useEffect(() => {
    console.log(`top card is: ${JSON.stringify(topCardData)}`);
  });

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
      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: width + 100, y: gestureState.dy }
        }).start(() => {
          setPreviousCards([...previousCards, topCardData]);
          console.log(getNextCardData({ right: true, previousCards }));
          console.log(
            nextCardProps({ swipeDirection: 'right', previousCards })
          );
          console.log(
            _getNextCardData({ swipeDirection: 'right', previousCards })
          );
          setTopCardData(
            _getNextCardData({ swipeDirection: 'right', previousCards })
          );
        });
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -width - 100, y: gestureState.dy }
        }).start(() => {
          setPreviousCards([...previousCards, topCardData]);
          setTopCardData(
            _getNextCardData({ swipeDirection: 'left', previousCards })
          );
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start();
      }
    }
  });

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          { transform: position.getTranslateTransform() },
          styles.topCard
        ]}
      >
        {renderCard(topCardData)}
      </Animated.View>
      <View style={styles.nextCard}>
        {renderCard(_getNextCardData({ swipeDirection, previousCards }))}
        <Text>Top Card Data: {JSON.stringify(topCardData)}</Text>
      </View>
    </>
  );
};

export default DynamicSwiper;
