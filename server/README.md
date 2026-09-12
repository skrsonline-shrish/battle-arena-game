# Battle Arena Game Server

Express.js + Socket.io server for the Battle Arena multiplayer game.

## Setup

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

### Start Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000` by default.

## Project Structure

```
server/
├── server.js              # Main server file
├── package.json
├── .env.example          # Environment template
├── config/
│   ├── characters.js     # Character definitions
│   └── maps.js          # Maps and game modes
├── models/
│   ├── Player.js        # Player data model
│   └── Match.js         # Match/game session model
└── utils/
    ├── matchmaker.js    # Matchmaking algorithm
    └── physics.js       # Game physics & collision
```

## Socket.io Events

### Client → Server
- `playerJoin` - Player joins the game
- `findMatch` - Search for a match
- `playerMove` - Update player position
- `playerAttack` - Attack another player
- `useAbility` - Use character ability
- `matchEnd` - End current match
- `chatMessage` - Send chat message
- `requestLeaderboard` - Get top players

### Server → Client
- `playerJoined` - New player joined
- `matchFound` - Match created
- `playerMoved` - Player position updated
- `playerAttacked` - Player attacked
- `abilityUsed` - Ability was used
- `playerKilled` - Player eliminated
- `matchEnded` - Match finished
- `newChatMessage` - Chat message received
- `leaderboard` - Top players list
- `playerDisconnected` - Player left

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/stats` - Server statistics

## Features

✅ Real-time multiplayer with Socket.io
✅ 5 unique characters with abilities
✅ 4 different game modes
✅ 3 unique arena maps
✅ Matchmaking system
✅ Player stats & leaderboards
✅ Physics & collision detection
✅ Team-based gameplay
✅ Chat system
✅ Power-ups on maps

## Characters

1. **Blaze** - Fire warrior, area damage
2. **Frost** - Ice mage, crowd control
3. **Nova** - Speedster, high mobility
4. **Titan** - Tank, high health
5. **Shadow** - Assassin, burst damage

## Game Modes

1. **Deathmatch** - Last team standing wins
2. **Gem Collector** - Collect 100 gems to win
3. **King of the Hill** - Control center zone
4. **Capture the Flag** - Capture enemy flag

## Troubleshooting

**Port already in use:**
```bash
# Change port in .env
PORT=5001
```

**Connection refused:**
- Make sure server is running on correct port
- Check firewall settings
- Verify CLIENT_URL in .env matches your client

**Players not matching:**
- Ensure at least 6 players in queue
- Check matchmaker logs
- Verify game mode and level balance

## Performance Tips

- Use connection pooling for databases
- Implement room-based socket namespaces
- Cache character and map data
- Use binary compression for large data

## Future Enhancements

- [ ] Database persistence (MongoDB)
- [ ] Player accounts & authentication
- [ ] Skill-based ranking system
- [ ] Custom game rooms
- [ ] Spectator mode
- [ ] Replay system
- [ ] Analytics dashboard
- [ ] Anti-cheat system

## Support

For issues or questions, open an issue on GitHub.
