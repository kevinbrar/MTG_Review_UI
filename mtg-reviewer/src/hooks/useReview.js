import { useState, useEffect } from 'react';

// The key used to save and load reviews from localStorage.
const SET_CODE = 'tla'; 

/**
 * A custom React hook to manage the review state and user progress.
 * This hook handles creating, updating, and saving reviews to localStorage.
 * It also intelligently resumes the user's session by setting the cardIndex
 * to the first un-reviewed card.
 *
 * @param {number} totalCards - The total number of cards in the set.
 * @returns {object} An object containing:
 * - `reviews` {object}: The key-value object of all card grades (e.g., {"Card Name": "A"}).
 * - `cardIndex` {number}: The index of the card currently being viewed.
 * - `handleGrade` {function}: A function to save a grade and advance to the next card.
 */
function useReview(totalCards) {
  // --- Internal State ---
  
  // 'reviews' holds the review object, e.g., { "Appa": "A", "Momo": "B+" }
  const [reviews, setReviews] = useState({});
  // 'cardIndex' holds the index of the card we're currently looking at
  const [cardIndex, setCardIndex] = useState(0);

  // --- Logic ---

  // Effect to load saved reviews from localStorage on initial load
  // or when the total number of cards is finally determined.
  useEffect(() => {
    const savedReviews = localStorage.getItem(`${SET_CODE}_review`);
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setReviews(parsedReviews);
      
      // Resume user session: Start the user where they left off.
      const lastReviewedCardCount = Object.keys(parsedReviews).length;
      
      // Make sure we don't go past the end of the card list
      if (lastReviewedCardCount < totalCards) {
        setCardIndex(lastReviewedCardCount);
      } else {
        setCardIndex(totalCards); // They're all done
      }
    }
  }, [totalCards]); // Dependency: Re-run if totalCards changes (e.g., from 0 to 175)

  /**
   * Saves a grade for a card, updates localStorage, and advances to the next card.
   * This is the "C" (Create) and "U" (Update) in our CRUD logic.
   * @param {string} cardName - The name of the card being graded.
   * @param {string} grade - The grade (e.g., "A+") being given.
   */
  const handleGrade = (cardName, grade) => {
    // Create a new, immutable review object
    const newReviews = {
      ...reviews, // Uses the spread operator (...) to copy old grades
      [cardName]: grade
    };
    
    // Update our React state (RAM)
    setReviews(newReviews);
    
    // Save the new state to localStorage (Hard Drive)
    localStorage.setItem(`${SET_CODE}_review`, JSON.stringify(newReviews));
    
    // Advance to the next card, if we're not at the end
    if (cardIndex < totalCards) {
      setCardIndex(cardIndex + 1);
    }
  };

  // --- Public Interface ---
  // Return the state and functions for App.js to use.
  return { reviews, cardIndex, handleGrade };
}

export default useReview;