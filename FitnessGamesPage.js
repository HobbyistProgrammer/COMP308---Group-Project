import React from 'react';
import GameCard from './GameCard'; // Component to display each game card
import gamesData from './gamesData'; // Array of game information

function FitnessGamesPage() {
  return (
    <div>
      <h1>Fitness Games</h1>
      <div className="games-container">
        {gamesData.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export default FitnessGamesPage;
