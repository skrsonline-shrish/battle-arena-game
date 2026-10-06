import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function App() {
  const [gameState, setGameState] = useState('menu');
  const [socket, setSocket] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [character, setCharacter] = useState('Blaze');
  const [playersInQueue, setPlayersInQueue] = useState(0);

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setError('Disconnected from server. Retrying...');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError(`Connection error: ${error.message}`);
    });

    newSocket.on('playerJoined', (data) => {
      console.log('Player joined:', data);
    });

    newSocket.on('waitingForPlayers', (data) => {
      console.log('Waiting for players:', data);
      setPlayersInQueue(data.playersInQueue || 0);
      setGameState('matchmaking');
    });

    newSocket.on('queueStatus', (data) => {
      setPlayersInQueue(data.playersInQueue || 0);
    });

    newSocket.on('matchFound', (data) => {
      console.log('Match found!', data);
      setMatchData(data);
      setGameState('playing');
    });

    newSocket.on('leaderboard', (data) => {
      setLeaderboard(data);
    });

    newSocket.on('matchEnded', () => {
      setGameState('gameOver');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handlePlayerJoin = () => {
    if (!playerName.trim()) {
      alert('Please enter a player name');
      return;
    }

    if (!socket) {
      setError('Server connection not ready yet');
      return;
    }

    const player = {
      id: socket.id,
      name: playerName.trim(),
      character,
      score: 0,
      kills: 0,
      deaths: 0
    };

    setPlayerData(player);
    socket.emit('playerJoin', player);
    setGameState('matchmaking');
  };

  const handleFindMatch = () => {
    if (socket) {
      socket.emit('findMatch');
    }
  };

  const handlePlayAgain = () => {
    setGameState('matchmaking');
    handleFindMatch();
  };

  const handleViewLeaderboard = () => {
    if (socket) {
      socket.emit('requestLeaderboard');
      setGameState('leaderboard');
    }
  };

  const handleBackToMenu = () => {
    setPlayerData(null);
    setMatchData(null);
    setGameState('menu');
  };

  if (gameState === 'playing' && matchData) {
    return (
      <div className="app app-playing">
        <div className="game-panel">
          <div className="arena-header">
            <h1>Match #{matchData.matchId}</h1>
            <span className={`team-badge team-${matchData.team}`}>Team {matchData.team}</span>
          </div>

          <div className="match-summary">
            <div>
              <h3>Teammates</h3>
              <p>{matchData.teammates && matchData.teammates.length > 0
                ? matchData.teammates.map((t) => t.name).join(', ')
                : 'Waiting...'}</p>
            </div>
            <div>
              <h3>Opponents</h3>
              <p>{matchData.opponents && matchData.opponents.length > 0
                ? matchData.opponents.map((o) => o.name).join(', ')
                : 'Waiting...'}</p>
            </div>
          </div>

          <p className="status-text">🎮 Six-player 3v3 arena is active. Ready to connect Phaser game scene.</p>
          <button className="btn-primary" onClick={handleBackToMenu}>Back to menu</button>
        </div>
      </div>
    );
  }

  if (gameState === 'matchmaking') {
    return (
      <div className="app app-matchmaking">
        <div className="matchmaking-panel">
          <h1>Finding Match...</h1>
          <p className="queue-counter">{playersInQueue} / 6 players</p>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(playersInQueue / 6) * 100}%` }} />
          </div>

          <p className="queue-message">
            {playersInQueue < 6
              ? `Need ${Math.max(0, 6 - playersInQueue)} more player${6 - playersInQueue !== 1 ? 's' : ''} to start.`
              : '✅ Match starting!'}
          </p>

          <div className="button-row">
            <button className="btn-primary" onClick={handleFindMatch}>Refresh Queue</button>
            <button className="btn-secondary" onClick={handleBackToMenu}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="app">
        <div className="panel leaderboard-panel">
          <h1>🏆 Leaderboard</h1>
          {leaderboard.length === 0 ? <p>No scores yet.</p> : (
            <ol>
              {leaderboard.map((player, index) => (
                <li key={`${player.name}-${index}`}>
                  <span>{player.name}</span>
                  <strong>{player.score} pts</strong>
                  <small>{player.kills} K</small>
                </li>
              ))}
            </ol>
          )}
          <button className="btn-primary" onClick={handleBackToMenu}>Back to menu</button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="app">
        <div className="panel game-over-panel">
          <h1>Match Finished!</h1>
          <button className="btn-primary" onClick={handlePlayAgain}>Play again</button>
          <button className="btn-secondary" onClick={handleViewLeaderboard}>Leaderboard</button>
          <button className="btn-tertiary" onClick={handleBackToMenu}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app app-menu">
      <div className="panel menu-panel">
        <div className="title-wrap">
          <p className="eyebrow">MULTIPLAYER ARENA</p>
          <h1>⚔️ Battle Arena</h1>
        </div>

        <p className="subtitle">3v3 online battle arena. All 6 players must join before the match starts.</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label htmlFor="playerName">Player Name</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        <div className="input-group">
          <label htmlFor="character">Character</label>
          <select id="character" value={character} onChange={(e) => setCharacter(e.target.value)}>
            <option value="Blaze">Blaze 🔥</option>
            <option value="Frost">Frost ❄️</option>
            <option value="Nova">Nova ⭐</option>
            <option value="Titan">Titan 💪</option>
            <option value="Shadow">Shadow 🌑</option>
          </select>
        </div>

        <div className="button-row menu-buttons">
          <button className="btn-primary" onClick={handlePlayerJoin}>Join Match</button>
          <button className="btn-secondary" onClick={handleViewLeaderboard}>Leaderboard</button>
        </div>
      </div>
    </div>
  );
}

export default App;
