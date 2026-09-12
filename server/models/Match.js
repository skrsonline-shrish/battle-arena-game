// Match model for game sessions
class Match {
  constructor(id, gameMode, map, maxPlayers = 6) {
    this.id = id;
    this.gameMode = gameMode;
    this.map = map;
    this.maxPlayers = maxPlayers;
    this.status = 'waiting'; // waiting, active, completed
    this.team1 = [];
    this.team2 = [];
    this.startTime = null;
    this.endTime = null;
    this.duration = 300; // 5 minutes in seconds
    this.team1Score = 0;
    this.team2Score = 0;
    this.winner = null;
    this.events = [];
    this.createdAt = Date.now();
  }

  addPlayer(player, team) {
    if (team === 1) {
      if (this.team1.length < this.maxPlayers / 2) {
        this.team1.push(player);
        player.team = 1;
        return true;
      }
    } else if (team === 2) {
      if (this.team2.length < this.maxPlayers / 2) {
        this.team2.push(player);
        player.team = 2;
        return true;
      }
    }
    return false;
  }

  removePlayer(playerId) {
    this.team1 = this.team1.filter(p => p.id !== playerId);
    this.team2 = this.team2.filter(p => p.id !== playerId);
  }

  isFull() {
    return this.team1.length + this.team2.length >= this.maxPlayers;
  }

  start() {
    this.status = 'active';
    this.startTime = Date.now();
    this.logEvent('match_started', { playerCount: this.team1.length + this.team2.length });
  }

  end(winnerTeam) {
    this.status = 'completed';
    this.endTime = Date.now();
    this.winner = winnerTeam;
    this.logEvent('match_ended', { winner: winnerTeam });
  }

  addScore(team, points) {
    if (team === 1) {
      this.team1Score += points;
    } else {
      this.team2Score += points;
    }
  }

  logEvent(type, data) {
    this.events.push({
      type,
      data,
      timestamp: Date.now()
    });
  }

  getMatchStats() {
    return {
      id: this.id,
      gameMode: this.gameMode,
      map: this.map,
      status: this.status,
      team1: {
        players: this.team1.map(p => ({ id: p.id, name: p.name, score: p.score })),
        score: this.team1Score
      },
      team2: {
        players: this.team2.map(p => ({ id: p.id, name: p.name, score: p.score })),
        score: this.team2Score
      },
      duration: this.duration,
      winner: this.winner,
      createdAt: this.createdAt,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }

  getRemainingTime() {
    if (!this.startTime || this.status !== 'active') return this.duration;
    const elapsed = (Date.now() - this.startTime) / 1000;
    return Math.max(0, this.duration - elapsed);
  }

  isTimeUp() {
    return this.getRemainingTime() <= 0;
  }
}

module.exports = Match;
