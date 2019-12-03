import { Dimensions, PanResponder } from 'react-native';

export const initializeCardStyle = (onDimensionsChange) => {
  Dimensions.addEventListener('change', onDimensionsChange);
};

export const initializePanResponder = () => {
  return PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onMoveShouldSetPanResponder: (event, gestureState) => false,

    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      const isVerticalSwipe = Math.sqrt(
        Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2)
      );
      if (!this.props.verticalSwipe && isVerticalSwipe) {
        return false;
      }
      return (
        Math.sqrt(Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)) >
        10
      );
    },
    onPanResponderGrant: this.onPanResponderGrant,
    onPanResponderMove: this.onPanResponderMove,
    onPanResponderRelease: this.onPanResponderRelease,
    onPanResponderTerminate: this.onPanResponderRelease
  });
};
