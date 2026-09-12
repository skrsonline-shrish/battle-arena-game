import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.players = {};
    this.projectiles = [];
    this.map = null;
    this.localPlayer = null;
    this.socket = null;
    this.matchData = null;
  }

  init(data) {
    this.socket = data.socket;
    this.matchData = data.matchData;
    this.playerData = data.playerData;
  }

  create() {
    // Create map
    this.createMap();

    // Create local player
    this.createLocalPlayer();

    // Create input
    this.createInput();

    // Set up socket events
    this.setupSocketEvents();

    // Create UI
    this.createUI();

    // Start game loop
    this.gameStarted = true;
  }

  createMap() {
    const width = 800;
    const height = 600;

    // Create background
    this.add.rectangle(width / 2, height / 2, width, height, 0x2a5298);

    // Create center obstacle
    this.add.rectangle(400, 300, 80, 80, 0x666666);

    // Add text
    this.add.text(10, 10, 'Arena Battle', { font: '20px Arial', fill: '#fff' });
  }

  createLocalPlayer() {
    const team = this.matchData.team;
    const spawn = team === 1 ? { x: 100, y: 300 } : { x: 700, y: 300 };

    this.localPlayer = this.add.circle(spawn.x, spawn.y, 20, 0xff0000);
    this.localPlayer.setData('health', 100);
    this.localPlayer.setData('maxHealth', 100);
    this.localPlayer.setData('name', this.playerData.name);
    this.localPlayer.setData('team', team);
    this.localPlayer.setData('playerId', this.playerData.id);

    // Add player label
    const nameText = this.add.text(spawn.x - 30, spawn.y - 30, this.playerData.name, {
      font: '12px Arial',
      fill: '#fff'
    });
    this.localPlayer.nameText = nameText;

    // Create physics body
    this.physics.add.existing(this.localPlayer);
    this.localPlayer.body.setCollideWorldBounds(true);
    this.localPlayer.body.setBounce(0.2);

    this.cameras.main.startFollow(this.localPlayer);
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.input.on('pointerdown', (pointer) => {
      this.handleAttack(pointer);
    });
  }

  setupSocketEvents() {
    this.socket.on('playerMoved', (data) => {
      if (data.playerId !== this.playerData.id) {
        this.updatePlayerPosition(data.playerId, data.position);
      }
    });

    this.socket.on('playerAttacked', (data) => {
      this.displayAttack(data);
    });

    this.socket.on('playerKilled', (data) => {
      this.displayKill(data);
    });

    this.socket.on('matchEnded', (data) => {
      this.endGame(data);
    });
  }

  createUI() {
    // Health bar
    this.healthBarBg = this.add.rectangle(100, 30, 200, 20, 0x333333);
    this.healthBarBg.setScrollFactor(0);
    this.healthBar = this.add.rectangle(100, 30, 200, 20, 0x00ff00);
    this.healthBar.setScrollFactor(0);

    // Health text
    this.healthText = this.add.text(10, 10, 'Health: 100/100', {
      font: '14px Arial',
      fill: '#fff'
    });
    this.healthText.setScrollFactor(0);

    // Minimap
    this.minimapBg = this.add.rectangle(750, 50, 100, 100, 0x333333);
    this.minimapBg.setScrollFactor(0);
  }

  handleAttack(pointer) {
    if (!this.localPlayer) return;

    const damage = 10;
    this.socket.emit('playerAttack', {
      targetId: this.findTargetAtPointer(pointer),
      position: { x: pointer.worldX, y: pointer.worldY },
      damage: damage,
      targetHealth: 100 - damage
    });
  }

  findTargetAtPointer(pointer) {
    // Simple target detection - in a real game, you'd check distance/collision
    return null;
  }

  updatePlayerPosition(playerId, position) {
    // Update other players' positions
    if (this.players[playerId]) {
      this.tweens.add({
        targets: this.players[playerId],
        x: position.x,
        y: position.y,
        duration: 100
      });
    }
  }

  displayAttack(data) {
    const text = this.add.text(
      data.position.x,
      data.position.y,
      `-${data.damage}`,
      { font: '16px Arial', fill: '#ff0000' }
    );
    this.tweens.add({
      targets: text,
      y: data.position.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });
  }

  displayKill(data) {
    console.log('Player killed:', data.targetId);
  }

  endGame(data) {
    this.scene.stop();
  }

  update() {
    if (!this.localPlayer) return;

    // Handle movement
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.up.isDown) velocityY = -300;
    if (this.keys.down.isDown) velocityY = 300;
    if (this.keys.left.isDown) velocityX = -300;
    if (this.keys.right.isDown) velocityX = 300;

    this.localPlayer.body.setVelocity(velocityX, velocityY);

    // Update position on server
    if (velocityX !== 0 || velocityY !== 0) {
      this.socket.emit('playerMove', {
        position: { x: this.localPlayer.x, y: this.localPlayer.y }
      });
    }

    // Update UI
    this.updateUI();
  }

  updateUI() {
    const health = this.localPlayer.getData('health');
    const maxHealth = this.localPlayer.getData('maxHealth');
    this.healthText.setText(`Health: ${health}/${maxHealth}`);
    this.healthBar.width = (health / maxHealth) * 200;
  }
}

export default GameScene;
