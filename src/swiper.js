import React from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

// TODO - MUST HAVES:
// Add event callback props (onSwipe, onLastCardReached)

// TODO: Calculate dimensions more dynamically
const { width } = Dimensions.get('window');

const nextCardProps = ({
  first = false,
  swipeDirection,
  previousCards = []
}) => ({
  first,
  left: swipeDirection == 'left',
  right: swipeDirection == 'right',
  previousCards
});

// TODO: Recursively createCardTree to improve performance
// TODO: Write unit tests using RTL
// TODO: Add prop for restricting vertical dragging
// TODO: Add fancier animations, like tilting the card
// and changing the size and opacity of the next card

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
        if (this.props.preventVerticalDragging) {
          this.position.setValue({ x: gestureState.dx, y: 0 });
        } else {
          this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
        }

        if (gestureState.dx > 0) {
          this.setState({ swipeDirection: 'right' });
        } else if (gestureState.dx < 0) {
          this.setState({ swipeDirection: 'left' });
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 120 || gestureState.dx < -120) {
          const offscreen = gestureState.dx > 0 ? width : -width;
          Animated.spring(this.position, {
            toValue: { x: offscreen, y: gestureState.dy },
            overshootClamping: true
          }).start(() => {
            this.setState(
              {
                previousCards: [
                  ...this.state.previousCards,
                  this.state.topCardData
                ]
              },
              () => {
                this.setState({
                  topCardData: this._getNextCardData({
                    swipeDirection: this.state.swipeDirection,
                    previousCards: this.state.previousCards
                  })
                });
              }
            );
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start();
        }
      }
    });
  }

  render() {
    if (this.state.topCardData === null) {
      // End of deck
      return <View style={styles.topCard}>{this.props.renderCard(null)}</View>;
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
            {this.props.renderCard(this.state.topCardData)}
          </Animated.View>
          <View style={styles.nextCard}>
            {this.props.renderCard(nextCardData)}
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
   * nextCardData: any - will be supplied as input to renderCard prop
   *
   * Function will be called once every time the user drags the top
   * card across the midline of the screen. One of first, left, or right
   * will be true whenever the function is called. Function should
   * return the data that should be passed into renderCard for rendering
   * the next card based on the input parameters to the function.
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
  renderCard: PropTypes.func.isRequired,
  /**
   * Restricts dragging to the horizontal movement only.
   * Can be useful if the cards for left and right swipes may
   * look very different and you don't want the user to see the
   * next card flash between the two possible states.
   */
  preventVerticalDragging: PropTypes.bool
};

DynamicSwiper.defaultProps = {
  preventVerticalDragging: false
};

export default DynamicSwiper;
