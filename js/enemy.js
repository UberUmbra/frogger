
// Enemies our player must avoid
var Enemy = function(gridStartY) {
    this.gridY = gridStartY;
    this.startY = this.gridY*CELL_HEIGHT - 30;
    AnimatedSprite.call(this, Math.random()*400, this.startY, 'images/enemy-bug.png');
    this.velocity = Math.random()*150;
};

Enemy.prototype = Object.create(AnimatedSprite.prototype);
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += Math.ceil(this.velocity * dt);

    if(this.x> SCREEN_SIZE) this.x = -100;
    this.y = this.startY + this.x%10 / 5;
};