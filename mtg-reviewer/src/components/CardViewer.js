import React from 'react';

/**
 * A "dumb" UI component responsible for rendering a single card image.
 * It handles its own loading, "end of list," and "image not found" states
 * based on the props it receives.
 *
 * @param {object} props - The component props.
 * @param {object} props.card - The card object from Scryfall. Can be undefined.
 * @param {boolean} props.isLoading - True if the card list is still loading.
 */
function CardViewer({ card, isLoading }) {
  
  // 1. Handle the initial loading state (from useScryfall)
  if (isLoading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '370px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        border: '1px solid #ccc',
        borderRadius: '15px'
      }}>
        <p>Loading cards...</p>
      </div>
    );
  }
  
  // 2. Handle the "end of list" state (from useReview)
  // This triggers when isLoading is false but there's no currentCard.
  if (!card) {
    return (
      <div style={{ 
        width: '100%', 
        height: '370px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        border: '1px solid #ccc',
        borderRadius: '15px'
      }}>
        <p>All cards reviewed!</p>
      </div>
    );
  }
  
  // --- Robust Image URL Finding ---
  // This logic safely finds the correct image, even for double-sided cards.
  
  let imageUrl = card.image_uris?.normal;
  
  // Fallback for dual-faced cards (which you noted in your `poej_checkpoint_1.pdf`)
  if (!imageUrl && card.card_faces && card.card_faces[0]) {
    imageUrl = card.card_faces[0].image_uris?.normal;
  }
  
  // Final fallback for any other missing images (e.g., Art Cards)
  if (!imageUrl) {
    imageUrl = "https://placehold.co/265x370?text=Image+Not+Found";
  }
  // --- End of Image Logic ---

  // 3. The "Happy Path": Render the card image
  return (
    <div>
      <img 
        src={imageUrl} 
        alt={card.name} 
        style={{ width: '100%', borderRadius: '15px' }} 
      />
    </div>
  );
}

export default CardViewer;