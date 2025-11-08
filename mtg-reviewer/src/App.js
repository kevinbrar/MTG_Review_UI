import React from 'react';
import './App.css';

// Import UI components
import CardViewer from './components/CardViewer.js';
import GradeButtons from './components/GradeButtons.js';
import DownloadButton from './components/DownloadButton.js';

// Import logic hooks
import useScryfall from './hooks/useScryfall.js';
import useReview from './hooks/useReview.js';

/**
 * The main application component.
 * Acts as the "manager" that brings all components and hooks together.
 * It fetches data, manages state via custom hooks, and passes
 * data and functions down to the "dumb" UI components as props.
 */
function App() {
  // --- Smart Hooks (The "Brain") ---

  // Get all card data and loading status from our Scryfall hook.
  const { cards, isLoading, setCode } = useScryfall(); 
  
  // Get all review logic from our Review hook.
  // We pass 'cards.length' so the hook knows when the list ends.
  const { reviews, cardIndex, handleGrade } = useReview(cards.length);
  
  // --- Derived State ---
  
  // Helper to get the *exact* card we're currently looking at
  const currentCard = cards[cardIndex];

  // --- Rendered UI ---
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      
      <h2>
        {/* Use setCode in the title, and show a loading fallback */}
        {setCode.toUpperCase()} Set Review ({isLoading ? '...' : cardIndex} / {cards.length})
      </h2>
      
      {/* Pass the current card and loading state to the viewer */}
      <CardViewer 
        card={currentCard} 
        isLoading={isLoading} 
      />
      
      {/* Pass the grading function and current card to the buttons */}
      <GradeButtons 
        onGrade={handleGrade}
        currentCard={currentCard}
      />
      
      {/* Pass the completed reviews and setCode to the download button */}
      <DownloadButton
        reviews={reviews}
        setCode={setCode}
      />
      
    </div>
  );
}

export default App;