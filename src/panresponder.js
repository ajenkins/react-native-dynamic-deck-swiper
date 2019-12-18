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

/**
 * Returns true if the card has been dragged beyond the threshold for
 * that direction and in a direction for which swipes are enabled.
 * @param {Object} props
 * @returns {boolean}
 */
const validSwipe = (
  {
    horizontalThreshold,
    verticalThreshold,
    disableSwipeUp,
    disableSwipeDown,
    disableSwipeLeft,
    disableSwipeRight
  },
  dx,
  dy
) => {
  const leftSwipe = dx < -horizontalThreshold && !disableSwipeLeft;
  const rightSwipe = dx > horizontalThreshold && !disableSwipeRight;
  const downSwipe = dy > verticalThreshold && !disableSwipeDown;
  const upSwipe = dy < -verticalThreshold && !disableSwipeUp;
  return leftSwipe || rightSwipe || downSwipe || upSwipe;
};

export { onPanResponderMove, validSwipe };
