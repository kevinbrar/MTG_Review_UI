// Define the sort order for rarities.
const rarityOrder = {
  'common': 1,
  'uncommon': 2,
  'rare': 3,
  'mythic': 4,
};

// Define the sort order for WUBRG (White, Blue, Black, Red, Green).
// Multicolor and Colorless will be sorted after.
const colorOrder = {
  'W': 1,
  'U': 2,
  'B': 3,
  'R': 4,
  'G': 5,
};

/**
 * Gets a numeric score for a card's rarity.
 * Lower scores (common) come first.
 * @param {object} card - The Scryfall card object.
 * @returns {number} The rarity score.
 */
function getRarityScore(card) {
  // Use the rarityOrder map, or default to 5 for any other rarity (e.g., "special")
  // to sort them after mythics.
  return rarityOrder[card.rarity] || 5;
}

/**
 * Gets a numeric score for a card's color.
 * Follows WUBRG order, then Multicolor, then Colorless.
 * @param {object} card - The Scryfall card object.
 * @returns {number} The color score.
 */
function getColorScore(card) {
  const colors = card.colors; // 'colors' is for non-DFCs, which is fine here.
  
  if (!colors || colors.length === 0) {
    return 7; // 7. Colorless cards (lands, artifacts)
  }
  
  if (colors.length > 1) {
    return 6; // 6. Multicolor cards
  }
  
  // Use the colorOrder map, or default to 8 (e.g., unknown)
  return colorOrder[colors[0]] || 8;
}

/**
 * Sorts a list of Scryfall card objects by Rarity, then Color (WUBRG), then Mana Cost.
 * @param {array} cards - The unsorted array of card objects.
 * @returns {array} The new, sorted array of card objects.
 */
export function sortCards(cards) {
  // Create a new array using .slice() to avoid mutating the original
  return cards.slice().sort((a, b) => {
    // 1. Compare by Rarity first
    const rarityA = getRarityScore(a);
    const rarityB = getRarityScore(b);
    
    if (rarityA !== rarityB) {
      return rarityA - rarityB;
    }
    
    // 2. If rarity is the same, compare by Color
    const colorA = getColorScore(a);
    const colorB = getColorScore(b);
    
    if (colorA !== colorB) {
      return colorA - colorB;
    }

    // --- NEW: 3. If color is the same, compare by Converted Mana Cost ---
    // We default to 0 for cards with no mana cost (like lands)
    const cmcA = a.cmc || 0;
    const cmcB = b.cmc || 0;

    return cmcA - cmcB;
  });
}