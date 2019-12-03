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
