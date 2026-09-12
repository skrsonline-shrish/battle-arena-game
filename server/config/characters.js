// Character definitions with abilities
const characters = {
  blaze: {
    name: 'Blaze',
    health: 100,
    speed: 5,
    attackPower: 15,
    ability: {
      name: 'Inferno',
      cooldown: 5000,
      damage: 30,
      range: 200,
      description: 'Fire area of effect damage'
    },
    superAbility: {
      name: 'Meteor Strike',
      cooldown: 15000,
      damage: 50,
      range: 300,
      description: 'Devastating fire strike on a wide area'
    },
    rarity: 'Common'
  },

  frost: {
    name: 'Frost',
    health: 80,
    speed: 6,
    attackPower: 12,
    ability: {
      name: 'Ice Shards',
      cooldown: 4000,
      damage: 20,
      range: 250,
      slowEffect: 2000,
      description: 'Freeze enemies in place'
    },
    superAbility: {
      name: 'Blizzard',
      cooldown: 15000,
      damage: 40,
      range: 280,
      description: 'Freeze all enemies in area'
    },
    rarity: 'Common'
  },

  nova: {
    name: 'Nova',
    health: 70,
    speed: 8,
    attackPower: 14,
    ability: {
      name: 'Dash',
      cooldown: 3000,
      range: 150,
      description: 'Quick dash to evade enemies'
    },
    superAbility: {
      name: 'Light Speed',
      cooldown: 12000,
      speed: 15,
      duration: 3000,
      description: 'Temporary speed boost and invulnerability'
    },
    rarity: 'Rare'
  },

  titan: {
    name: 'Titan',
    health: 150,
    speed: 3,
    attackPower: 18,
    defense: 10,
    ability: {
      name: 'Shield',
      cooldown: 6000,
      defense: 20,
      duration: 4000,
      description: 'Block incoming damage'
    },
    superAbility: {
      name: 'Earthquake',
      cooldown: 15000,
      damage: 45,
      range: 200,
      knockback: true,
      description: 'Stun and damage all nearby enemies'
    },
    rarity: 'Rare'
  },

  shadow: {
    name: 'Shadow',
    health: 85,
    speed: 7,
    attackPower: 20,
    ability: {
      name: 'Shadowburst',
      cooldown: 4000,
      damage: 35,
      range: 180,
      description: 'High burst damage attack'
    },
    superAbility: {
      name: 'Vanish',
      cooldown: 12000,
      stealth: 3000,
      description: 'Become invisible and gain movement speed'
    },
    rarity: 'Legendary'
  }
};

module.exports = characters;
