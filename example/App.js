import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-dynamic-deck-swiper';

export default function App() {
  return (
    <View style={styles.container}>
      <Swiper
        getNextCardData={({ first, swipeDirection, previousCards }) => {
          if (previousCards.length >= 10) {
            // End of deck
            return null;
          } else if (first) {
            return 'This is the first card. This is card #1.';
          } else {
            return `You swiped to the ${swipeDirection}. This is card #${previousCards.length +
              1}.`;
          }
        }}
        preventVerticalDragging={false}
        onEndReached={() => console.log('end reached')}
        onSwiped={() => console.log('card swiped')}
        onSwipeAborted={() => console.log('swipe aborted')}
        onSwipedLeft={() => console.log('left swipe')}
        onSwipedRight={() => console.log('right swipe')}
        onDragStart={() => console.log('begin drag')}
        onDragEnd={() => console.log('finish drag')}
        disableSwipeUp={false}
        disableSwipeDown={false}
      >
        {(card) =>
          card === null ? (
            <View style={styles.card}>
              <Text style={styles.text}>
                You've reached the end of the deck, pal.
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.text}>{card}</Text>
            </View>
          )
        }
      </Swiper>
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
