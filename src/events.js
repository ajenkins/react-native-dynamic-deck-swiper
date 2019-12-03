import { Animated } from 'react-native';

import { createAnimatedEvent } from './animations';

export const onDimensionsChange = (forceUpdate) => {
  forceUpdate();
};

export const onPanResponderMove = (
  {
    horizontalSwipe,
    verticalSwipe,
    horizontalThreshold,
    verticalThreshold,
    onSwiping,
    onTapCardDeadZone,
    overlayOpacityHorizontalThreshold,
    overlayOpacityVerticalThreshold
  },
  animatedValueX,
  animatedValueY,
  panX,
  panY
) => (event, gestureState) => {
  onSwiping(animatedValueX, animatedValueY);

  if (!overlayOpacityHorizontalThreshold) {
    overlayOpacityHorizontalThreshold = horizontalThreshold;
  }
  if (!overlayOpacityVerticalThreshold) {
    overlayOpacityVerticalThreshold = verticalThreshold;
  }

  let isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom;

  if (
    Math.abs(animatedValueX) > Math.abs(animatedValueY) &&
    Math.abs(animatedValueX) > overlayOpacityHorizontalThreshold
  ) {
    if (animatedValueX > 0) isSwipingRight = true;
    else isSwipingLeft = true;
  } else if (
    Math.abs(animatedValueY) > Math.abs(animatedValueX) &&
    Math.abs(animatedValueY) > overlayOpacityVerticalThreshold
  ) {
    if (animatedValueY > 0) isSwipingBottom = true;
    else isSwipingTop = true;
  }

  let stateUpdates = {};
  if (isSwipingRight) {
    stateUpdates.labelType = LABEL_TYPES.RIGHT;
  } else if (isSwipingLeft) {
    stateUpdates.labelType = LABEL_TYPES.LEFT;
  } else if (isSwipingTop) {
    stateUpdates.labelType = LABEL_TYPES.TOP;
  } else if (isSwipingBottom) {
    stateUpdates.labelType = LABEL_TYPES.BOTTOM;
  } else {
    stateUpdates = LABEL_TYPES.NONE;
  }

  if (
    animatedValueX < -onTapCardDeadZone ||
    animatedValueX > onTapCardDeadZone ||
    animatedValueY < -onTapCardDeadZone ||
    animatedValueY > onTapCardDeadZone
  ) {
    stateUpdates.slideGesture = true;
  }

  return [
    stateUpdates,
    Animated.event([
      null,
      createAnimatedEvent(horizontalSwipe, verticalSwipe, panX, panY)
    ])(event, gestureState)
  ];
};
