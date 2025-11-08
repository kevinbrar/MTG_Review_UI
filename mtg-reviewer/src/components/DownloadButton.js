import React from 'react';

/**
 * A "dumb" UI component that renders a "Download CSV" button.
 * It receives the completed `reviews` object and the `setCode` as props.
 * When clicked, it formats the reviews into a CSV string and
 * triggers a browser download.
 *
 * @param {object} props - The component props.
 * @param {object} props.reviews - The key-value object of all card grades.
 * @param {string} props.setCode - The set code (e.g., "tla") for the filename.
 */
function DownloadButton({ reviews, setCode }) {

  /**
   * Handles the button click event.
   * Generates a CSV string from the `reviews` prop and initiates a download.
   */
  const handleDownload = () => {
    
    // 1. Generate CSV content from the reviews object.
    // Start with a header row.
    let csvContent = "Card,Grade\n";

    // Loop over the [key, value] pairs of the reviews object
    // (e.g., [ ["Appa", "A"], ["Momo", "B+"] ])
    for (const [cardName, grade] of Object.entries(reviews)) {
      // Add quotes around card names to handle potential commas
      // (e.g., "Aang, at the Crossroads")
      csvContent += `"${cardName}",${grade}\n`;
    }

    // 2. Trigger the browser download.
    // This "invisible link" trick is a standard, safe way to
    // prompt a file download from client-side JavaScript.
    
    // Create a "Blob" (a file-like object in memory)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create an invisible 'a' (link) element
    const link = document.createElement('a');
    
    // Set the link's href to a temporary URL for our in-memory blob
    link.href = URL.createObjectURL(blob);
    
    // Set the 'download' attribute to name the file
    link.setAttribute('download', `${setCode}_review.csv`);
    
    // Append the link, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <hr style={{ margin: '20px 0' }} />
      {/* This button is wired up to our handleDownload function */}
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