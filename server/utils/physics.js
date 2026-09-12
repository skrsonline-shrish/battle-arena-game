// Game physics and collision detection
class Physics {
  static checkCollision(obj1, obj2) {
    const minDistance = (obj1.radius || 20) + (obj2.radius || 20);
    const distance = this.getDistance(obj1.position, obj2.position);
    return distance < minDistance;
  }

  static getDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static isInRange(pos1, pos2, range) {
    return this.getDistance(pos1, pos2) <= range;
  }

  static checkMapBounds(position, mapWidth, mapHeight) {
    return (
      position.x >= 0 &&
      position.x <= mapWidth &&
      position.y >= 0 &&
      position.y <= mapHeight
    );
  }

  static clampPosition(position, mapWidth, mapHeight) {
    return {
      x: Math.max(0, Math.min(position.x, mapWidth)),
      y: Math.max(0, Math.min(position.y, mapHeight))
    };
  }

  static calculateDamage(baseDamage, critChance = 0.1) {
    const isCrit = Math.random() < critChance;
    return isCrit ? baseDamage * 1.5 : baseDamage;
  }

  static getAngle(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.atan2(dy, dx);
  }

  static getVelocity(angle, speed) {
    return {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };
  }

  static checkObstacleCollision(position, obstacles) {
    for (let obstacle of obstacles) {
      if (
        position.x >= obstacle.x &&
        position.x <= obstacle.x + obstacle.width &&
        position.y >= obstacle.y &&
        position.y <= obstacle.y + obstacle.height
      ) {
        return obstacle;
      }
    }
    return null;
  }

  static interpolatePosition(oldPos, newPos, alpha = 0.5) {
    return {
      x: oldPos.x + (newPos.x - oldPos.x) * alpha,
      y: oldPos.y + (newPos.y - oldPos.y) * alpha
    };
  }
}

module.exports = Physics;
