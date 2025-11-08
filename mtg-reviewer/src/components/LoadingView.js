import React from 'react';

/**
 * A "dumb" UI component that only displays the loading placeholder.
 * It's used by App.js when the Scryfall data is being fetched.
 */
function LoadingView() {
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

export default LoadingView;