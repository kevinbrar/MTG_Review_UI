import React, { useState, useEffect } from 'react';

/**
 * A "dumb" UI component that renders a textarea for card notes.
 * It "debounces" the save function: it waits until the user stops typing
 * for 500ms, then calls the onSaveNote prop.
 *
 * @param {object} props - The component props.
 * @param {string} props.currentNote - The saved note for the current card.
 * @param {function} props.onSaveNote - The callback function from `useReview` to save the note.
 */
function NotesInput({ currentNote, onSaveNote }) {
  // --- Internal State ---
  const [noteText, setNoteText] = useState('');

  // --- Effect to sync internal state ---
  useEffect(() => {
    setNoteText(currentNote || '');
  }, [currentNote]); // Dependency: Only run when the currentNote prop changes.

  // --- Debounced Autosave Effect ---
  useEffect(() => {
    // Don't save if the text is the same as what's already saved.
    if (noteText === (currentNote || '')) {
      return;
    }

    // 1. Set a timer to save the note after 500ms (half a second).
    const saveTimer = setTimeout(() => {
      onSaveNote(noteText);
    }, 500); // 500ms = 0.5 seconds

    // 2. Clear the *previous* timer on each new keystroke.
    return () => {
      clearTimeout(saveTimer);
    };
    
  }, [noteText, currentNote, onSaveNote]); // <-- UPDATED: Added dependencies to fix warning

  /**
   * Internal handler for the textarea's onChange event.
   */
  const handleChange = (e) => {
    setNoteText(e.target.value);
  };

  return (
    <div style={{ marginTop: '15px' }}>
      <textarea
        value={noteText}
        onChange={handleChange}
        placeholder="Enter notes here... (autosaves)"
        style={{
          width: '100%',
          height: '80px',
          boxSizing: 'border-box',
          padding: '8px',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ccc' 
        }}
      />
      {/* The "Save Note" button has been removed */}
    </div>
  );
}

export default NotesInput;