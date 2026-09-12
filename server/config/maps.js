// Map and game mode configurations
const maps = {
  arena_classic: {
    name: 'Classic Arena',
    width: 800,
    height: 600,
    spawnPoints: [
      { x: 100, y: 300, team: 1 },
      { x: 150, y: 250, team: 1 },
      { x: 150, y: 350, team: 1 },
      { x: 700, y: 300, team: 2 },
      { x: 650, y: 250, team: 2 },
      { x: 650, y: 350, team: 2 }
    ],
    obstacles: [
      { x: 400, y: 300, width: 50, height: 50 },
      { x: 300, y: 200, width: 40, height: 40 },
      { x: 500, y: 400, width: 40, height: 40 }
    ],
    powerUps: [
      { x: 400, y: 150, type: 'health', respawn: 30000 },
      { x: 400, y: 450, type: 'speed', respawn: 30000 },
      { x: 200, y: 300, type: 'damage', respawn: 40000 },
      { x: 600, y: 300, type: 'damage', respawn: 40000 }
    ]
  },

  forest_battle: {
    name: 'Forest Battle',
    width: 1000,
    height: 800,
    spawnPoints: [
      { x: 150, y: 400, team: 1 },
      { x: 200, y: 350, team: 1 },
      { x: 200, y: 450, team: 1 },
      { x: 850, y: 400, team: 2 },
      { x: 800, y: 350, team: 2 },
      { x: 800, y: 450, team: 2 }
    ],
    obstacles: [
      { x: 500, y: 400, width: 80, height: 80 },
      { x: 300, y: 200, width: 60, height: 60 },
      { x: 700, y: 600, width: 60, height: 60 },
      { x: 200, y: 600, width: 50, height: 50 },
      { x: 800, y: 200, width: 50, height: 50 }
    ],
    powerUps: [
      { x: 500, y: 400, type: 'health', respawn: 25000 },
      { x: 200, y: 100, type: 'speed', respawn: 30000 },
      { x: 800, y: 100, type: 'speed', respawn: 30000 },
      { x: 500, y: 750, type: 'damage', respawn: 35000 }
    ]
  },

  crystal_cave: {
    name: 'Crystal Cave',
    width: 900,
    height: 700,
    spawnPoints: [
      { x: 100, y: 350, team: 1 },
      { x: 150, y: 300, team: 1 },
      { x: 150, y: 400, team: 1 },
      { x: 800, y: 350, team: 2 },
      { x: 750, y: 300, team: 2 },
      { x: 750, y: 400, team: 2 }
    ],
    obstacles: [
      { x: 450, y: 350, width: 100, height: 100 },
      { x: 300, y: 150, width: 70, height: 70 },
      { x: 600, y: 550, width: 70, height: 70 }
    ],
    powerUps: [
      { x: 450, y: 350, type: 'health', respawn: 20000 },
      { x: 100, y: 600, type: 'damage', respawn: 35000 },
      { x: 800, y: 600, type: 'damage', respawn: 35000 }
    ]
  }
};

const gameModes = {
  deathmatch: {
    name: 'Deathmatch',
    duration: 300,
    description: 'Last team standing wins',
    winCondition: 'Team eliminates all opponents'
  },

  gem_collector: {
    name: 'Gem Collector',
    duration: 300,
    description: 'Collect gems to score points',
    winCondition: 'First team to 100 points wins',
    gemsPerMatch: 15,
    gemRespawn: 10000
  },

  king_of_the_hill: {
    name: 'King of the Hill',
    duration: 300,
    description: 'Control the center zone to score',
    winCondition: 'First team to 500 points wins',
    controlZone: { x: 400, y: 300, radius: 100 },
    pointsPerSecond: 1
  },

  capture_the_flag: {
    name: 'Capture the Flag',
    duration: 300,
    description: 'Capture enemy flag and bring to base',
    winCondition: 'First team to 3 captures wins',
    flagSpawns: {
      team1: { x: 150, y: 300 },
      team2: { x: 750, y: 300 }
    }
  }
};

module.exports = { maps, gameModes };
