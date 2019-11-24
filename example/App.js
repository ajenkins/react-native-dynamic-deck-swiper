import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MyComponent from 'react-native-dynamic-deck-swiper';

export default function App() {
  return (
    <View style={styles.container}>
      <MyComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
