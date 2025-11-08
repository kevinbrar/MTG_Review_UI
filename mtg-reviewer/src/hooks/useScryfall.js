import { useState, useEffect } from 'react';

// The set code to fetch from Scryfall.
const SET_CODE = 'tla'; 

/**
 * A custom React hook to fetch and cache Scryfall card data for a specific set.
 * * This hook handles loading, error, and caching logic internally.
 * On first load, it fetches from the Scryfall API.
 * On all subsequent loads, it returns the cached data from localStorage instantly.
 * * @returns {object} An object containing:
 * - `cards` {array}: The list of card objects from Scryfall.
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
    
    // Check localStorage cache first.
    const cachedData = localStorage.getItem(`${SET_CODE}_card_data`);
    
    if (cachedData) {
      // CACHE HIT: Load from localStorage. It's fast.
      setCards(JSON.parse(cachedData));
      setIsLoading(false);
    } else {
      // CACHE MISS: Fetch from Scryfall API.
      const scryfallUrl = `https://api.scryfall.com/cards/search?q=set:${SET_CODE}`;

      fetch(scryfallUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          // Scryfall's card list is in the 'data' property
          const cardData = data.data; 
          
          setCards(cardData); // Save the list of cards to React state
          setIsLoading(false); // We're done loading!
          
          // Cache the new data in localStorage for next time.
          localStorage.setItem(`${SET_CODE}_card_data`, JSON.stringify(cardData));
        })
        .catch(error => {
          console.error("Failed to fetch cards:", error);
          setError(error);
          setIsLoading(false);
        });
    }
    
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  // --- Public Interface ---
  // Return the state variables for components to use.
  return { cards, isLoading, error, setCode: SET_CODE };
}

export default useScryfall;