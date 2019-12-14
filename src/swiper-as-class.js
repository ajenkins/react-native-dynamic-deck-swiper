import React from 'react';
import { Animated, Dimensions, PanResponder, Text, View } from 'react-native';

import styles from './styles';

// TODO: Figure out how to let the user indicate that
// they've reached the last card, which should not be
// swipable.

// TODO: Fix bug where moving card across the middle
// plane calls setSwipeDirection which changes the value
// of swipeDirection and triggers a re-render, which then
// resets the value of position back to the middle.

const { height, width } = Dimensions.get('window');

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

// TODO: This could be a helpful performance optimization
// function createCardTree(getNextCardData, maxDepth = 5) {
//   function _createCardTree(cardTree, remainingDepth, swipeDirection) {
//     let cardTree = JSON.parse(JSON.stringify(cardTree));
//     if (remainingDepth === 0) {
//       return cardTree;
//     }
//     switch (swipeDirection) {
//       case 'first':
//         return _createCardTree()
//       case 'left':
//         break;
//       case 'right':
//         break;
//     }
//   }
//   return _getNextCardData({}, maxDepth, 'first');
// }

class DynamicSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCardData: this._getNextCardData({ first: true }),
      previousCards: [],
      swipeDirection: null,
      index: 0 // This is temporary
    };
    this.position = new Animated.ValueXY();
    this.panResponder = this.createPanResponder();
    this.renderCards = this.renderCards.bind(this);
    this.cards = [
      'This is the first card',
      'This is the second card',
      'This is the third card',
      'This is the fourth card'
    ];
  }

  _getNextCardData(obj) {
    return this.props.getNextCardData(nextCardProps(obj));
  }

  createPanResponder() {
    return PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onPanResponderMove: (event, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
        if (gestureState.dx > 0) {
          this.setState({ swipeDirection: 'right' });
        } else if (gestureState.dx < 0) {
          this.setState({ swipeDirection: 'left' });
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: width + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ index: this.state.index + 1 });
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -width - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ index: this.state.index + 1 });
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

  renderCards() {
    return this.cards.map((card, i) => {
      if (this.state.index > i) {
        return null;
      } else if (this.state.index === i) {
        return (
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              { transform: this.position.getTranslateTransform() },
              styles.topCard
            ]}
          >
            {this.props.renderCard(card)}
          </Animated.View>
        );
      } else {
        return (
          <View style={styles.nextCard}>{this.props.renderCard(card)}</View>
        );
      }
    });
  }

  render() {
    return this.renderCards();
  }
}

export default DynamicSwiper;
