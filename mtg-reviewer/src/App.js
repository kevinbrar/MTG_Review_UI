import React from 'react';
import './App.css';

// --- 1. Import all UI components ---
import CardViewer from './components/CardViewer.js';
import GradeButtons from './components/GradeButtons.js';
import DownloadButton from './components/DownloadButton.js';

// --- V2 Refactor: New Placeholder Components ---
import LoadingView from './components/LoadingView.js';
import AllDoneView from './components/AllDoneView.js'; // This is needed to complete the UI logic

// --- 2. Import all logic hooks ---
import useScryfall from './hooks/useScryfall.js';
import useReview from './hooks/useReview.js';

/**
 * The main application component.
 * Acts as the "manager" that brings all components and hooks together.
 * It implements the top-level logic (Loading, All Done) to decide 
 * which view to render.
 */
function App() {
  // --- Smart Hooks (The "Brain") ---

  // Get all card data and loading status from our Scryfall hook.
  const { cards, isLoading, setCode } = useScryfall(); 
  
  // Get all review logic from our Review hook.
  const { reviews, cardIndex, handleGrade } = useReview(cards.length);
  
  // --- Derived State ---
  
  // Helper to get the *exact* card we're currently looking at
  const currentCard = cards[cardIndex];

  // --- TOP-LEVEL RENDER LOGIC (The Manager's Job) ---
  
  let mainContent;

  if (isLoading) {
    // 1. If we are loading data, show the loading placeholder.
    mainContent = <LoadingView />;
    
  } else if (!currentCard) {
    // 2. If we are NOT loading, but there's no currentCard (end of list), 
    //    show the "All Done" view.
    mainContent = <AllDoneView />;
    
  } else {
    // 3. The Happy Path: Render the card and buttons.
    mainContent = (
      <>
        {/* Pass card data to the viewer */}
        <CardViewer 
          card={currentCard} 
        />
        
        {/* Pass the grading function and current card to the buttons */}
        <GradeButtons 
          onGrade={handleGrade}
          currentCard={currentCard}
        />
      </>
    );
  }

  // --- Final Render ---
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      
      <h2>
        {/* Use setCode in the title, and show a loading fallback */}
        {setCode.toUpperCase()} Set Review ({isLoading ? '...' : cardIndex} / {cards.length})
      </h2>
      
      {mainContent}

      {/* The Download button always appears, regardless of the main content */}
      {/* We pass it the completed reviews and setCode */}
      <DownloadButton
        reviews={reviews}
        setCode={setCode}
      />
      
    </div>
  );
}

export default App;