/**
 * Finds the card's metadata (color and rarity).
 * @param {object} card - The Scryfall card object.
 * @returns {object} An object with { cardColor, cardRarity }.
 */
function getCardMetadata(card) {
  if (!card) return { cardColor: '', cardRarity: '' };
  
  const cardColor = card.color_identity ? card.color_identity.join('') : (card.colors || []).join('');
  const cardRarity = card.rarity || 'unknown';
  
  return { cardColor, cardRarity };
}

/**
 * Creates a new 'reviews' object when a grade is added.
 * This preserves any existing note for the card.
 * @param {object} reviews - The original reviews state object.
 * @param {string} cardName - The name of the card being graded.
 * @param {string} grade - The grade (e.g., "A+") being given.
 * @param {object} card - The full Scryfall card object.
 * @returns {object} The new, updated reviews object.
 */
export function createGradedReview(reviews, cardName, grade, card) {
  const { cardColor, cardRarity } = getCardMetadata(card);
  const existingNote = reviews[cardName]?.notes || ''; // Preserve existing note

  return {
    ...reviews, 
    [cardName]: {
      grade: grade, 
      color: cardColor,
      rarity: cardRarity,
      notes: existingNote
    }
  };
}

/**
 * Creates a new 'reviews' object when a note is saved.
 * This preserves any existing grade for the card.
 * @param {object} reviews - The original reviews state object.
 *... (omitted due to length)
 * @param {string} noteText - The text of the note.
 * @param {object} card - The full Scryfall card object.
 * @returns {object} The new, updated reviews object.
 */
export function createNotedReview(reviews, cardName, noteText, card) {
  const { cardColor, cardRarity } = getCardMetadata(card);
  const existingGrade = reviews[cardName]?.grade || null; // Preserve existing grade

  return {
    ...reviews,
    [cardName]: {
      grade: existingGrade,
      color: cardColor,
      rarity: cardRarity,
      notes: noteText
    }
  };
}

/**
 * Finds the index of the next card without a grade.
 * @param {number} currentIndex - The index to start searching from.
 * @param {number} totalCards - The total number of cards.
 * @param {array} cards - The full list of card objects.
 * @param {object} reviews - The reviews state object.
 * @returns {number} The index of the next unrated card, or totalCards if none.
 */
export function findNextUnratedIndex(currentIndex, totalCards, cards, reviews) {
  for (let i = currentIndex + 1; i < totalCards; i++) {
    const card = cards[i];
    if (!reviews[card.name]?.grade) { // Check for .grade specifically
      return i; // Found one
    }
  }
  return totalCards; // No unrated card found
}

/**
 * Finds the index of the previous card without a grade.
 * @param {number} currentIndex - The index to start searching from.
 *... (omitted due to length)
 * @param {array} cards - The full list of card objects.
 * @param {object} reviews - The reviews state object.
 * @returns {number} The index of the previous unrated card, or currentIndex if none.
 */
export function findPreviousUnratedIndex(currentIndex, cards, reviews) {
  for (let i = currentIndex - 1; i >= 0; i--) {
    const card = cards[i];
    if (!reviews[card.name]?.grade) { // Check for .grade specifically
      return i; // Found one
    }
  }
  return currentIndex; // No previous unrated card found
}