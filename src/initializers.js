import { Dimensions, PanResponder } from 'react-native';

import { onPanResponderMove } from './events';

export const initializeCardStyle = (onDimensionsChange) => {
  Dimensions.addEventListener('change', onDimensionsChange);
};

export const initializePanResponder = (
  props,
  animatedValueX,
  animatedValueY,
  panX,
  panY
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
    onPanResponderGrant: this.onPanResponderGrant,
    onPanResponderMove: onPanResponderMove(
      props,
      animatedValueX,
      animatedValueY,
      panX,
      panY
    ),
    onPanResponderRelease: this.onPanResponderRelease,
    onPanResponderTerminate: this.onPanResponderRelease
  });
};
