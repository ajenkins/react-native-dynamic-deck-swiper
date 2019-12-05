export const calculateCardIndexes = (firstCardIndex, cards) => {
  firstCardIndex = firstCardIndex || 0;
  const previousCardIndex =
    firstCardIndex === 0 ? cards.length - 1 : firstCardIndex - 1;
  const secondCardIndex =
    firstCardIndex === cards.length - 1 ? 0 : firstCardIndex + 1;
  return { firstCardIndex, secondCardIndex, previousCardIndex };
};

export const getSwipeDirection = (
  { horizontalThreshold, verticalThreshold },
  animatedValueX,
  animatedValueY
) => {
  const isSwipingLeft = animatedValueX < -horizontalThreshold;
  const isSwipingRight = animatedValueX > horizontalThreshold;
  const isSwipingTop = animatedValueY < -verticalThreshold;
  const isSwipingBottom = animatedValueY > verticalThreshold;

  return { isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom };
};

export const mustDecrementCardIndex = (
  {
    goBackToPreviousCardOnSwipeLeft,
    goBackToPreviousCardOnSwipeRight,
    goBackToPreviousCardOnSwipeTop,
    goBackToPreviousCardOnSwipeBottom
  },
  animatedValueX,
  animatedValueY
) => {
  const {
    isSwipingLeft,
    isSwipingRight,
    isSwipingTop,
    isSwipingBottom
  } = this.getSwipeDirection(animatedValueX, animatedValueY);

  return (
    (isSwipingLeft && goBackToPreviousCardOnSwipeLeft) ||
    (isSwipingRight && goBackToPreviousCardOnSwipeRight) ||
    (isSwipingTop && goBackToPreviousCardOnSwipeTop) ||
    (isSwipingBottom && goBackToPreviousCardOnSwipeBottom)
  );
};
