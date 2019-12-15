import React from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';

import styles from './styles';

// TODO: Figure out how to let the user indicate that
// they've reached the last card, which should not be
// swipable.

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
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
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
          {this.props.renderCard(
            this._getNextCardData({
              swipeDirection: this.state.swipeDirection,
              previousCards: [
                ...this.state.previousCards,
                this.state.topCardData
              ]
            })
          )}
        </View>
      </>
    );
  }
}

export default DynamicSwiper;
