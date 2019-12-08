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

export const incrementCardIndex = (onSwiped) => {
  const { firstCardIndex } = this.state;
  const { infinite } = this.props;
  let newCardIndex = firstCardIndex + 1;
  let swipedAllCards = false;

  this.onSwipedCallbacks(onSwiped);

  allSwipedCheck = () => newCardIndex === this.state.cards.length;

  if (allSwipedCheck()) {
    if (!infinite) {
      this.props.onSwipedAll();
      // onSwipeAll may have added cards
      if (allSwipedCheck()) {
        swipedAllCards = true;
      }
    } else {
      newCardIndex = 0;
    }
  }

  this.setCardIndex(newCardIndex, swipedAllCards);
};

export const decrementCardIndex = (onSwiped) => {
  const { firstCardIndex } = this.state;
  const lastCardIndex = this.state.cards.length - 1;
  const previousCardIndex = firstCardIndex - 1;

  const newCardIndex = firstCardIndex === 0 ? lastCardIndex : previousCardIndex;

  this.onSwipedCallbacks(onSwiped);
  this.setCardIndex(newCardIndex, false);
};
