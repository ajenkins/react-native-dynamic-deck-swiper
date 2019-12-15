import React, { useEffect, useRef, useState } from 'react';
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

const Swiper = ({ getNextCardData, renderCard }) => {
  const _getNextCardData = (obj) => getNextCardData(nextCardProps(obj));

  const [topCardData, setTopCardData] = useState(
    _getNextCardData({ first: true })
  );
  const [previousCards, setPreviousCards] = useState([]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    console.log('resetting card position');
    position.setValue({ x: 0, y: 0 });
  }, [previousCards]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event, gestureState) => true,
    onPanResponderMove: (event, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy });
      if (gestureState.dx >= 0) {
        setSwipeDirection('right');
      } else if (gestureState.dx < 0) {
        setSwipeDirection('left');
      }
    },
    onPanResponderRelease: (event, gestureState) => {
      if (gestureState.dx > 120) {
        Animated.spring(position, {
          toValue: { x: width + 100, y: gestureState.dy }
        }).start(() => {
          setPreviousCards([...previousCards, topCardData]);
          setTopCardData(_getNextCardData({ swipeDirection, previousCards }));
        });
      } else if (gestureState.dx < -120) {
        Animated.spring(position, {
          toValue: { x: -width - 100, y: gestureState.dy }
        }).start(() => {
          setPreviousCards([...previousCards, topCardData]);
          setTopCardData(_getNextCardData({ swipeDirection, previousCards }));
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4
        }).start();
      }
    }
  });

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          { transform: position.getTranslateTransform() },
          styles.topCard
        ]}
      >
        {renderCard(topCardData)}
      </Animated.View>
      <View style={styles.nextCard}>
        {renderCard(_getNextCardData({ swipeDirection, previousCards }))}
      </View>
    </>
  );
};
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
              2}.`;
          } else if (right) {
            return `You swiped to the right. This is card #${previousCards.length +
              2}.`;
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
