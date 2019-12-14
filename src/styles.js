import { Dimensions, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  topCard: {
    position: 'absolute',
    height,
    width,
    backgroundColor: 'red',
    zIndex: 1
  },
  nextCard: {
    position: 'absolute',
    height,
    width,
    backgroundColor: 'blue'
  }
});

export default styles;
