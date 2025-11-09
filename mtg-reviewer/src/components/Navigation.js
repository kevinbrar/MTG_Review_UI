import React from 'react';

/**
 * A "dumb" UI component that renders the navigation buttons.
 * It receives all its logic as props from App.js.
 *
 * @param {object} props - The component props.
 * @param {function} props.onGoBack - The function to call when "Previous" is clicked.
 * @param {function} props.onNext - The function to call when "Next" is
... (omitted due to length)
 * @param {function} props.onGoToNextUnrated - The function for "Next Unrated".
 * @param {function} props.onGoToPreviousUnrated - The function for "Previous Unrated".
 * @param {boolean} props.canGoBack - True if the "Previous" button should be enabled.
 * @param {boolean} props.canNext - True if the "Next" button should be enabled.
 */
function Navigation({ 
  onGoBack, 
  onNext, 
  onGoToNextUnrated,
  onGoToPreviousUnrated,
  canGoBack, 
  canNext 
  /* currentGrade prop removed */
}) {
  
  // Style for the new "Unrated" buttons to make them distinct
  const unratedButtonStyle = {
    padding: '8px 10px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    fontSize: '12px'
  };
  
  return (
    <div style={{ margin: '10px 0' }}>
      {/* --- Row 1: Standard Navigation --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button 
          onClick={onGoBack} 
          disabled={!canGoBack}
          style={{ padding: '8px 16px' }}
        >
          &larr; Previous
        </button>

        {/* --- The grade letter <span> has been removed --- */}

        <button 
          onClick={onNext} 
          disabled={!canNext}
          style={{ padding: '8px 16px' }}
        >
          Next &rarr;
        </button>
      </div>
      
      {/* --- Row 2: Unrated Navigation --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onGoToPreviousUnrated}
          style={unratedButtonStyle}
        >
          &larr; Previous Unrated
        </button>
        <button
          onClick={onGoToNextUnrated}
          style={unratedButtonStyle}
        >
          Next Unrated &rarr;
        </button>
      </div>
    </div>
  );
}

export default Navigation;