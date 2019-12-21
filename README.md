# react-native-dynamic-deck-swiper

## Overview

This is a React Native component for creating a Tinder-like deck swiper where
you can specify the next card based on the user's swipe direction and the previous
cards, instead of needing to initialize the component with the whole deck upfront.

### Example use case

Imagine you want to build an interactive card swiping game,
like [Reigns on iOS](https://apps.apple.com/us/app/reigns/id1114127463).
Maybe the user has to navigate a maze using left and right swipes.
In this case, you can't specify the full, linear deck of cards because
the next card shown depends on which direction the user swiped. Using this
component you would pass a function into the getNextCardData prop that returns
the data for the next card based on which direction the user swiped.

See below for a code example.

## Installation

```
npm install react-native-dynamic-deck-swiper --save
```

## Prior Work

The code for this component is adapted from the tutorial created by Unsure Programmer (Varun Nath).

[Tutorial on YouTube](https://youtu.be/MDAdY2LkP_U)

[Link to code on GitHub](https://github.com/nathvarun/React-Native-Layout-Tutorial-Series/tree/master/Project%20Files/12%20Tinder%20Swipe%20Deck)

If you're looking for a more fully featured deck swiper, or if you don't
need to set the next card dynamically, check out the great component
from alexbrilliant,
[react-native-deck-swiper](https://github.com/alexbrillant/react-native-deck-swiper),
which inspired the name and props of this component.

## Preview

![Swiper demo](https://media.giphy.com/media/ifXXjhgWopZ3tydglt/giphy.gif)

## Props

_See component propTypes in the source code for additional usage info._

### Card props

| Props                   | type                                      | description                                                         | required | default |
| :---------------------- | :---------------------------------------- | :------------------------------------------------------------------ | :------- | :------ |
| getNextCardData         | func({first, left, right, previousCards}) | return value is passed to render prop as cardData for the next card | required |
| children                | func(cardData)                            | render prop to render the card based on the data                    | required |
| preventVerticalDragging | bool                                      | enable/disable horizontal swiping                                   |          | true    |

### Swipe animation props

| Props               | type   | description                 | default    |
| :------------------ | :----- | :-------------------------- | :--------- |
| horizontalThreshold | number | horizontal swipe threshold  | width / 4  |
| verticalThreshold   | number | vertical swipe threshold    | height / 4 |
| disableSwipeUp      | bool   | prevent upward swipes       | true       |
| disableSwipeDown    | bool   | prevent downward swipes     | true       |
| disableSwipeLeft    | bool   | prevent swipes to the left  | false      |
| disableSwipeDown    | bool   | prevent swipes to the right | false      |

### Event callbacks

| Props          | type | description                                                                            | Signature                       |
| :------------- | :--- | :------------------------------------------------------------------------------------- | :------------------------------ |
| onEndReached   | func | function to be called when all cards have been swiped                                  | () => {}                        |
| onSwiped       | func | function to be called when a card is swiped. it receives the swiped card and direction | (cardData, {left, right}) => {} |
| onSwipeAborted | func | function to be called when a card is released before reaching the threshold            | () => {}                        |
| onSwipedUp     | func | function to be called when a card is swiped up. it receives the swiped card index      | (cardData) => {}                |
| onSwipedDown   | func | function to be called when a card is swiped down. it receives the swiped card index    | (cardData) => {}                |
| onSwipedLeft   | func | function to be called when a card is swiped left. it receives the swiped card index    | (cardData) => {}                |
| onSwipedRight  | func | function to be called when a card is swiped right. it receives the swiped card index   | (cardData) => {}                |
| onDragging     | func | function to be called while a card is being moved. it receives X and Y positions       | (x, y) => {}                    |
| onDragStart    | func | function to be called when drag start                                                  |                                 |
| onDragEnd      | func | function to be called when drag end                                                    |                                 |

## Usage example

```javascript
import Swiper from 'react-native-dynamic-deck-swiper';

function MyDynamicSwiper() {
  return (
    <View style={styles.container}>
      <Swiper
        getNextCardData={({ first, left, right, previousCards }) => {
          if (previousCards.length >= 10) {
            // End of deck
            return null;
          }
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
      >
        {(card) =>
          card === null ? (
            <View style={styles.card}>
              <Text style={styles.text}>This is the end of the deck, pal.</Text>
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
```

Runnable demo inside the [example Folder](https://github.com/ajenkins/react-native-dynamic-deck-swiper/tree/master/example)

## Stylesheet example

```javascript
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
```

## Development

### Running the example Expo app

1. `cd example/`
1. `npm install`
1. `npm start`

You can change the example code by editing App.js

For specific usage info, see the [Expo CLI docs](https://docs.expo.io/versions/latest/workflow/expo-cli/).

### Updating the Swiper component

1. Make edits to the code in the src/ directory.
1. From the root project directory, above example/, run `npm pack`.
1. In the example/ directory, run `npm install ../react-native-dynamic-deck-swiper-X.Y.Z.tgz`
   where `X.Y.Z` is the current version of the file. This should update package-lock.json.
1. Then run `npm start`.

Don't forget to bump project and example versions in package.json whenever you submit a PR.
