import { Animated, Dimensions, PanResponder } from 'react-native';

import { LEFT, RIGHT, UP, DOWN } from './swiper';

// TODO: Calculate dimensions more dynamically
// https://facebook.github.io/react-native/docs/dimensions#get
const { height, width } = Dimensions.get('window');

/**
 * Get the swipe direction based on the current offset of the top card.
 * Will return the direction that the card is currently pulled the
 * farthest in (most extreme) relative to the height and width of the
 * screen.
 * @param {Number} x
 * @param {Number} y
 * @returns {String, null} - A swipe direction or null
 */
const getSwipeDirection = (
  x,
  y,
  disableUp,
  disableDown,
  disableLeft,
  disableRight
) => {
  const xAdj = x / width;
  const yAdj = y / height;
  let potentialDirections = [];
  if (x > 0 && !disableRight) {
    potentialDirections.push({ offset: Math.abs(xAdj), dir: RIGHT });
  }
  if (x < 0 && !disableLeft) {
    potentialDirections.push({ offset: Math.abs(xAdj), dir: LEFT });
  }
  if (y > 0 && !disableDown) {
    potentialDirections.push({ offset: Math.abs(yAdj), dir: DOWN });
  }
  if (y < 0 && !disableUp) {
    potentialDirections.push({ offset: Math.abs(yAdj), dir: UP });
  }
  if (potentialDirections.length) {
    const sortedDirections = potentialDirections.sort(
      (a, b) => a.offset - b.offset
    );
    return sortedDirections[0].dir;
  } else {
    return null;
  }
};

const onPanResponderMove = (gestureState, position) => (state, props) => {
  // Move card
  if (props.preventVerticalDragging) {
    position.setValue({ x: gestureState.dx, y: 0 });
  } else {
    position.setValue({ x: gestureState.dx, y: gestureState.dy });
  }

  // Update state based on current card location
  const swipeDirection = getSwipeDirection(
    gestureState.dx,
    gestureState.dy,
    props.disableSwipeUp,
    props.disableSwipeDown,
    props.disableSwipeLeft,
    props.disableSwipeRight
  );
  return { swipeDirection };
};

const onPanResponderRelease = (gestureState, position, _getNextCardData) => (
  state,
  props
) => {
  const leftSwipe = gestureState.dx < -props.horizontalThreshold;
  const rightSwipe = gestureState.dx > props.horizontalThreshold;
  const upSwipe = gestureState.dy > props.verticalThreshold;
  const downSwipe = gestureState.dy < -props.verticalThreshold;
  console.log(JSON.stringify({ leftSwipe, rightSwipe, upSwipe, downSwipe }));
  if (leftSwipe || rightSwipe || upSwipe || downSwipe) {
    // Trigger event callbacks
    props.onSwiped(state.topCardData);
    gestureState.dx > 0
      ? props.onSwipedRight(state.topCardData)
      : props.onSwipedLeft(state.topCardData);

    // Animate swipe then update state
    const offscreen = gestureState.dx > 0 ? width : -width;
    Animated.spring(position, {
      toValue: { x: offscreen, y: gestureState.dy },
      overshootClamping: true
    }).start(() => {
      const newPreviousCards = [...state.previousCards, state.topCardData];
      return {
        topCardData: _getNextCardData({
          swipeDirection: state.swipeDirection,
          previousCards: newPreviousCards
        }),
        previousCards: newPreviousCards
      };
    });
  } else {
    // Swipe aborted
    props.onSwipeAborted(state.topCardData);
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4
    }).start();
  }
};

export { onPanResponderMove, onPanResponderRelease };
