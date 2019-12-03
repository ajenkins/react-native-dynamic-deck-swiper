import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    position: 'absolute'
  },
  container: {
    alignItems: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  childrenViewStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  overlayLabelWrapper: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 2,
    flex: 1,
    width: '100%',
    height: '100%'
  },
  hideOverlayLabel: {
    opacity: 0
  },
  overlayLabel: {
    fontSize: 45,
    fontWeight: 'bold',
    borderRadius: 10,
    padding: 10,
    overflow: 'hidden'
  },
  bottomOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: 30
  },
  leftOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: -30
  }
});

export const getCardStyle = ({
  cardVerticalMargin,
  cardHorizontalMargin,
  marginTop,
  marginBottom
}) => {
  const { height, width } = Dimensions.get('window');

  const cardWidth = width - cardHorizontalMargin * 2;
  const cardHeight = height - cardVerticalMargin * 2 - marginTop - marginBottom;

  return {
    top: cardVerticalMargin,
    left: cardHorizontalMargin,
    width: cardWidth,
    height: cardHeight
  };
};

export default styles;
