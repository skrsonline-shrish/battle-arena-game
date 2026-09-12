// Player model for tracking stats and data
class Player {
  constructor(id, name, character) {
    this.id = id;
    this.name = name;
    this.character = character;
    this.score = 0;
    this.kills = 0;
    this.deaths = 0;
    this.assists = 0;
    this.health = 100;
    this.maxHealth = 100;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.status = 'waiting'; // waiting, in-match, alive, dead
    this.team = null;
    this.createdAt = Date.now();
    this.level = 1;
    this.experience = 0;
    this.abilities = {
      primary: { cooldown: 0, lastUsed: 0 },
      special: { cooldown: 0, lastUsed: 0 },
      super: { cooldown: 0, lastUsed: 0 }
    };
    this.inventory = {
      health: 0,
      speed: 0,
      damage: 0
    };
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    return this.health <= 0;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addScore(points) {
    this.score += points;
    this.updateLevel();
  }

  addExperience(amount) {
    this.experience += amount;
    this.updateLevel();
  }

  updateLevel() {
    const expPerLevel = 100;
    this.level = Math.floor(this.experience / expPerLevel) + 1;
  }

  getStats() {
    return {
      id: this.id,
      name: this.name,
      character: this.character,
      level: this.level,
      score: this.score,
      kills: this.kills,
      deaths: this.deaths,
      assists: this.assists,
      health: this.health,
      maxHealth: this.maxHealth,
      position: this.position,
      status: this.status,
      team: this.team
    };
  }

  reset() {
    this.health = this.maxHealth;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.status = 'waiting';
    this.abilities = {
      primary: { cooldown: 0, lastUsed: 0 },
      special: { cooldown: 0, lastUsed: 0 },
      super: { cooldown: 0, lastUsed: 0 }
    };
  }
}

module.exports = Player;
