import React from 'react';

/**
 * A "dumb" UI component that renders a "Download CSV" button.
 * It receives the completed `reviews` object and the `setCode` as props.
 *
 * @param {object} props - The component props.
 * @param {object} props.reviews - The key-value object of all card grades.
 * @param {string} props.setCode - The set code (e.g., "tla") for the filename.
 * @param {array} props.cards - The full list of card objects.
 * @param {function} props.onShowUnrated - Callback to show the unrated modal.
 */
function DownloadButton({ reviews, setCode, cards, onShowUnrated }) {

  const handleDownload = () => {
    
    // --- NEW: Calculate unrated cards ---
    // We only count reviews that have a 'grade' assigned
    const ratedCount = Object.values(reviews).filter(review => review.grade).length;
    const unrated = cards.length - ratedCount;
    // Call the callback to show the modal in App.js
    onShowUnrated(unrated);
    // --- End of new code ---

    // 1. Generate CSV content from the reviews object.
    let csvContent = "Name,Rating,Color,Rarity,Notes\n";

    for (const [cardName, metadata] of Object.entries(reviews)) {
      const rating = metadata.grade || '';
      const color = metadata.color || '';
      const rarity = metadata.rarity || '';
      const notes = metadata.notes || ''; 
      
      csvContent += `"${cardName}",${rating},${color},${rarity},"${notes}"\n`;
    }

    // 2. Trigger the browser download.
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${setCode}_review.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <hr style={{ margin: '20px 0' }} />
      <button 
        onClick={handleDownload}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#28a745', /* --- NEW: Changed to Green --- */
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          fontSize: '16px' 
        }}
      >
        Download Review CSV
      </button>
    </div>
  );
}

export default DownloadButton;