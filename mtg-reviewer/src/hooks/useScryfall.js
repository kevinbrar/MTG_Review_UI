import { useState, useEffect } from 'react';

// The set code to fetch from Scryfall.
const SET_CODE = 'tla'; 

/**
 * A custom React hook to fetch and cache Scryfall card data for a specific set.
 * This hook handles loading, error, and caching logic internally.
 * On first load, it fetches from the Scryfall API.
 * On all subsequent loads, it returns the cached data from localStorage instantly.
 *
 * @returns {object} An object containing:
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
    
    // --- V2 Change: We define an 'async' function inside useEffect ---
    // This allows us to use the cleaner 'await' syntax
    // to handle our pagination loop.
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
      // We'll loop until 'has_more' is false.
      try {
        let allCards = [];
        let nextUrl = `https://api.scryfall.com/cards/search?q=set:${SET_CODE}`;

        while (nextUrl) {
          // 'await' is the "wait until done" command.
          // It "pauses" the function here until the network call finishes.
          const response = await fetch(nextUrl);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          // Add the cards from this page to our main list
          // We use the '...' spread operator to "flatten" the list
          allCards.push(...data.data);

          // Check if there's a next page. If so, set the URL for the
          // next loop. If not, set to null, which will end the loop.
          nextUrl = data.has_more ? data.next_page : null;
        }
        
        // --- Loop is finished, we have all cards ---
        
        setCards(allCards); // Save the *full* list to React state
        setIsLoading(false); // We're done loading!
        
        // Cache the *full* list in localStorage for next time.
        localStorage.setItem(`${SET_CODE}_card_data`, JSON.stringify(allCards));

      } catch (error) {
        console.error("Failed to fetch all cards:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    // 2. Call our new async function
    fetchAllCardData();
    
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  // --- Public Interface ---
  // This stays the same! App.js doesn't need to know *how* we got the cards.
  return { cards, isLoading, error, setCode: SET_CODE };
}

export default useScryfall;