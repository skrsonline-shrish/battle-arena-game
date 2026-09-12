# Battle Arena Game

🎮 **3v3 Multiplayer Real-Time Arena Battle Game**

A fast-paced, skill-based multiplayer game where teams battle for supremacy in dynamic arenas with unique game modes and abilities.

## 🌟 Features

- **Real-Time Multiplayer** - Socket.io powered instant gameplay
- **5 Unique Characters** - Each with unique abilities and stats
- **4 Game Modes** - Deathmatch, Gem Collector, King of the Hill, Capture the Flag
- **3 Dynamic Maps** - Classic Arena, Forest Battle, Crystal Cave
- **Team-Based Combat** - 3v3 competitive matches
- **Player Progression** - Level up and track your stats
- **Leaderboard** - Compete for top rankings
- **Physics Engine** - Realistic collision and damage

## 📂 Project Structure

```
battle-arena-game/
├── server/                 # Node.js + Express + Socket.io
│   ├── server.js
│   ├── package.json
│   ├── config/            # Game configuration
│   ├── models/            # Data models
│   ├── utils/             # Utilities & helpers
│   └── README.md
├── client/                # React + Phaser 3
│   ├── src/
│   ├── public/
│   ├── package.json
│   └���─ README.md
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn
- Modern web browser

### Server Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:5000`

### Client Setup

```bash
cd client
npm install
cp .env.example .env
npm start
```

Client runs on `http://localhost:3000`

## 🎮 How to Play

1. **Start the Game**
   - Open http://localhost:3000
   - Click "START GAME"

2. **Select Your Hero**
   - Enter your player name
   - Choose from 5 unique characters
   - See character stats before confirming

3. **Find a Match**
   - Select game mode
   - Click "Find Match"
   - Wait for players to queue

4. **Battle**
   - **WASD** - Move around the arena
   - **Mouse Click** - Attack enemies
   - **Space** - Use ability
   - Eliminate opponents and score points

5. **Win & Progress**
   - First to complete objective wins
   - Gain experience and level up
   - Climb the leaderboard

## 🎯 Game Modes

### Deathmatch
Last team standing wins. Simple elimination-based gameplay.

### Gem Collector
Collect gems scattered around the map. First team to 100 gems wins.

### King of the Hill
Control the center zone to earn points. First to 500 points wins.

### Capture the Flag
Capture enemy flag and bring to base. First team to 3 captures wins.

## 🦸 Characters

### Blaze 🔥
- **Type:** Fire Warrior
- **HP:** 100
- **Attack:** 15
- **Speed:** 5
- **Ability:** Inferno (Area damage)

### Frost ❄️
- **Type:** Ice Mage
- **HP:** 80
- **Attack:** 12
- **Speed:** 6
- **Ability:** Ice Shards (Crowd control)

### Nova ⚡
- **Type:** Speedster
- **HP:** 70
- **Attack:** 14
- **Speed:** 8 (Fastest)
- **Ability:** Dash (Mobility)
- **Rarity:** Rare

### Titan 💪
- **Type:** Tank
- **HP:** 150 (Highest)
- **Attack:** 18
- **Speed:** 3
- **Ability:** Shield (Defense)
- **Rarity:** Rare

### Shadow 🌙
- **Type:** Assassin
- **HP:** 85
- **Attack:** 20 (Highest)
- **Speed:** 7
- **Ability:** Vanish (Stealth)
- **Rarity:** Legendary

## 🗺️ Maps

### Classic Arena
A balanced arena with central obstacles. Perfect for beginners.
- Size: 800x600
- Obstacles: 3
- Power-ups: 4

### Forest Battle
A larger map with more terrain. Tactical gameplay.
- Size: 1000x800
- Obstacles: 5
- Power-ups: 4

### Crystal Cave
A mystical cave with unique layout. High-skill gameplay.
- Size: 900x700
- Obstacles: 3
- Power-ups: 3

## 📊 API Reference

### REST Endpoints

```
GET  /api/health          - Server health check
GET  /api/stats           - Server statistics
```

### Socket.io Events

**Emit (Client → Server):**
- `playerJoin` - Join game session
- `findMatch` - Search for match
- `playerMove` - Update position
- `playerAttack` - Attack target
- `useAbility` - Use character ability
- `matchEnd` - End match
- `chatMessage` - Send message
- `requestLeaderboard` - Get rankings

**Listen (Server → Client):**
- `playerJoined` - Player joined event
- `matchFound` - Match created
- `playerMoved` - Position update
- `playerAttacked` - Attack event
- `playerKilled` - Death event
- `matchEnded` - Match finished
- `leaderboard` - Top players
- `newChatMessage` - Chat received

## ⚙️ Configuration

### Server Config (.env)
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MAX_PLAYERS_PER_MATCH=6
MATCH_DURATION=300
```

### Client Config (.env)
```
REACT_APP_SERVER_URL=http://localhost:5000
```

## 📈 Performance

- **FPS:** 60+ frames per second
- **Latency:** <100ms for optimal gameplay
- **Players:** 100+ concurrent per server
- **Bandwidth:** ~50KB/s per player

## 🔒 Security

- Input validation on all endpoints
- Rate limiting on API
- XSS protection
- CORS configured
- Secure Socket.io connection

## 🐛 Known Issues

- Mobile touch controls not yet implemented
- Voice chat feature pending
- Replay system in development

## 🚦 Roadmap

- [x] Core game mechanics
- [x] Character system
- [x] Matchmaking
- [x] Game modes
- [ ] Database persistence
- [ ] User authentication
- [ ] Cosmetics system
- [ ] Mobile version
- [ ] Esports features
- [ ] Social features

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 👨‍💻 Author

Created by **skrsonline-shrish**

## 📞 Support

For support, email: skrsonline@gmail.com

Or open an issue on GitHub: https://github.com/skrsonline-shrish/battle-arena-game/issues

---

**Ready to battle? 🎮** Start the game and prove your skills!
