// Matchmaking system to pair players
class Matchmaker {
  constructor() {
    this.queue = [];
    this.minPlayersForMatch = 6;
  }

  addPlayer(player) {
    this.queue.push({
      player,
      joinedAt: Date.now(),
      skill: player.level // Simple skill metric based on level
    });
    return this.checkForMatch();
  }

  removePlayer(playerId) {
    this.queue = this.queue.filter(entry => entry.player.id !== playerId);
  }

  checkForMatch() {
    if (this.queue.length >= this.minPlayersForMatch) {
      // Sort by skill level to balance teams
      this.queue.sort((a, b) => b.skill - a.skill);

      // Create balanced teams
      const match = {
        team1: this.queue.slice(0, 3).map(e => e.player),
        team2: this.queue.slice(3, 6).map(e => e.player)
      };

      // Remove matched players from queue
      this.queue = this.queue.slice(6);

      return match;
    }
    return null;
  }

  getQueueLength() {
    return this.queue.length;
  }

  getAverageWaitTime() {
    if (this.queue.length === 0) return 0;
    const now = Date.now();
    const totalWaitTime = this.queue.reduce((sum, entry) => {
      return sum + (now - entry.joinedAt);
    }, 0);
    return totalWaitTime / this.queue.length / 1000; // in seconds
  }

  getQueueStats() {
    return {
      playersInQueue: this.queue.length,
      averageWaitTime: this.getAverageWaitTime(),
      readyForMatch: this.queue.length >= this.minPlayersForMatch
    };
  }
}

module.exports = Matchmaker;
