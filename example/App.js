import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Swiper from 'react-native-dynamic-deck-swiper';
import { Animated, Dimensions, PanResponder } from 'react-native';
import styles from './styles';

// Temporarily copying component here for rapid debugging:
const { width } = Dimensions.get('window');
// const position = new Animated.ValueXY();

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

// const Swiper = ({ getNextCardData, renderCard }) => {
//   const _getNextCardData = (obj) => getNextCardData(nextCardProps(obj));

//   const [topCardData, setTopCardData] = useState(
//     _getNextCardData({ first: true })
//   );
//   const [previousCards, setPreviousCards] = useState([]);
//   const [swipeDirection, setSwipeDirection] = useState(null);
//   const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
//   console.log(`Reset position to: ${JSON.stringify(position.y)}`);

//   useEffect(() => {
//     console.log('topCardData');
//     console.log(topCardData);
//   }, [topCardData]);

//   useEffect(() => {
//     console.log('previousCards');
//     position.setValue({ x: 0, y: 0 });
//   }, [previousCards]);

//   useEffect(() => {
//     console.log('swipeDirection');
//     console.log(swipeDirection);
//   }, [swipeDirection]);

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: (event, gestureState) => true,
//     onPanResponderMove: (event, gestureState) => {
//       // console.log(
//       //   JSON.stringify(({ moveX, moveY, x0, y0, dx, dy } = gestureState))
//       // );
//       // console.log(event);
//       console.log(position.y._value);
//       console.log(gestureState.dy - position.y._value);
//       if (Math.abs(gestureState.dy - position.y._value) <= 10) {
//         position.setValue({ x: gestureState.dx, y: gestureState.dy });
//       }
//       if (gestureState.dx >= 0) {
//         setSwipeDirection('right');
//       } else if (gestureState.dx < 0) {
//         setSwipeDirection('left');
//       }
//     },
//     onPanResponderRelease: (event, gestureState) => {
//       if (gestureState.dx > 120 || gestureState.dx < -120) {
//         const offscreen = gestureState.dx > 0 ? width : -width;
//         Animated.spring(position, {
//           toValue: { x: offscreen, y: gestureState.dy },
//           overshootClamping: true
//         }).start(() => {
//           setPreviousCards([...previousCards, topCardData]);
//           setTopCardData(_getNextCardData({ swipeDirection, previousCards }));
//         });
//       } else {
//         Animated.spring(position, {
//           toValue: { x: 0, y: 0 },
//           friction: 4
//         }).start();
//       }
//     }
//   });

//   return (
//     <>
//       <Animated.View
//         {...panResponder.panHandlers}
//         style={[
//           { transform: position.getTranslateTransform() },
//           styles.topCard
//         ]}
//       >
//         {renderCard(topCardData)}
//       </Animated.View>
//       <View style={styles.nextCard}>
//         {renderCard(_getNextCardData({ swipeDirection, previousCards }))}
//       </View>
//     </>
//   );
// };
// End of component

export default function App() {
  return (
    <View style={styles2.container}>
      <Swiper
        getNextCardData={({ first, left, right, previousCards }) => {
          if (first) {
            return 'This is the first card. This is card #1.';
          } else if (left) {
            return `You swiped to the left. This is card #${previousCards.length +
              1}.`;
          } else if (right) {
            return `You swiped to the right. This is card #${previousCards.length +
              1}.`;
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
