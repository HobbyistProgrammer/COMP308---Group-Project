import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [selectedGame, setSelectedGame] = useState('Game 1');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  // Define game exercises for each game
  let gameExercises = [];
  if (selectedGame === 'Game 1') {
    gameExercises = [
      'Push-ups',
      'Squats',
      'Jumping Jacks',
      'Plank',
      'Lunges',
      'Burpees',
      'High Knees',
      'Mountain Climbers',
    ];
  } else if (selectedGame === 'Game 2') {
    gameExercises = [
      'Bicep Curls',
      'Tricep Dips',
      'Shoulder Press',
      'Russian Twists',
      'Leg Raises',
      'Supermans',
      'Flutter Kicks',
      'Side Plank',
    ];
  }

  // Function to initialize cards
  const initializeCards = () => {
    const newCards = gameExercises
      .concat(gameExercises) // Create pairs
      .map((exercise, index) => ({
        id: index,
        exercise: exercise,
        flipped: false,
        matched: false,
      }));
    setCards(shuffle(newCards));
  };

  // Function to shuffle array
  const shuffle = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Handle card click
  const handleCardClick = index => {
    const selectedCard = cards[index];

  // Ignore clicks on already matched cards or if two cards are already flipped
  if (selectedCard.matched || flippedCards.length === 2) return;

  // Flip the selected card
  const newCards = cards.map((card, i) => i === index ? { ...card, flipped: true } : card);
  setCards(newCards);

  // Add the selected card to the flipped cards
  const newFlippedCards = [...flippedCards, selectedCard];

  // If two cards are flipped, check for a match
  if (newFlippedCards.length === 2) {
    // Check for match
    if (newFlippedCards[0].exercise === newFlippedCards[1].exercise) {
      // If matched, update matched cards and reset flipped cards
      const newMatchedCards = [...matchedCards, newFlippedCards[0], newFlippedCards[1]];
      setMatchedCards(newMatchedCards);
    } else {
      // If not matched, flip the cards back after a delay
      setTimeout(() => {
        const resetCards = cards.map(card =>
          newFlippedCards.some(flippedCard => flippedCard.id === card.id)
            ? { ...card, flipped: false }
            : card
        );
        setCards(resetCards);
      }, 1000);
    }
    // Reset flipped cards after checking for match
    setFlippedCards([]);
  } else {
    // If only one card is flipped, update flipped cards state
    setFlippedCards(newFlippedCards);
  }
  };

  // Check if flipped cards match
  const checkForMatch = () => {
    if (flippedCards.length === 2) {
      if (flippedCards[0].exercise === flippedCards[1].exercise) {
        const newMatchedCards = [...matchedCards, flippedCards[0], flippedCards[1]];
        setMatchedCards(newMatchedCards);
        const newCards = cards.map(card => {
          if (card.id === flippedCards[0].id || card.id === flippedCards[1].id) {
            return { ...card, matched: true };
          }
          return card;
        });
        setCards(newCards);
      } else {
        const newCards = cards.map(card => ({
          ...card,
          flipped: card.matched || (card.flipped && !card.matched),
        }));
        setCards(newCards);
      }
      setFlippedCards([]);
    }
  };

  // Initialize cards when the component mounts or when the selected game changes
  useEffect(() => {
    initializeCards();
  }, [selectedGame]);

  return (
    <div className="App">
      <h1>Fitness Card Matching Game</h1>
      <div>
        <label htmlFor="gameSelect">Select a fitness game:</label>
        <select id="gameSelect" value={selectedGame} onChange={e => setSelectedGame(e.target.value)}>
          <option value="Game 1">Game 1</option>
          <option value="Game 2">Game 2</option>
        </select>
      </div>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back">{card.exercise}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
