import React, { useState } from 'react';

/**
 * A "dumb" UI component responsible for rendering a single card image.
 * It assumes it is always given a valid card prop.
 *
 * It *does* manage its own internal "isFlipped" state for DFCs.
 *
 * @param {object} props - The component props.
 * @param {object} props.card - The card object from Scryfall. Assumed to be valid.
 */
function CardViewer({ card }) {
  
  const [isFlipped, setIsFlipped] = useState(false);
  
  const isDfc = card.card_faces && card.card_faces.length > 0;
  
  let imageUrl = "https://placehold.co/265x370?text=Image+Not+Found"; // Default placeholder

  if (isDfc) {
    const faceToShow = isFlipped ? card.card_faces[1] : card.card_faces[0];
    imageUrl = faceToShow.image_uris?.normal;
  } else if (card.image_uris) {
    imageUrl = card.image_uris.normal;
  }
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped); // This toggles our local state
  };
  
  // --- Render the card ---
  return (
    <div>
      <img 
        src={imageUrl} 
        alt={card.name} 
        style={{ 
          width: '100%', 
          borderRadius: '5px',
          
          /* --- NEW CODE --- */
          /* Add a simple, thematic "stone" border */
          border: '4px solid #414244ff', /* A dark stone-gray color */
          boxShadow: '0 4px 12px rgba(201, 189, 189, 0.1)', /* A stronger shadow */
          boxSizing: 'border-box' /* Ensures border is included in width */
          /* --- END NEW CODE --- */
        }} 
      />
      
      {isDfc && (
        <button 
          onClick={handleFlip}
          style={{ width: '100%', marginTop: '10px', padding: '5px' }}
        >
          Flip Card
        </button>
      )}
    </div>
  );
}

export default CardViewer;