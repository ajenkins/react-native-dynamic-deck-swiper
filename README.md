## react-native-dynamic-deck-swiper

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

TODO

## Props

### Card props

| Props                 | type                                      | description                                                        | required | default |
| :-------------------- | :---------------------------------------- | :----------------------------------------------------------------- | :------- | :------ |
| getNextCardData       | func({first, left, right, previousCards}) | return value is passed to renderCard as cardData for the next card | required |
| renderCard            | func(cardData)                            | function to render the card based on the data                      | required |
| preventVerticalDragging | bool                                      | enable/disable horizontal swiping                                  |          | true    |

### Event callbacks

| Props           | type | description                                                                          | default |
| :-------------- | :--- | :----------------------------------------------------------------------------------- | :------ |
| onSwipedAll     | func | function to be called when all cards have been swiped                                |         | () => {} |
| onSwiped        | func | function to be called when a card is swiped. it receives the swiped card index       |         | (cardIndex) => {} |
| onSwipedAborted | func | function to be called when a card is released before reaching the threshold          |         | () => {} |
| onSwipedLeft    | func | function to be called when a card is swiped left. it receives the swiped card index  |         | (cardIndex) => {} |
| onSwipedRight   | func | function to be called when a card is swiped right. it receives the swiped card index |         | (cardIndex) => {} |
| onSwiping       | func | function to be called when a card is being moved. it receives X and Y positions      |         | (x, y) => {} |
| dragStart       | func | function to be called when drag start                                                |         |
| dragEnd         | func | function to be called when drag end                                                  |
| onTapCard       | func | function to be called when tapping a card. it receives the tapped card index         |         | (cardIndex) => {} |

### Swipe animation props

| Props                  | type   | description                     | default    |
| :--------------------- | :----- | :------------------------------ | :--------- |
| verticalThreshold      | number | vertical swipe threshold        | height / 5 |
| horizontalThreshold    | number | horizontal swipe threshold      | width / 4  |
| swipeAnimationDuration | number | duration of the swipe animation | 350        |
| disableLeftSwipe       | bool   | disable left swipe              | false      |
| disableRightSwipe      | bool   | disable right swipe             | false      |

### Stack props

| Props                  | type   | description                                            | default |
| :--------------------- | :----- | :----------------------------------------------------- | :------ |
| stackSeparation        | number | vertical separation between underlaying cards          | 10      |
| stackScale             | number | percentage to reduce the size of each underlaying card | 3       |
| stackAnimationFriction | number | spring animation friction (bounciness)                 | 7       |
| stackAnimationTension  | number | spring animation tension (speed)                       | 40      |

### Rotation animation props

| Props               | type  | description                                            | default                     |
| :------------------ | :---- | :----------------------------------------------------- | :-------------------------- |
| inputRotationRange  | array | x values range for the rotation output                 | [-width / 2, 0, width / 2]  |
| outputRotationRange | array | rotation values for the x values in inputRotationRange | ["-10deg", "0deg", "10deg"] |

### Opacity animation props

| Props                             | type   | description                                                      | default                                               |
| :-------------------------------- | :----- | :--------------------------------------------------------------- | :---------------------------------------------------- |
| animateCardOpacity                | bool   | animate card opacity                                             | false                                                 |
| inputCardOpacityRangeX            | array  | pan x card opacity input range                                   | [-width / 2, -width / 3, 0, width / 3, width / 2]     |
| outputCardOpacityRangeX           | array  | opacity values for the values in inputCardOpacityRangeX          | [0.8, 1, 1, 1, 0.8]                                   |
| inputCardOpacityRangeY            | array  | pan y card opacity input range                                   | [-height / 2, -height / 3, 0, height / 3, height / 2] |
| outputCardOpacityRangeY           | array  | opacity values for the values in inputCardOpacityRangeY          | [0.8, 1, 1, 1, 0.8]                                   |
| animateOverlayLabelsOpacity       | bool   | animate card overlay labels opacity                              | false                                                 |
| inputOverlayLabelsOpacityRangeX   | array  | pan x overlay labels opacity input range                         | [-width / 3, -width / 4, 0, width / 4, width / 3]     |
| outputOverlayLabelsOpacityRangeX  | array  | opacity values for the values in inputOverlayLabelsOpacityRangeX | [1, 0, 0, 0, 1]                                       |
| inputOverlayLabelsOpacityRangeY   | array  | pan x overlay labels opacity input range                         | [-height / 4, -height / 5, 0, height / 5, height / 4] |
| outputOverlayLabelsOpacityRangeY  | array  | opacity values for the values in inputOverlayLabelsOpacityRangeY | [1, 0, 0, 0, 1]                                       |
| overlayOpacityVerticalThreshold   | number | vertical threshold for overlay label                             | height / 5                                            |
| overlayOpacityHorizontalThreshold | number | horizontal threshold for overlay label                           | width / 4                                             |

2 steps of inputOverlayLabelsOpacityRangeX and inputOverlayLabelsOpacityRangeY should match horizontalThreshold and verticalThreshold, respectively.

### Swipe overlay labels

