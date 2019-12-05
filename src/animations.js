import { Animated } from 'react-native';

export const rebuildStackAnimatedValues = (props) => {
  const stackPositionsAndScales = {};
  const { stackSize, stackSeparation, stackScale } = props;

  for (let position = 0; position < stackSize; position++) {
    stackPositionsAndScales[`stackPosition${position}`] = new Animated.Value(
      stackSeparation * position
    );
    stackPositionsAndScales[`stackScale${position}`] = new Animated.Value(
      (100 - stackScale * position) * 0.01
    );
  }

  return stackPositionsAndScales;
};

export const createAnimatedEvent = (
  horizontalSwipe,
  verticalSwipe,
  panX,
  panY
) => {
  const dx = horizontalSwipe ? panX : 0;
  const dy = verticalSwipe ? panY : 0;
  return { dx, dy };
};

export const resetTopCard = (
  pan,
  topCardResetAnimationFriction,
  topCardResetAnimationTension,
  onSwipedAborted
) => {
  Animated.spring(pan, {
    toValue: 0,
    friction: topCardResetAnimationFriction,
    tension: topCardResetAnimationTension
  }).start();

  pan.setOffset({
    x: 0,
    y: 0
  });

  onSwipedAborted();
};
