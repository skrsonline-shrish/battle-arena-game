const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Game state
const gameState = {
  players: {},
  matches: {},
  matchId: 0
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalPlayers: Object.keys(gameState.players).length,
    activeMatches: Object.keys(gameState.matches).length,
    uptime: process.uptime()
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`New player connected: ${socket.id}`);

  // Player joins
  socket.on('playerJoin', (playerData) => {
    gameState.players[socket.id] = {
      id: socket.id,
      name: playerData.name,
      character: playerData.character || 'Blaze',
      score: 0,
      kills: 0,
      deaths: 0,
      status: 'waiting',
      position: { x: 0, y: 0 }
    };

    console.log(`Player joined: ${playerData.name} (${socket.id})`);
    io.emit('playerJoined', gameState.players[socket.id]);
  });

  // Find match
  socket.on('findMatch', () => {
    const waitingPlayers = Object.values(gameState.players).filter(
      p => p.status === 'waiting'
    );

    if (waitingPlayers.length >= 6) {
      // Create a new match with 6 players
      const matchId = ++gameState.matchId;
      const team1 = waitingPlayers.slice(0, 3);
      const team2 = waitingPlayers.slice(3, 6);

      gameState.matches[matchId] = {
        id: matchId,
        team1: team1.map(p => p.id),
        team2: team2.map(p => p.id),
        status: 'active',
        createdAt: Date.now(),
        team1Score: 0,
        team2Score: 0
      };

      // Update player status
      [...team1, ...team2].forEach(player => {
        gameState.players[player.id].status = 'in-match';
      });

      // Notify players
      socket.emit('matchFound', {
        matchId,
        team: team1.includes(gameState.players[socket.id]) ? 1 : 2,
        opponents: (team1.includes(gameState.players[socket.id]) ? team2 : team1).map(p => ({
          id: p.id,
          name: p.name,
          character: p.character
        }))
      });

      console.log(`Match created: ${matchId} with 6 players`);
    } else {
      socket.emit('waitingForPlayers', {
        playersInQueue: waitingPlayers.length,
        requiredPlayers: 6
      });
    }
  });

  // Player movement
  socket.on('playerMove', (data) => {
    if (gameState.players[socket.id]) {
      gameState.players[socket.id].position = data.position;
      socket.broadcast.emit('playerMoved', {
        playerId: socket.id,
        position: data.position
      });
    }
  });

  // Player attack
  socket.on('playerAttack', (data) => {
    const attacker = gameState.players[socket.id];
    const target = gameState.players[data.targetId];

    if (attacker && target) {
      console.log(`${attacker.name} attacked ${target.name}`);
      
      io.emit('playerAttacked', {
        attackerId: socket.id,
        targetId: data.targetId,
        damage: data.damage
      });

      // Handle kill
      if (data.targetHealth <= 0) {
        attacker.kills++;
        target.deaths++;
        io.emit('playerKilled', {
          killedBy: socket.id,
          targetId: data.targetId
        });
      }
    }
  });

  // Use ability
  socket.on('useAbility', (data) => {
    const player = gameState.players[socket.id];
    
    if (player) {
      io.emit('abilityUsed', {
        playerId: socket.id,
        ability: data.ability,
        position: data.position,
        character: player.character
      });
    }
  });

  // Match end
  socket.on('matchEnd', (data) => {
    const match = gameState.matches[data.matchId];
    
    if (match) {
      match.status = 'completed';
      match.winner = data.winnerTeam;

      // Update player stats
      const winners = data.winnerTeam === 1 ? match.team1 : match.team2;
      winners.forEach(playerId => {
        if (gameState.players[playerId]) {
          gameState.players[playerId].score += 10;
        }
      });

      io.emit('matchEnded', {
        matchId: data.matchId,
        winnerTeam: data.winnerTeam,
        finalScore: data.finalScore
      });

      console.log(`Match ${data.matchId} ended. Winner: Team ${data.winnerTeam}`);
    }
  });

  // Chat message
  socket.on('chatMessage', (data) => {
    io.emit('newChatMessage', {
      playerId: socket.id,
      playerName: gameState.players[socket.id]?.name,
      message: data.message,
      timestamp: Date.now()
    });
  });

  // Get leaderboard
  socket.on('requestLeaderboard', () => {
    const leaderboard = Object.values(gameState.players)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        score: p.score,
        kills: p.kills,
        deaths: p.deaths,
        character: p.character
      }));

    socket.emit('leaderboard', leaderboard);
  });

  // Player disconnect
  socket.on('disconnect', () => {
    const player = gameState.players[socket.id];
    
    if (player) {
      console.log(`Player disconnected: ${player.name} (${socket.id})`);
      delete gameState.players[socket.id];
      io.emit('playerDisconnected', { playerId: socket.id, playerName: player.name });
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🎮 Battle Arena Game Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
