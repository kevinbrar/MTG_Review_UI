import React from 'react';

/**
 * A "dumb" UI component that only displays the "All cards reviewed!" message.
 * It's used by App.js when the user has graded every card in the list.
 */
function AllDoneView() {
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

export default AllDoneView;