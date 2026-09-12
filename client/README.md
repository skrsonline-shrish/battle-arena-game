# Battle Arena Game Client

React + Phaser 3 game client for the Battle Arena multiplayer game.

## Setup

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file in the client directory:
```bash
cp .env.example .env
```

Edit `.env` to match your server URL:
```
REACT_APP_SERVER_URL=http://localhost:5000
```

### Start Development Server
```bash
npm start
```

The game will open at `http://localhost:3000`

## Project Structure

```
client/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── App.js              # Main app component
│   ├── App.css             # Main styles
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   ├── components/
│   │   ├── MainMenu.js     # Start screen
│   │   ├── MainMenu.css
│   │   ├── CharacterSelect.js  # Character selection
│   │   ├── CharacterSelect.css
│   │   ├── Matchmaking.js      # Queue/matchmaking
│   │   ├── Matchmaking.css
│   │   ├── GameBoard.js        # Game canvas
│   │   ├── GameBoard.css
│   │   ├── Leaderboard.js      # Top players
│   │   └── Leaderboard.css
│   └── scenes/
│       └── GameScene.js    # Phaser game scene
├── package.json
└── .env.example
```

## Game Screens

### 1. Main Menu
- Display game title and features
- Start game button
- Show game statistics

### 2. Character Selection
- Choose from 5 unique characters
- Enter player name
- View character stats and abilities
- See character rarity (Common, Rare, Legendary)

### 3. Matchmaking
- Select game mode
- Search for players
- View queue status
- Wait for match to be found

### 4. Game Board
- Real-time gameplay canvas
- Health bar and stats display
- Team scores
- Match timer
- Player movement and combat

### 5. Leaderboard
- Top 10 players ranking
- Player stats (kills, deaths, score)
- Character display
- Sort by score

## Game Controls

**Movement:**
- W / A / S / D - Move up/left/down/right
- Arrow Keys - Alternative movement

**Actions:**
- Mouse Click - Attack in direction
- Space - Use ability (if available)
- E - Interact with objects

## Features

✅ Real-time multiplayer gameplay
✅ 5 unique playable characters
✅ Smooth animations and transitions
✅ Responsive UI design
✅ Live player movement sync
✅ Character selection screen
✅ Team-based matchmaking
✅ Player leaderboard
✅ Health & damage visualization
✅ Game statistics tracking

## Characters Overview

| Character | HP | Attack | Speed | Ability | Rarity |
|-----------|----|---------|----|---------|--------|
| Blaze | 100 | 15 | 5 | Inferno | Common |
| Frost | 80 | 12 | 6 | Ice Shards | Common |
| Nova | 70 | 14 | 8 | Dash | Rare |
| Titan | 150 | 18 | 3 | Shield | Rare |
| Shadow | 85 | 20 | 7 | Vanish | Legendary |

## Socket.io Connection

The client automatically connects to the server defined in `.env`.

**Connection Events:**
- `playerJoined` - Receive when player joins
- `matchFound` - Match ready to start
- `waitingForPlayers` - Still queuing
- `playerMoved` - Other player movement
- `playerAttacked` - Attack event
- `playerKilled` - Death notification
- `matchEnded` - Game over
- `leaderboard` - Top players list

## Styling

The game uses a modern dark theme with:
- Gradient backgrounds
- Glassmorphism UI elements
- Smooth animations
- Color-coded elements (health, damage, abilities)
- Responsive design for mobile

## Performance Optimization

- Lazy loading of components
- Optimized re-renders with React.memo
- Efficient socket event handlers
- Compressed asset delivery
- Canvas rendering for game

## Troubleshooting

**Server connection failed:**
- Check `REACT_APP_SERVER_URL` in `.env`
- Ensure server is running on correct port
- Check CORS settings on server
- Verify firewall allows connections

**Game not loading:**
- Clear browser cache
- Check browser console for errors
- Ensure Phaser 3 is installed
- Try different browser

**Characters not displaying:**
- Verify character data in server
- Check Socket.io connection
- Reload the page

**Matchmaking stuck:**
- Need at least 6 players in queue
- Check server matchmaker logs
- Try canceling and searching again

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Features

- [ ] Spectator mode
- [ ] Custom game rooms
- [ ] Player profiles
- [ ] Achievement system
- [ ] Cosmetics & skins
- [ ] Replay system
- [ ] Voice chat
- [ ] Mobile app version

## Support

For issues or feature requests, open an issue on GitHub.
