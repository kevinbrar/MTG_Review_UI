import React, { useState, useEffect } from 'react';

/**
 * A "dumb" UI component that renders a textarea for card notes.
 * It manages its own internal text state to avoid re-rendering the whole app
 * on every keystroke.
 *
 * It "debounces" the save function: it waits until the user stops typing
 * for 500ms, then calls the onSaveNote prop.
 *
 * @param {object} props - The component props.
 * @param {string} props.currentNote - The saved note for the current card.
 * @param {function} props.onSaveNote - The callback function from `useReview` to save the note.
 */
function NotesInput({ currentNote, onSaveNote }) {
  // --- Internal State ---
  // This state holds what the user is *currently typing*.
  const [noteText, setNoteText] = useState('');

  // --- Effect to sync internal state ---
  // This effect runs when the card changes (and currentNote prop changes).
  // It updates the textarea with the note loaded from our "brain".
  useEffect(() => {
    // Set our internal text to match the saved note.
    // Use an empty string if the note is null or undefined.
    setNoteText(currentNote || '');
  }, [currentNote]); // Dependency: Only run when the currentNote prop changes.

  // --- NEW: Debounced Autosave Effect ---
  // This effect runs every time the user types (when `noteText` changes).
  useEffect(() => {
    // Don't save if the text is the same as what's already saved.
    // This prevents a save loop when the component first loads.
    if (noteText === (currentNote || '')) {
      return;
    }

    // 1. Set a timer to save the note after 500ms (half a second).
    const saveTimer = setTimeout(() => {
      onSaveNote(noteText);
    }, 500); // 500ms = 0.5 seconds

    // 2. This is the "debounce" magic:
    // If the user types again (triggering this effect again),
    // clear the *previous* timer. This cancels the pending save.
    return () => {
      clearTimeout(saveTimer);
    };
    
  }, [noteText, currentNote, onSaveNote]); // Dependencies

  /**
   * Internal handler for the textarea's onChange event.
   * Updates our *internal* state on every keystroke.
   */
  const handleChange = (e) => {
    setNoteText(e.target.value);
  };

  return (
    <div style={{ marginTop: '15px' }}>
      <textarea
        value={noteText}
        onChange={handleChange}
        placeholder="Enter notes here..."
        style={{
          width: '100%',
          height: '80px',
          boxSizing: 'border-box', // Ensures padding doesn't break layout
          padding: '8px',
          fontSize: '14px',
          fontFamily: 'sans-serif'
        }}
      />
      {/* The "Save Note" button has been removed */}
    </div>
  );
}

export default NotesInput;