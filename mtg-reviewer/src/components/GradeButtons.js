import React from 'react';
import GradeRow from './GradeRow.js'; // Import our new component
import styles from './GradeButtons.module.css'; // Import its new stylesheet

/**
 * A "dumb" UI component that renders the *entire* grid of grade buttons.
 * It acts as a "manager" that renders <GradeRow /> components.
 *
 * @param {object} props - The component props.
 * @param {function} props.onGrade - The callback function from `useReview`.
 * @param {object} props.currentCard - The card object currently being viewed.
 * @param {string} props.currentGrade - The currently selected grade (e.g., "A+").
 */
function GradeButtons({ onGrade, currentCard, currentGrade }) {
  
  // Guard Clause: If there is no card (still loading or end of list), 
  // render nothing (null).
  if (!currentCard) {
    return null;
  }

  /**
   * Internal helper to build the CSS class list for the "G" button.
   * @returns {string} The final CSS class string.
   */
  const getGButtonStyle = () => {
    let classes = [styles.goodArtButton];
    if (currentGrade === 'G') {
      classes.push(styles.selected);
    }
    return classes.join(' ');
  };

  return (
    <div className={styles.gradeButtonContainer}>
      {/* --- A, B, C, D Rows --- */}
      <GradeRow 
        baseGrade="A"
        currentGrade={currentGrade}
        onGrade={onGrade}
        currentCard={currentCard}
      />
      <GradeRow 
        baseGrade="B"
        currentGrade={currentGrade}
        onGrade={onGrade}
        currentCard={currentCard}
      />
      <GradeRow 
        baseGrade="C"
        currentGrade={currentGrade}
        onGrade={onGrade}
        currentCard={currentCard}
      />
      <GradeRow 
        baseGrade="D"
        currentGrade={currentGrade}
        onGrade={onGrade}
        currentCard={currentCard}
      />
      
      {/* --- "G" (Good Art) Button --- */}
      <button 
        className={getGButtonStyle()}
        onClick={() => onGrade(currentCard.name, 'G')}
      >
        Good Art
      </button>
    </div>
  );
}

export default GradeButtons;