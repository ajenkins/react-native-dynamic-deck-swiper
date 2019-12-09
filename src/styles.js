import { Dimensions, StyleSheet } from 'react-native';

const { SCREEN_HEIGHT, SCREEN_WIDTH } = Dimensions.get('screen');

const styles = StyleSheet.create({
  card: {
    flex: 1,
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  }
});

export default styles;
