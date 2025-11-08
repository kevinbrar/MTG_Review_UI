import React from 'react';

/**
 * A "dumb" UI component that renders the grid of grade buttons.
 * It receives the current card and a callback function (`onGrade`) as props.
 * When a button is clicked, it calls `onGrade` with the card's name and the selected grade.
 *
 * @param {object} props - The component props.
 * @param {function} props.onGrade - The callback function from `useReview` to save the grade.
 * @param {object} props.currentCard - The card object currently being viewed.
 */
function GradeButtons({ onGrade, currentCard }) {
  // --- V2 Change ---
  // Updated the grades array per your request.
  // We removed 'F' and added 'D+' and 'D-'.
  const grades = [
    'A+', 'A', 'A-', 
    'B+', 'B', 'B-', 
    'C+', 'C', 'C-', 
    'D+', 'D', 'D-'
    // We can also add 'G' back if you want, but this is a clean 12
  ];
  
  // Guard Clause: If there is no card (still loading or end of list), 
  // render nothing (null).
  if (!currentCard) {
    return null;
  }
  
  /**
   * Internal helper function to handle a button click.
   * It "lifts state up" by calling the `onGrade` prop (which is the
   * `handleGrade` function from our `useReview` hook).
   * @param {string} grade - The grade (e.g., "A+") that was clicked.
   */
  const handleButtonClick = (grade) => {
    // Call the function passed down from App.js
    onGrade(currentCard.name, grade);
  };

  return (
    <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
      
      {/* This is the "list comprehension" of React.
        We map over the `grades` array and render a <button> element for each one.
      */}
      {grades.map((grade) => (
        <button 
          key={grade} 
          onClick={() => handleButtonClick(grade)}
        >
          {grade}
        </button>
      ))}
    </div>
  );
}

export default GradeButtons;