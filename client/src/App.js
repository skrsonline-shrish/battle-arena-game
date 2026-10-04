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
      reconnectionAttempts: 5
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

    newSocket.on('matchEnded', (data) => {
      console.log('Match ended:', data);
      setGameState('gameOver');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handlePlayerJoin = () => {
    if (!playerName.trim()) {
      alert('Please enter a name');
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

  const handleBackToMenu = () => {
    setPlayerData(null);
    setMatchData(null);
    setGameState('menu');
  };

  const handleViewLeaderboard = () => {
    if (socket) {
      socket.emit('requestLeaderboard');
      setGameState('leaderboard');
    }
  };

  if (gameState === 'playing' && matchData) {
    return (
      <div className="app">
        <div className="game-panel">
          <h1>Match #{matchData.matchId}</h1>
          <p>Team: {matchData.team}</p>
          <p>Teammates: {matchData.teammates ? matchData.teammates.map(t => t.name).join(', ') : 'Loading...'}</p>
          <p>Opponents: {matchData.opponents ? matchData.opponents.map(o => o.name).join(', ') : 'Loading...'}</p>
          <p>Game scene is ready to be connected to Phaser.</p>
          <button className="btn-primary" onClick={handleBackToMenu}>Back to menu</button>
        </div>
      </div>
    );
  }

  if (gameState === 'matchmaking') {
    return (
      <div className="app">
        <div className="matchmaking-panel">
          <h1>Finding Match...</h1>
          <p>{playersInQueue} / 6 players</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(playersInQueue / 6) * 100}%` }} />
          </div>
          <p>Need {Math.max(0, 6 - playersInQueue)} more player(s) to start.</p>
          <button className="btn-primary" onClick={handleFindMatch}>Refresh Queue</button>
          <button className="btn-secondary" onClick={handleBackToMenu}>Back</button>
        </div>
      </div>
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="app">
        <div className="leaderboard-panel">
          <h1>Leaderboard</h1>
          {leaderboard.length === 0 ? <p>No scores yet.</p> : (
            <ol>
              {leaderboard.map((player, index) => (
                <li key={`${player.name}-${index}`}>
                  {player.name} - {player.score} pts ({player.kills} kills)
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
        <div className="game-over-panel">
          <h1>Match Finished</h1>
          <button className="btn-primary" onClick={handlePlayAgain}>Play again</button>
          <button className="btn-secondary" onClick={handleViewLeaderboard}>Leaderboard</button>
          <button className="btn-tertiary" onClick={handleBackToMenu}>Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="menu-panel">
        <h1>⚔️ Battle Arena</h1>
        <p>3v3 Multiplayer Arena</p>

        {error && <div className="error-banner">{error}</div>}

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
          />
        </div>

        <div className="input-group">
          <label>Character</label>
          <select value={character} onChange={(e) => setCharacter(e.target.value)}>
            <option value="Blaze">Blaze</option>
            <option value="Frost">Frost</option>
            <option value="Nova">Nova</option>
            <option value="Titan">Titan</option>
            <option value="Shadow">Shadow</option>
          </select>
        </div>

        <button className="btn-primary" onClick={handlePlayerJoin}>Join Match</button>
        <button className="btn-secondary" onClick={handleViewLeaderboard}>Leaderboard</button>
      </div>
    </div>
  );
}

export default App;
