import React from 'react';
import './MainMenu.css';

function MainMenu({ onStart }) {
  return (
    <div className="main-menu">
      <div className="menu-content">
        <h1 className="game-title">⚔️ Battle Arena</h1>
        <p className="subtitle">3v3 Multiplayer Arena Battles</p>
        
        <div className="features">
          <div className="feature">
            <span className="icon">🎮</span>
            <p>Real-time Multiplayer</p>
          </div>
          <div className="feature">
            <span className="icon">🎯</span>
            <p>5 Unique Characters</p>
          </div>
          <div className="feature">
            <span className="icon">🗺️</span>
            <p>3 Dynamic Maps</p>
          </div>
          <div className="feature">
            <span className="icon">⚡</span>
            <p>4 Game Modes</p>
          </div>
        </div>

        <button className="btn-play" onClick={onStart}>
          START GAME
        </button>
      </div>
    </div>
  );
}

export default MainMenu;
