import React from 'react';
import './App.css';

// --- 1. Import all UI components ---
import CardViewer from './components/CardViewer.js';
import GradeButtons from './components/GradeButtons.js';
import DownloadButton from './components/DownloadButton.js';
import LoadingView from './components/LoadingView.js';
import AllDoneView from './components/AllDoneView.js';
import Navigation from './components/Navigation.js'; 
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
  
  const { 
    reviews, 
    cardIndex, 
    handleGrade, 
    goBack, 
    next, 
    goToNextUnrated,
    goToPreviousUnrated,
    handleSaveNote
  } = useReview(cards.length, cards);
  
  // --- Derived State ---
  
  const currentCard = cards[cardIndex];
  const currentGrade = reviews[currentCard?.name]?.grade;
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
    mainContent = (
      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* --- Left Column (Card) --- */}
        <div style={{ width: '400px', flexShrink: 0 }}>
          <CardViewer 
            card={currentCard} 
          />
        </div>
        
        {/* --- Right Column (Controls) --- */}
        <div style={{ width: '100%' }}>
          <Navigation 
            onGoBack={goBack}
            onNext={next}
            onGoToNextUnrated={goToNextUnrated}
            onGoToPreviousUnrated={goToPreviousUnrated}
            canGoBack={cardIndex > 0}
            canNext={!!currentCard}
            /* currentGrade prop removed */
          />

          <GradeButtons 
            onGrade={handleGrade}
            currentCard={currentCard}
            currentGrade={currentGrade} 
          />
          
          <NotesInput 
            currentNote={currentNote}
            onSaveNote={(noteText) => handleSaveNote(currentCard.name, noteText)}
          />
          
          <DownloadButton
            reviews={reviews}
            setCode={setCode}
          />
        </div>
      </div>
    );
  }

  // --- Final Render ---
  
  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto' }}>
      
      {/* --- <h2> title element has been removed --- */}
      
      {mainContent}
      
    </div>
  );
}

export default App;