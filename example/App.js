import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
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
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flex: 1,
          position: 'aboslute',
          top: 0,
          bottom: 0,
          height,
          width
        }}
      >
        <View style={styles.card}>
          <Text style={styles.text}>This is the first card</Text>
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
    backgroundColor: 'white'
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  }
});
