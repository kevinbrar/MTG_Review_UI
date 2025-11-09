import React from 'react';
import styles from './GradeRow.module.css';

/**
 * A "dumb" UI component that renders a single row of 3 grade buttons
 * (e.g., "A+", "A", "A-").
 *
 * @param {object} props - The component props.
 * @param {string} props.baseGrade - The letter for this row (e.g., "A", "B").
 * @param {string} props.currentGrade - The currently selected grade for this card.
 * @param {function} props.onGrade - The callback function from `useReview`.
 * @param {object} props.currentCard - The current card object.
 */
function GradeRow({ baseGrade, currentGrade, onGrade, currentCard }) {

  /**
   * Internal helper to build the CSS class list for a button.
   * @param {string} grade - The grade this button represents (e.g., "A+").
   * @returns {string} The final CSS class string.
   */
  const getButtonClass = (grade) => {
    // Start with the base button style
    let classes = [styles.gradeButton];
    
    // Add the 'selected' class if this button is the active one
    if (currentGrade === grade) {
      classes.push(styles.selected);
    }
    
    return classes.join(' '); // e.g., "gradeButton selected"
  };

  return (
    <div className={styles.gradeRow}>
      {/* --- Plus Button --- */}
      <button 
        className={getButtonClass(`${baseGrade}+`)}
        onClick={() => onGrade(currentCard.name, `${baseGrade}+`)}
      >
        +
      </button>
      
      {/* --- Neutral Button (Letter) --- */}
      <button 
        className={getButtonClass(baseGrade)}
        onClick={() => onGrade(currentCard.name, baseGrade)}
      >
        {baseGrade}
      </button>
      
      {/* --- Minus Button --- */}
      <button 
        className={getButtonClass(`${baseGrade}-`)}
        onClick={() => onGrade(currentCard.name, `${baseGrade}-`)}
      >
        -
      </button>
    </div>
  );
}

export default GradeRow;