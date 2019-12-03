export const calculateCardIndexes = (firstCardIndex, cards) => {
  firstCardIndex = firstCardIndex || 0;
  const previousCardIndex =
    firstCardIndex === 0 ? cards.length - 1 : firstCardIndex - 1;
  const secondCardIndex =
    firstCardIndex === cards.length - 1 ? 0 : firstCardIndex + 1;
  return { firstCardIndex, secondCardIndex, previousCardIndex };
};
