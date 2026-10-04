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
  queues: {}, // Separate queues for each match attempt
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
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100
    };

    console.log(`Player joined: ${playerData.name} (${socket.id})`);
    io.emit('playerJoined', gameState.players[socket.id]);
  });

  // Find match - requires exactly 6 players
  socket.on('findMatch', () => {
    const waitingPlayers = Object.values(gameState.players).filter(
      p => p.status === 'waiting'
    );

    console.log(`🔍 Find Match requested. Players in queue: ${waitingPlayers.length}`);

    if (waitingPlayers.length >= 6) {
      // Create a new match with exactly 6 players
      const matchId = ++gameState.matchId;
      const team1Players = waitingPlayers.slice(0, 3);
      const team2Players = waitingPlayers.slice(3, 6);

      gameState.matches[matchId] = {
        id: matchId,
        team1: team1Players.map(p => p.id),
        team2: team2Players.map(p => p.id),
        status: 'active',
        createdAt: Date.now(),
        team1Score: 0,
        team2Score: 0,
        startTime: Date.now(),
        duration: 300 // 5 minutes
      };

      // Update player status
      [...team1Players, ...team2Players].forEach(player => {
        gameState.players[player.id].status = 'in-match';
        gameState.players[player.id].matchId = matchId;
      });

      // Notify all 6 players
      team1Players.forEach(player => {
        io.to(player.id).emit('matchFound', {
          matchId,
          team: 1,
          opponents: team2Players.map(p => ({
            id: p.id,
            name: p.name,
            character: p.character
          })),
          teammates: team1Players.filter(p => p.id !== player.id).map(p => ({
            id: p.id,
            name: p.name,
            character: p.character
          }))
        });
      });

      team2Players.forEach(player => {
        io.to(player.id).emit('matchFound', {
          matchId,
          team: 2,
          opponents: team1Players.map(p => ({
            id: p.id,
            name: p.name,
            character: p.character
          })),
          teammates: team2Players.filter(p => p.id !== player.id).map(p => ({
            id: p.id,
            name: p.name,
            character: p.character
          }))
        });
      });

      console.log(`✅ Match ${matchId} created with 6 players (3v3)`);
    } else {
      // Send queue status to requesting player
      io.to(socket.id).emit('waitingForPlayers', {
        playersInQueue: waitingPlayers.length,
        requiredPlayers: 6,
        playersNeeded: 6 - waitingPlayers.length
      });

      // Broadcast queue status to all waiting players
      io.emit('queueStatus', {
        playersInQueue: waitingPlayers.length,
        requiredPlayers: 6,
        playersNeeded: Math.max(0, 6 - waitingPlayers.length),
        queueUpdatedAt: Date.now()
      });

      console.log(`⏳ Queue status: ${waitingPlayers.length}/6 players`);
    }
  });

  // Player movement
  socket.on('playerMove', (data) => {
    if (gameState.players[socket.id]) {
      gameState.players[socket.id].position = data.position;
      socket.broadcast.emit('playerMoved', {
        playerId: socket.id,
        position: data.position,
        character: gameState.players[socket.id].character
      });
    }
  });

  // Player attack
  socket.on('playerAttack', (data) => {
    const attacker = gameState.players[socket.id];
    const target = gameState.players[data.targetId];

    if (attacker && target) {
      console.log(`⚔️ ${attacker.name} attacked ${target.name} for ${data.damage} damage`);
      
      // Apply damage
      target.health = Math.max(0, target.health - data.damage);

      io.emit('playerAttacked', {
        attackerId: socket.id,
        attackerName: attacker.name,
        targetId: data.targetId,
        targetName: target.name,
        damage: data.damage,
        position: data.position,
        character: attacker.character
      });

      // Handle kill
      if (target.health <= 0) {
        attacker.kills++;
        target.deaths++;
        target.status = 'dead';

        io.emit('playerKilled', {
          killedBy: socket.id,
          killerName: attacker.name,
          targetId: data.targetId,
          targetName: target.name,
          position: data.position
        });

        console.log(`💀 ${target.name} was killed by ${attacker.name}`);
      }
    }
  });

  // Use ability
  socket.on('useAbility', (data) => {
    const player = gameState.players[socket.id];
    
    if (player) {
      console.log(`✨ ${player.name} used ${data.ability}`);
      io.emit('abilityUsed', {
        playerId: socket.id,
        playerName: player.name,
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
      match.endTime = Date.now();

      // Update player stats
      const winners = data.winnerTeam === 1 ? match.team1 : match.team2;
      const losers = data.winnerTeam === 1 ? match.team2 : match.team1;

      winners.forEach(playerId => {
        if (gameState.players[playerId]) {
          gameState.players[playerId].score += 25;
          gameState.players[playerId].status = 'waiting';
        }
      });

      losers.forEach(playerId => {
        if (gameState.players[playerId]) {
          gameState.players[playerId].score += 10;
          gameState.players[playerId].status = 'waiting';
        }
      });

      io.emit('matchEnded', {
        matchId: data.matchId,
        winnerTeam: data.winnerTeam,
        finalScore: data.finalScore
      });

      console.log(`🏆 Match ${data.matchId} ended. Winner: Team ${data.winnerTeam}`);
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
      .map((p, index) => ({
        rank: index + 1,
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
      console.log(`❌ Player disconnected: ${player.name} (${socket.id})`);
      
      // If in match, end it
      if (player.status === 'in-match' && player.matchId) {
        const match = gameState.matches[player.matchId];
        if (match) {
          match.status = 'abandoned';
        }
      }

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
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Server URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

module.exports = app;
