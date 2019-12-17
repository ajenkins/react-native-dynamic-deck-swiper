import { Animated, PanResponder } from 'react-native';

const createPanResponder = (
  props,
  state,
  position,
  setState,
  _getNextCardData
) =>
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      props.onDragging(gestureState.dx, gestureState.dy);

      // Move card
      if (props.preventVerticalDragging) {
        position.setValue({ x: gestureState.dx, y: 0 });
      } else {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      }

      // Update state based on current card location
      if (
        Math.abs(gestureState.dx) / width >=
        Math.abs(gestureState.dy) / height
      ) {
        if (gestureState.dx > 0) {
          setState({ swipeDirection: RIGHT });
        } else if (gestureState.dx < 0) {
          setState({ swipeDirection: LEFT });
        }
      } else {
        if (gestureState.dy > 0) {
          setState({ swipeDirection: UP });
        } else if (gestureState.dy < 0) {
          setState({ swipeDirection: DOWN });
        }
      }
    },
    onPanResponderGrant: () => {
      props.onDragStart();
    },
    onPanResponderRelease: (e, gestureState) => {
      props.onDragEnd();

      const leftSwipe =
        gestureState.dx < -props.horizontalThreshold && !props.disableSwipeLeft;
      const rightSwipe =
        gestureState.dx > props.horizontalThreshold && !props.disableSwipeRight;
      const upSwipe =
        gestureState.dy > props.verticalThreshold && !props.disableSwipeUp;
      const downSwipe =
        gestureState.dy < -props.verticalThreshold && !props.disableSwipeDown;
      if (leftSwipe || rightSwipe || upSwipe || downSwipe) {
        // Trigger event callbacks
        props.onSwiped(state.topCardData);
        gestureState.dx > 0
          ? props.onSwipedRight(state.topCardData)
          : props.onSwipedLeft(state.topCardData);

        // Animate swipe then update state
        const offscreen = gestureState.dx > 0 ? width : -width;
        Animated.spring(position, {
          toValue: { x: offscreen, y: gestureState.dy },
          overshootClamping: true
        }).start(() => {
          setState(
            {
              previousCards: [...state.previousCards, state.topCardData]
            },
            () => {
              setState({
                topCardData: _getNextCardData({
                  swipeDirection: state.swipeDirection,
                  previousCards: state.previousCards
                })
              });
            }
          );
        });
      } else {
        // Swipe aborted
        props.onSwipeAborted(state.topCardData);
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start();
      }
    }
  });

export default createPanResponder;
