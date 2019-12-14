import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Swiper from 'react-native-dynamic-deck-swiper';
import { Animated, Dimensions, PanResponder } from 'react-native';
import styles from './styles';

// Temporarily copying component here for rapid debugging:
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

class Swiper extends React.Component {
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
    return this.cards
      .map((card, i) => {
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
              key={card}
            >
              {this.props.renderCard(card)}
            </Animated.View>
          );
        } else {
          return (
            <View style={styles.nextCard} key={card}>
              {this.props.renderCard(card)}
            </View>
          );
        }
      })
      .reverse();
  }

  render() {
    return <View>{this.renderCards()}</View>;
  }
}
// End of component

export default function App() {
  return (
    <View style={styles2.container}>
      <Swiper
        getNextCardData={({ first, left, right, previousCards }) => {
          if (first) {
            return 'This is the first card';
          } else if (left) {
            return 'You swiped to the left';
          } else if (right) {
            return 'You swiped to the right';
          }
        }}
        renderCard={(card) => (
          <View style={styles2.card}>
            <Text style={styles2.text}>{card}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'turquoise',
    marginTop: 60,
    marginBottom: 60,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 30,
    padding: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  }
});
