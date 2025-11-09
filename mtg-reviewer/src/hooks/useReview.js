import { useState, useEffect } from 'react';
// --- NEW: Import all our business logic ---
import {
  createGradedReview,
  createNotedReview,
  findNextUnratedIndex,
  findPreviousUnratedIndex
} from '../utils/reviewUtils.js';

// The key used to save and load reviews from localStorage.
const SET_CODE = 'tla'; 

/**
 * A custom React hook to manage the review state and user progress.
 * This is a "manager" hook that uses reviewUtils.js for all heavy logic.
 *
 * @param {number} totalCards - The total number of cards in the set.
 * @param {array} cards - The complete list of card objects from Scryfall.
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
      
      // Use utility to find the next unrated card, starting from -1 (beginning)
      const resumeIndex = findNextUnratedIndex(-1, totalCards, cards, parsedReviews);
      setCardIndex(resumeIndex);
    }
  }, [totalCards, cards]); // Added 'cards' as dependency

  
  // --- State Update Functions ---

  /**
   * Saves a grade for a card, updates localStorage, and advances to the next card.
   */
  const handleGrade = (cardName, grade) => {
    const currentCard = cards.find(c => c.name === cardName);
    if (!currentCard) return; 

    // Get the new reviews object from our utility function
    const newReviews = createGradedReview(reviews, cardName, grade, currentCard);
    
    setReviews(newReviews);
    localStorage.setItem(`${SET_CODE}_review`, JSON.stringify(newReviews));
    
    if (cardIndex < totalCards) {
      setCardIndex(cardIndex + 1);
    }
  };
  
  /**
   * Saves a note for a card, updating localStorage, but does not advance.
   */
  const handleSaveNote = (cardName, noteText) => {
    const currentCard = cards.find(c => c.name === cardName);
    if (!currentCard) return; // Safety check

    // Get the new reviews object from our utility function
    const newReviews = createNotedReview(reviews, cardName, noteText, currentCard);
    
    setReviews(newReviews);
    localStorage.setItem(`${SET_CODE}_review`, JSON.stringify(newReviews));
  };


  // --- Navigation Functions ---

  const goBack = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const next = () => {
    if (cardIndex < totalCards) {
      setCardIndex(cardIndex + 1);
    }
  };

  const goToNextUnrated = () => {
    // Call the utility function to find the next unrated index
    const nextIndex = findNextUnratedIndex(cardIndex, totalCards, cards, reviews);
    setCardIndex(nextIndex);
  };

  const goToPreviousUnrated = () => {
    // Call the utility function to find the previous unrated index
    const prevIndex = findPreviousUnratedIndex(cardIndex, cards, reviews);
    setCardIndex(prevIndex);
  };


  // --- Public Interface ---
  return { 
    reviews, 
    cardIndex, 
    handleGrade, 
    goBack, 
    next, 
    goToNextUnrated,
    goToPreviousUnrated,
    handleSaveNote
  };
}

export default useReview;