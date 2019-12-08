import { Animated } from 'react-native';

import { mustDecrementCardIndex } from './calculations';

const SWIPE_MULTIPLY_FACTOR = 4.5;

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

const setSwipeBackCardXY = (setState, x = -width, y = 0, cb) => {
  setState(
    { swipeBackXYPositions: [...this.state.swipeBackXYPositions, { x, y }] },
    cb
  );
};

export const swipeCard = (
  decrementCardIndex,
  incrementCardIndex,
  onSwiped,
  x = animatedValueX,
  y = animatedValueY,
  pan,
  setState
) => {
  setState({ panResponderLocked: true });
  animateStack(props, state);
  Animated.timing(pan, {
    toValue: {
      x: x * SWIPE_MULTIPLY_FACTOR,
      y: y * SWIPE_MULTIPLY_FACTOR
    },
    duration: this.props.swipeAnimationDuration
  }).start(() => {
    setSwipeBackCardXY(x, y, () => {
      mustDecrementCardIndex = mustDecrementCardIndex(
        animatedValueX,
        animatedValueY
      );

      if (mustDecrementCardIndex) {
        decrementCardIndex(onSwiped);
      } else {
        incrementCardIndex(onSwiped);
      }
    });
  });
};

export const animateStack = (
  {
    stackSize,
    infinite,
    showSecondCard,
    stackAnimationFriction,
    stackAnimationTension,
    stackScale,
    stackSeparation
  },
  { cards, secondCardIndex, swipedAllCards } = state
) => {
  let index = secondCardIndex;

  while (stackSize-- > 1 && showSecondCard && !swipedAllCards) {
    if (state[`stackPosition${stackSize}`] && state[`stackScale${stackSize}`]) {
      const newSeparation = stackSeparation * (stackSize - 1);
      const newScale = (100 - stackScale * (stackSize - 1)) * 0.01;
      Animated.parallel([
        Animated.spring(state[`stackPosition${stackSize}`], {
          toValue: newSeparation,
          friction: stackAnimationFriction,
          tension: stackAnimationTension,
          useNativeDriver: true
        }),
        Animated.spring(state[`stackScale${stackSize}`], {
          toValue: newScale,
          friction: stackAnimationFriction,
          tension: stackAnimationTension,
          useNativeDriver: true
        })
      ]).start();
    }

    if (infinite) {
      index++;
    } else {
      if (index === cards.length - 1) {
        break;
      } else {
        index++;
      }
    }
  }
};
