import { useState, useEffect } from 'react';

// The key used to save and load reviews from localStorage.
const SET_CODE = 'tla'; 

/**
 * A custom React hook to manage the review state and user progress.
 * @param {number} totalCards - The total number of cards in the set.
 * @param {array} cards - The complete list of card objects from Scryfall.
 * @returns {object} An object containing:
 * - `reviews` {object}: The key-value object of all card grades.
 * - `cardIndex` {number}: The index of the card currently being viewed.
 * - `handleGrade` {function}: A function to save a grade and advance to the next card.
 */
function useReview(totalCards, cards) {
  // --- Internal State ---
  const [reviews, setReviews] = useState({});
  const [cardIndex, setCardIndex] = useState(0);

  // --- Logic for Loading/Resuming Session ---
  useEffect(() => {
    const savedReviews = localStorage.getItem(`${SET_CODE}_review`);
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setReviews(parsedReviews);
      
      const lastReviewedCardCount = Object.keys(parsedReviews).length;
      
      // Make sure we don't go past the end of the card list
      if (lastReviewedCardCount < totalCards) {
        setCardIndex(lastReviewedCardCount);
      } else {
        setCardIndex(totalCards); // They're all done
      }
    }
  }, [totalCards]); // Dependency: Re-run if totalCards changes (e.g., from 0 to 286)

  /**
   * Saves a grade for a card, updates localStorage, and advances to the next card.
   * @param {string} cardName - The name of the card being graded.
   * @param {string} grade - The grade (e.g., "A+") being given.
   */
  const handleGrade = (cardName, grade) => {
    // Look up the current card's object using its name
    const currentCard = cards.find(c => c.name === cardName);
    
    // Determine card color (using colors if available, otherwise just use 'color_identity')
    const cardColor = currentCard.color_identity ? currentCard.color_identity.join('') : currentCard.colors.join('');
    const cardRarity = currentCard.rarity;

    // Create a new, immutable review object with new metadata
    const newReviews = {
      ...reviews, // Uses the spread operator (...) to copy old grades
      [cardName]: {
        grade: grade, // <-- Grade is now an object property
        color: cardColor,
        rarity: cardRarity,
        notes: '' // Placeholder for V3 notes feature
      }
    };
    
    setReviews(newReviews);
    localStorage.setItem(`${SET_CODE}_review`, JSON.stringify(newReviews));
    
    // Advance to the next card, if we're not at the end
    if (cardIndex < totalCards) {
      setCardIndex(cardIndex + 1);
    }
  };

  // --- Public Interface ---
  return { reviews, cardIndex, handleGrade };
}

export default useReview;