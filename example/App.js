import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Swiper from 'react-native-dynamic-deck-swiper';

const cards = ['YOU', 'SHOULD', 'HAVE', 'BOUGHT', 'A', 'SQUIRREL'];

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Swiper
//         nextCard={({ first, left, right, previousCards }) => {
//           if (first) {
//             return 'This is the first card';
//           } else {
//             return 'There are a lot of these cards';
//           }
//         }}
//         renderCard={(card) => (
//           <View style={styles.card}>
//             <Text style={styles.text}>{card}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
const { height, width } = Dimensions.get('window');

export default function App() {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
      if (gestureState.dx > 0) {
        setSwipeDirection('right');
      } else if (gestureState.dx < 0) {
        setSwipeDirection('left');
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 4
      }).start();
    }
  });
  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          { transform: position.getTranslateTransform() },
          {
            position: 'absolute',
            height,
            width,
            zIndex: 1
          }
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.text}>This is the first card</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          height,
          width
        }}
      >
        <View style={styles.card}>
          <Text style={styles.text}>You swiped to the {swipeDirection}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
