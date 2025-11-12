import React, { useState } from 'react'; // --- Import useState ---
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

  // --- NEW: State for our "Unrated" modal ---
  const [modalMessage, setModalMessage] = useState(null);
  
  // --- Derived State ---
  
  const currentCard = cards[cardIndex];
  const currentGrade = reviews[currentCard?.name]?.grade;
  const currentNote = reviews[currentCard?.name]?.notes;

  // --- TOP-LEVEL RENDER LOGIC (The Manager's Job) ---
  
  let mainContent;

  if (isLoading) {
    mainContent = <LoadingView />;
    
  } else if (!currentCard) {
    // ... (AllDoneView code omitted for brevity) ...
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
            cards={cards} // <-- NEW: Pass all cards
            onShowUnrated={(count) => setModalMessage(`${count} unrated cards remaining.`)} // <-- NEW: Callback to show modal
          />
        </div>
      </div>
    );
  }

  // --- Final Render ---
  
  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto' }}>
      
      {mainContent}
      
      {/* --- NEW: Render the modal if the message is set --- */}
      {modalMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}>
            <h3 style={{ marginTop: 0 }}>Download Started</h3>
            <p>{modalMessage}</p>
            <button 
              onClick={() => setModalMessage(null)}
              style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;