import React from 'react';

/**
 * A "dumb" UI component that renders a "Download CSV" button.
 * It receives the completed `reviews` object and the `setCode` as props.
 *
 * @param {object} props - The component props.
 * @param {object} props.reviews - The key-value object of all card grades.
 * @param {string} props.setCode - The set code (e.g., "tla") for the filename.
 */
function DownloadButton({ reviews, setCode }) {

  /**
   * Handles the button click event.
   * Generates a CSV string from the `reviews` prop (including metadata)
   * and initiates a download.
   */
  const handleDownload = () => {
    
    // 1. Generate CSV content from the reviews object.
    // Updated header to include the new metadata fields.
    let csvContent = "Name,Rating,Color,Rarity,Notes\n";

    // Loop over the [cardName, metadataObject] pairs
    for (const [cardName, metadata] of Object.entries(reviews)) {
      // Robustly handle missing data and formatting
      const rating = metadata.grade || '';
      const color = metadata.color || '';
      const rarity = metadata.rarity || '';
      const notes = metadata.notes || ''; // Placeholder for V3 feature
      
      // Add quotes around card names to handle potential commas
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
          backgroundColor: '#007bff', 
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