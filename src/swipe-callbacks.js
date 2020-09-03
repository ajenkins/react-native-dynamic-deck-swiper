import { UP, DOWN, LEFT, RIGHT } from './swiper';

const triggerSwipeCallbacks = (
  { onSwiped, onSwipedUp, onSwipedDown, onSwipedLeft, onSwipedRight },
  swipedCard,
  swipeDirection
) => {
  onSwiped(swipedCard);
  switch (swipeDirection) {
    case UP:
      onSwipedUp(swipedCard);
      break;
    case DOWN:
      onSwipedDown(swipedCard);
      break;
    case LEFT:
      onSwipedLeft(swipedCard);
      break;
    case RIGHT:
      onSwipedRight(swipedCard);
      break;
  }
};

export default triggerSwipeCallbacks;
