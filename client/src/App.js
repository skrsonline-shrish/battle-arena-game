import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import GameBoard from './components/GameBoard';
import Matchmaking from './components/Matchmaking';
import Leaderboard from './components/Leaderboard';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function App() {
  const [gameState, setGameState] = useState('menu'); // menu, characterSelect, matchmaking, playing, gameOver, leaderboard
  const [socket, setSocket] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  // Initialize socket connection
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
      setError('Disconnected from server. Attempting to reconnect...');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError(`Connection error: ${error.message}`);
    });

    newSocket.on('playerJoined', (data) => {
      console.log('Player joined:', data);
    });

    newSocket.on('matchFound', (data) => {
      console.log('Match found!', data);
      setMatchData(data);
      setGameState('playing');
    });

    newSocket.on('waitingForPlayers', (data) => {
      console.log('Waiting for players:', data);
    });

    newSocket.on('leaderboard', (data) => {
      setLeaderboard(data);
    });

    newSocket.on('playerMoved', (data) => {
      // Handle player movement in game
    });

    newSocket.on('playerAttacked', (data) => {
      // Handle player attack
    });

    newSocket.on('playerKilled', (data) => {
      // Handle player death
    });

    newSocket.on('matchEnded', (data) => {
      console.log('Match ended:', data);
      setGameState('gameOver');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handlePlayerJoin = (playerName, characterName) => {
    const player = {
      id: socket.id,
      name: playerName,
      character: characterName,
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

  return (
    <div className="app">
      {error && <div className="error-banner">{error}</div>}
      
      {gameState === 'menu' && (
        <MainMenu onStart={() => setGameState('characterSelect')} />
      )}

      {gameState === 'characterSelect' && (
        <CharacterSelect
          onSelectCharacter={handlePlayerJoin}
          onBack={handleBackToMenu}
        />
      )}

      {gameState === 'matchmaking' && (
        <Matchmaking
          playerData={playerData}
          socket={socket}
          onFindMatch={handleFindMatch}
          onBack={handleBackToMenu}
        />
      )}

      {gameState === 'playing' && (
        <GameBoard
          playerData={playerData}
          matchData={matchData}
          socket={socket}
          onMatchEnd={() => setGameState('gameOver')}
        />
      )}

      {gameState === 'gameOver' && (
        <div className="game-over-screen">
          <h1>Match Finished!</h1>
          <p>Great game! Check the leaderboard or play again.</p>
          <button onClick={handlePlayAgain} className="btn-primary">Play Again</button>
          <button onClick={handleViewLeaderboard} className="btn-secondary">View Leaderboard</button>
          <button onClick={handleBackToMenu} className="btn-tertiary">Back to Menu</button>
        </div>
      )}

      {gameState === 'leaderboard' && (
        <Leaderboard
          leaderboard={leaderboard}
          onBack={() => setGameState('menu')}
        />
      )}
    </div>
  );
}

export default App;
