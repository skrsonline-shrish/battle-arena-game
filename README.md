# Battle Arena Game 🎮

A fast-paced 3v3 multiplayer online arena battle game with unique characters, strategic gameplay, and real-time multiplayer action.

## Features
- ⚔️ Real-time 3v3 multiplayer battles
- 🎮 Unique original characters with abilities
- 🗺️ Dynamic arena maps
- 💪 Power-ups and skill system
- 📊 Live player stats and rankings
- 🌐 Play online instantly in your browser

## Quick Start - Play Online Now! 🚀

### Option 1: Play Without Installation (Recommended)
Click here to play online: **[Play Battle Arena](https://battle-arena-game.herokuapp.com)**

### Option 2: Run Locally

**Prerequisites:**
- Node.js (v14+)
- npm or yarn

**Installation:**
```bash
# Clone the repository
git clone https://github.com/skrsonline-shrish/battle-arena-game.git
cd battle-arena-game

# Install dependencies
npm install

# Start the game server
npm run server

# In another terminal, start the development client
npm run dev

# Open in your browser
http://localhost:3000
```

### How to Play
1. Enter your player name
2. Click "Find Match" to join a game
3. Battle 3v3 in real-time!
4. Defeat enemies and win!

## Game Controls
- **Move:** Arrow keys or WASD
- **Attack:** Left Click / Space
- **Special Ability:** E or Right Click
- **Menu:** ESC

## Game Modes
- 🎯 **Deathmatch** - Last team standing wins
- 💎 **Gem Collector** - Collect gems to score points
- 👑 **King of the Hill** - Control the center zone
- ⚔️ **Capture the Flag** - Strategic team play

## Characters (Original Heroes)
- **Blaze** - Fire warrior, area damage specialist
- **Frost** - Ice mage, crowd control
- **Nova** - Speedster, high mobility
- **Titan** - Tank, high health and defense
- **Shadow** - Assassin, high burst damage

## Tech Stack
- **Frontend:** Phaser 3 (Game Engine), React (UI)
- **Backend:** Node.js + Express
- **Real-time:** Socket.io
- **Database:** MongoDB (for rankings)
- **Hosting:** Heroku / AWS

## Project Structure
```
battle-arena-game/
├── client/              # React + Phaser game client
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              # Node.js game server
│   ├── routes/
│   ├── models/
│   ├── socket/
│   └── package.json
├── assets/              # Game sprites, sounds, maps
└── README.md
```

## Multiplayer Features
- ✅ Real-time matchmaking
- ✅ Live player chat
- ✅ Leaderboards
- ✅ Custom game rooms
- ✅ Friend invites

## Development
```bash
# Run tests
npm run test

# Build for production
npm run build

# Deploy to Heroku
git push heroku main
```

## Contributing
We welcome contributions! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve game balance

## License
MIT License - Free to use and modify

## Troubleshooting

**Can't connect to server?**
- Make sure the server is running: `npm run server`
- Check if port 5000 is available
- Try http://localhost:3000 instead

**Game is lagging?**
- Check your internet connection
- Close other applications
- Refresh the page

**Character not responding?**
- Check if server is connected (look for green indicator)
- Try rejoining the match

---

**🎮 Ready to play? Start now and have fun!**

For questions or support, open an issue on [GitHub](https://github.com/skrsonline-shrish/battle-arena-game/issues)
