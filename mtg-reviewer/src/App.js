import React from 'react';
import './App.css';

// --- 1. Import all UI components ---
import CardViewer from './components/CardViewer.js';
import GradeButtons from './components/GradeButtons.js';
import DownloadButton from './components/DownloadButton.js';
import LoadingView from './components/LoadingView.js';
import AllDoneView from './components/AllDoneView.js';
import Navigation from './components/Navigation.js'; 
// --- NEW: Import our new component ---
import NotesInput from './components/NotesInput.js';

// --- 2. Import all logic hooks ---
import useScryfall from './hooks/useScryfall.js';
import useReview from './hooks/useReview.js';

/**
 * The main application component.
 * Acts as the "manager" that connects all components and hooks.
 */
function App() {
  // --- Smart Hooks (The "Brain") ---

  const { cards, isLoading, setCode } = useScryfall(); 
  
  // --- NEW: Get the handleSaveNote function from our hook ---
  const { 
    reviews, 
    cardIndex, 
    handleGrade, 
    goBack, 
    next, 
    goToNextUnrated,
    goToPreviousUnrated,
    handleSaveNote // <-- This function is new
  } = useReview(cards.length, cards);
  
  // --- Derived State ---
  
  const currentCard = cards[cardIndex];

  // This line finds the grade for the current card.
  const currentGrade = reviews[currentCard?.name]?.grade;
  // --- NEW: Find the note for the current card ---
  const currentNote = reviews[currentCard?.name]?.notes;

  // --- TOP-LEVEL RENDER LOGIC (The Manager's Job) ---
  
  let mainContent;

  if (isLoading) {
    mainContent = <LoadingView />;
    
  } else if (!currentCard) {
    mainContent = (
      <>
        <AllDoneView />
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={goBack} 
            disabled={cardIndex === 0}
            style={{ width: '100%', padding: '8px' }}
          >
            &larr; Go Back
          </button>
        </div>
      </>
    );
    
  } else {
    // 3. The Happy Path: Render all our components
    mainContent = (
      <>
        <CardViewer 
          card={currentCard} 
        />
        
        <Navigation 
          onGoBack={goBack}
          onNext={next}
          onGoToNextUnrated={goToNextUnrated}
          onGoToPreviousUnrated={goToPreviousUnrated}
          canGoBack={cardIndex > 0}
          canNext={!!currentCard}
          currentGrade={currentGrade}
        />

        <GradeButtons 
          onGrade={handleGrade}
          currentCard={currentCard}
          currentGrade={currentGrade} 
        />
        
        {/* --- NEW: Add the NotesInput component --- */}
        <NotesInput 
          currentNote={currentNote}
          // We must pass the card name so the hook knows which card to save
          onSaveNote={(noteText) => handleSaveNote(currentCard.name, noteText)}
        />
      </>
    );
  }

  // --- Final Render ---
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      
      <h2>
        {setCode.toUpperCase()} Set Review ({isLoading ? '...' : cardIndex} / {cards.length})
      </h2>
      
      {mainContent}

      <DownloadButton
        reviews={reviews}
        setCode={setCode}
      />
      
    </div>
  );
}

export default App;