| Props                    | type   | description                  | default                    |
| :----------------------- | :----- | :--------------------------- | :------------------------- |
| overlayLabels            | object | swipe labels title and style | null, see below for format |
| overlayLabelStyle        | object | swipe labels style           | null, see below for format |
| overlayLabelWrapperStyle | object | overlay label wrapper style  | see below for default      |

### overlayLabelStyle

```javascript
{
  fontSize: 45,
  fontWeight: 'bold',
  borderRadius: 10,
  padding: 10,
  overflow: 'hidden'
}
```

### overlayLabelWrapperStyle default props:

```javascript
{
  position: 'absolute',
  backgroundColor: 'transparent',
  zIndex: 2,
  flex: 1,
  width: '100%',
  height: '100%'
}
```

### overlayLabels default props :

```javascript
{
  bottom: {
	element: <Text>BLEAH</Text> /* Optional */
	title: 'BLEAH',
    style: {
      label: {
        backgroundColor: 'black',
        borderColor: 'black',
        color: 'white',
        borderWidth: 1
      },
      wrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  },
  left: {
	element: <Text>NOPE</Text> /* Optional */
	title: 'NOPE',
    style: {
      label: {
        backgroundColor: 'black',
        borderColor: 'black',
        color: 'white',
        borderWidth: 1
      },
      wrapper: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: -30
      }
    }
  },
  right: {
	element: <Text>LIKE</Text> /* Optional */
	title: 'LIKE',
    style: {
      label: {
        backgroundColor: 'black',
        borderColor: 'black',
        color: 'white',
        borderWidth: 1
      },
      wrapper: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 30,
        marginLeft: 30
      }
    }
  },
  top: {
	element: <Text>SUPER</Text> /* Optional */
	title: 'SUPER LIKE',
    style: {
      label: {
        backgroundColor: 'black',
        borderColor: 'black',
        color: 'white',
        borderWidth: 1
      },
      wrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  }
}
```

### Swipe back to previous card props

Make sure you set showSecondCard={false} for smoother and proper transitions while going back to previous card.

| Props                             | type | description                               | default |
| :-------------------------------- | :--- | :---------------------------------------- | :------ |
| goBackToPreviousCardOnSwipeLeft   | bool | previous card is rendered on left swipe   | false   |
| goBackToPreviousCardOnSwipeRight  | bool | previous card is rendered on right swipe  | false   |
| goBackToPreviousCardOnSwipeTop    | bool | previous card is rendered on top swipe    | false   |
| goBackToPreviousCardOnSwipeBottom | bool | previous card is rendered on bottom swipe | false   |

### Style props

| Props                | type   | description                                               | default   |
| :------------------- | :----- | :-------------------------------------------------------- | :-------- |
| backgroundColor      | string | background color for the view containing the cards        | '#4FD0E9' |
| marginTop            | number | marginTop for the swiper container                        | 0         |
| marginBottom         | number | marginBottom for the swiper container                     | 0         |
| cardVerticalMargin   | number | card vertical margin                                      | 60        |
| cardHorizontalMargin | number | card horizontal margin                                    | 20        |
| childrenOnTop        | bool   | render children on top or not                             | false     |
| cardStyle            | node   | override swipable card style                              | {}        |
| containerStyle       | node   | overrides for the containing <View> style                 | {}        |
| pointerEvents        | string | pointerEvents prop for the containing <View>              | 'auto'    |
| useViewOverflow      | bool   | use ViewOverflow instead of View for the Swiper component | true      |

### Swipe back method info

## Method

| Name      | type     | description                           |
| :-------- | :------- | :------------------------------------ |
| swipeBack | callback | swipe back into deck last swiped card |

## Props

| Props                        | type   | description                                                 | default |
| :--------------------------- | :----- | :---------------------------------------------------------- | :------ |
| previousCardDefaultPositionX | number | Animation start position oX when card swipes back into deck | -width  |
| previousCardDefaultPositionY | number | Animation start position oY when card swipes back into deck | -height |
| stackAnimationFriction       | number | spring animation friction (bounciness)                      | 7       |
| stackAnimationTension        | number | spring animation tension (speed)                            | 40      |
| stackAnimationTension        | number | spring animation tension (speed)                            | 40      |
| swipeBackCard                | bool   | renders swipe back card, in order to animate it             | false   |

### Methods

To trigger imperative animations, you can use a reference to the Swiper component.

| Name            | arguments                      | description                   |
| :-------------- | :----------------------------- | :---------------------------- |
| swipeLeft       | mustDecrementCardIndex = false | swipe left to the next card   |
| swipeRight      | mustDecrementCardIndex = false | swipe right to the next card  |
| swipeTop        | mustDecrementCardIndex = false | swipe top to the next card    |
| swipeBottom     | mustDecrementCardIndex = false | swipe bottom to the next card |
| jumpToCardIndex | cardIndex                      | set the current card index    |

## Usage example

```javascript
import Swiper from 'react-native-dynamic-deck-swiper';

function MyDynamicSwiper() {
  return (
    <View style={styles.container}>
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
        renderCard={(cardData) => (
          <View style={styles.card}>
            <Text style={styles.text}>{cardData}</Text>
          </View>
        )}
      />
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
