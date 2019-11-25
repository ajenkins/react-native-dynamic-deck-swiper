import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-dynamic-deck-swiper';

const cards = ['YOU', 'SHOULD', 'HAVE', 'BOUGHT', 'A', 'SQUIRREL'];

export default function App() {
  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(card) => (
          <View style={styles.card}>
            <Text style={styles.text}>{card}</Text>
          </View>
        )}
      />
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
