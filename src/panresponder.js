import { Animated, Dimensions, PanResponder } from 'react-native';

import { LEFT, RIGHT, UP, DOWN } from './swiper';

// TODO: Calculate dimensions more dynamically
// https://facebook.github.io/react-native/docs/dimensions#get
const { height, width } = Dimensions.get('window');

const onPanResponderMove = (gestureState, position) => (state, props) => {
  // Move card
  if (props.preventVerticalDragging) {
    position.setValue({ x: gestureState.dx, y: 0 });
  } else {
    position.setValue({ x: gestureState.dx, y: gestureState.dy });
  }

  // Update state based on current card location
  if (Math.abs(gestureState.dx) / width >= Math.abs(gestureState.dy) / height) {
    if (gestureState.dx > 0) {
      return { swipeDirection: RIGHT };
    } else if (gestureState.dx < 0) {
      return { swipeDirection: LEFT };
    }
  } else {
    if (gestureState.dy > 0) {
      return { swipeDirection: UP };
    } else if (gestureState.dy < 0) {
      return { swipeDirection: DOWN };
    }
  }
};

const onPanResponderRelease = (gestureState, position, _getNextCardData) => (
  state,
  props
) => {
  const leftSwipe =
    gestureState.dx < -props.horizontalThreshold && !props.disableSwipeLeft;
  const rightSwipe =
    gestureState.dx > props.horizontalThreshold && !props.disableSwipeRight;
  const upSwipe =
    gestureState.dy > props.verticalThreshold && !props.disableSwipeUp;
  const downSwipe =
    gestureState.dy < -props.verticalThreshold && !props.disableSwipeDown;
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
