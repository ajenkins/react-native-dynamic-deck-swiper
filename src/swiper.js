import React from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import PropTypes from 'prop-types';

import {
  calculateOffscreen,
  onPanResponderMove,
  validSwipe
} from './panresponder';
import triggerSwipeCallbacks from './swipe-callbacks';
import styles from './styles';

export const LEFT = 'left';
export const RIGHT = 'right';
export const UP = 'up';
export const DOWN = 'down';

// TODO: Calculate dimensions more dynamically
// https://facebook.github.io/react-native/docs/dimensions#get
const { height, width } = Dimensions.get('window');

const nextCardProps = ({
  first = false,
  swipeDirection,
  previousCards = []
}) => ({
  first,
  left: swipeDirection == LEFT,
  right: swipeDirection == RIGHT,
  up: swipeDirection == UP,
  down: swipeDirection == DOWN,
  swipeDirection,
  previousCards
});

class DynamicSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCardData: this._getNextCardData({ first: true }),
      previousCards: [],
      swipeDirection: null
    };
    this.position = new Animated.ValueXY();
    this.panResponder = this.createPanResponder();
    this.releaseHelper = this.releaseHelper.bind(this);
  }

  _getNextCardData(obj) {
    return this.props.getNextCardData(nextCardProps(obj));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.previousCards.length !== prevState.previousCards.length) {
      this.position.setValue({ x: 0, y: 0 });
    }
  }

  createPanResponder() {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        this.props.onDragging(gestureState.dx, gestureState.dy);
        this.setState(onPanResponderMove(gestureState, this.position));
      },
      onPanResponderGrant: () => {
        this.props.onDragStart();
      },
      onPanResponderRelease: (e, gestureState) => {
        this.props.onDragEnd();
        this.releaseHelper(gestureState);
      }
    });
  }

  releaseHelper(gestureState) {
    if (validSwipe(this.props, gestureState.dx, gestureState.dy)) {
      // Animate swipe then update state
      Animated.spring(this.position, {
        toValue: calculateOffscreen(
          this.state.swipeDirection,
          gestureState.dx,
          gestureState.dy
        ),
        overshootClamping: true
      }).start(() => {
        const swipedCard = { ...this.state.topCardData };
        const swipeDirection = this.state.swipeDirection;
        const newPreviousCards = [
          ...this.state.previousCards,
          this.state.topCardData
        ];
        this.setState(
          {
            topCardData: this._getNextCardData({
              swipeDirection,
              previousCards: newPreviousCards
            }),
            previousCards: newPreviousCards
          },
          () => triggerSwipeCallbacks(this.props, swipedCard, swipeDirection)
        );
      });
    } else {
      // Swipe aborted
      this.props.onSwipeAborted(this.state.topCardData);
      Animated.spring(this.position, {
        toValue: { x: 0, y: 0 },
        friction: 4
      }).start();
    }
  }

  render() {
    if (this.state.topCardData === null) {
      // End of deck
      this.props.onEndReached();
      return <View style={styles.topCard}>{this.props.children(null)}</View>;
    } else {
      const nextCardData = this._getNextCardData({
        swipeDirection: this.state.swipeDirection,
        previousCards: [...this.state.previousCards, this.state.topCardData]
      });
      return (
        <>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              { transform: this.position.getTranslateTransform() },
              styles.topCard
            ]}
          >
            {this.props.children(this.state.topCardData)}
          </Animated.View>
          <View style={styles.nextCard}>
            {this.props.children(nextCardData)}
          </View>
        </>
      );
    }
  }
}

DynamicSwiper.propTypes = {
  /**
   * Function signature:
   * ({first, left, right, previousCards}) => (nextCardData)
   * first: bool - true for top card only
   * left: bool - true if the user swiped left
   * right: bool - true if the user swiped right
   * previousCards: array - array of the cardData for all swiped cards
   * nextCardData: any - will be supplied as input to children render prop
   *
   * Function will be called once every time the user drags the top
   * card across the midline of the screen. One of first, left, or right
   * will be true whenever the function is called. Function should
   * return the data that should be passed into the children function for
   * rendering the next card based on the input parameters to the function.
   * To indicate that the end of the deck has been reached, return
   * null from this function.
   */
  getNextCardData: PropTypes.func.isRequired,
  /**
   * Function signature:
   * (cardData) => <ReactElement />
   * cardData: any - whatever was returned by getNextCardData
   *
   * Function called twice per component render: once for the current
   * top card and once for the current next card. Should return a React
   * element that will be rendered. The returned element should be styled
   * because the component does very little of its own styling. Make
   * sure your function handles the case where cardData is null if you
   * don't want the last card to be blank.
   */
  children: PropTypes.func.isRequired,
  /**
   * Restricts dragging to the horizontal movement only.
   * Can be useful if the cards for left and right swipes may
   * look very different and you don't want the user to see the
   * next card flash between the two possible states.
   */
  preventVerticalDragging: PropTypes.bool,
  /**
   * How much the top card must be dragged for it
   * to count as a left or right swipe.
   */
  horizontalThreshold: PropTypes.number,
  /**
   * How much the top card must be dragged for it
   * to count as an up or down swipe.
   */
  verticalThreshold: PropTypes.number,
  /**
   * Prevent the user from swiping up.
   */
  disableSwipeUp: PropTypes.bool,
  /**
   * Prevent the user from swiping to the right.
   */
  disableSwipeRight: PropTypes.bool,
  /**
   * Prevent the user from swiping down.
   */
  disableSwipeDown: PropTypes.bool,
  /**
   * Prevent the user from swiping to the left.
   */
  disableSwipeLeft: PropTypes.bool,
  /**
   * Called (no arguments) once the end of the
   * deck has been reached.
   */
  onEndReached: PropTypes.func,
  /**
   * Called after a card is swiped. Called
   * with the cardData for the card that was swiped.
   */
  onSwiped: PropTypes.func,
  /**
   * Called if the dragged card is released between
   * the horizontalThreshold values. Called with the
   * cardData for the card that was being dragged.
   */
  onSwipeAborted: PropTypes.func,
  /**
   * Called after a card is swiped to the left.
   * Called with the cardData for the card that was swiped.
   */
  onSwipedLeft: PropTypes.func,
  /**
   * Called after a card is swiped to the right.
   * Called with the cardData for the card that was swiped.
   */
  onSwipedRight: PropTypes.func,
  /**
   * Called continuously while a card is being dragged.
   * Called with two arguments, x and y of the card position.
   */
  onDragging: PropTypes.func,
  /**
   * Called when the user begins dragging a card.
   * Not called with any arguments.
   */
  onDragStart: PropTypes.func,
  /**
   * Called when the user finishes dragging a card
   * (releases it). Not called with any arguments.
   */
  onDragEnd: PropTypes.func
};

DynamicSwiper.defaultProps = {
  preventVerticalDragging: false,
  horizontalThreshold: width / 4,
  verticalThreshold: height / 4,
  disableSwipeUp: true,
  disableSwipeRight: false,
  disableSwipeDown: true,
  disableSwipeLeft: false,
  onEndReached: () => {},
  onSwiped: () => {},
  onSwipeAborted: () => {},
  onSwipedLeft: () => {},
  onSwipedRight: () => {},
  onSwipedUp: () => {},
  onSwipedDown: () => {},
  onDragging: () => {},
  onDragStart: () => {},
  onDragEnd: () => {}
};

export default DynamicSwiper;
