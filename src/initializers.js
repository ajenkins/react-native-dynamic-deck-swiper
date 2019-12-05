import { Dimensions, PanResponder } from 'react-native';

import {
  onPanResponderMove,
  onPanResponderGrant,
  onPanResponderRelease
} from './events';

export const initializeCardStyle = (onDimensionsChange) => {
  Dimensions.addEventListener('change', onDimensionsChange);
};

export const initializePanResponder = (
  props,
  state,
  animatedValueX,
  animatedValueY,
  getOnSwipeDirectionCallback,
  getSwipeDirection,
  resetTopCard,
  setState,
  swipeCard
) => {
  return PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => false,

    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      const isVerticalSwipe = Math.sqrt(
        Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2)
      );
      if (!props.verticalSwipe && isVerticalSwipe) {
        return false;
      }
      return (
        Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) >
        10
      );
    },
    onPanResponderGrant: onPanResponderGrant(
      props,
      state,
      animatedValueX,
      animatedValueY
    ),
    onPanResponderMove: onPanResponderMove(
      props,
      state,
      animatedValueX,
      animatedValueY,
      setState
    ),
    onPanResponderRelease: onPanResponderRelease(
      props,
      state,
      animatedValueX,
      animatedValueY,
      getOnSwipeDirectionCallback,
      getSwipeDirection,
      resetTopCard,
      setState,
      swipeCard
    ),
    onPanResponderTerminate: this.onPanResponderRelease
  });
};
