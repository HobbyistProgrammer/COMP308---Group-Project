import React from 'react';

function GameCard({ game }) {
  const handleClick = () => {
    // To launch the game when the "Play" button is clicked

  };

  return (
    <div className="game-card">
      <h2>{game.name}</h2>
      <p>{game.description}</p>
      <button onClick={handleClick}>Play</button>
    </div>
  );
}

export default GameCard;
