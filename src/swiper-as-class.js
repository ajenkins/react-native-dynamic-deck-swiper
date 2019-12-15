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

  render() {
    return (
      <>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            { transform: this.position.getTranslateTransform() },
            styles.topCard
          ]}
        >
          {renderCard(this.state.topCardData)}
        </Animated.View>
        <View style={styles.nextCard}>
          {renderCard(
            _getNextCardData({
              swipeDirection: this.state.swipeDirection,
              previousCards: this.state.previousCards
            })
          )}
        </View>
      </>
    );
  }
}

export default DynamicSwiper;
