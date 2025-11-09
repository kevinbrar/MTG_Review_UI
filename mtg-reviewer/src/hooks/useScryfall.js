import { useState, useEffect } from 'react';
// --- NEW: Import our sorting utility ---
import { sortCards } from '../utils/cardSorter.js';

// The set code to fetch from Scryfall.
const SET_CODE = 'tla'; 

/**
 * A custom React hook to fetch and cache Scryfall card data for a specific set.
 * This hook handles loading, error, and caching logic internally.
 * On first load, it fetches from the Scryfall API.
 * On all subsequent loads, it returns the cached data from localStorage instantly.
 *
 * @returns {object} An object containing:
 * - `cards` {array}: The *sorted* list of card objects from Scryfall.
 * - `isLoading` {boolean}: True if the data is currently being fetched.
 * - `error` {object|null}: An error object if the fetch failed.
 * - `setCode` {string}: The set code that was fetched (e.g., 'tla').
 */
function useScryfall() {
  // --- Internal State ---
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch and cache card data on mount.
  useEffect(() => {
    
    const fetchAllCardData = async () => {
      // 1. Check localStorage cache first.
      const cachedData = localStorage.getItem(`${SET_CODE}_card_data`);
      
      if (cachedData) {
        // CACHE HIT: Load from localStorage. It's fast.
        setCards(JSON.parse(cachedData));
        setIsLoading(false);
        return; // We're done, exit the function
      }

      // CACHE MISS: Fetch from Scryfall API.
      try {
        let allCards = [];
        let nextUrl = `https://api.scryfall.com/cards/search?q=set:${SET_CODE}`;

        while (nextUrl) {
          const response = await fetch(nextUrl);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          allCards.push(...data.data);
          nextUrl = data.has_more ? data.next_page : null;
        }
        
        // --- Loop is finished, we have all cards ---
        
        // --- NEW: Sort the cards using our utility function ---
        const sortedCards = sortCards(allCards);
        
        setCards(sortedCards); // Save the *sorted* list to React state
        setIsLoading(false); // We're done loading!
        
        // Cache the *sorted* list in localStorage for next time.
        localStorage.setItem(`${SET_CODE}_card_data`, JSON.stringify(sortedCards));

      } catch (error) {
        console.error("Failed to fetch all cards:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchAllCardData();
    
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  // --- Public Interface ---
  return { cards, isLoading, error, setCode: SET_CODE };
}

export default useScryfall;