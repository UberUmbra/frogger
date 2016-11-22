const JUMP_TIME = 0.2;
const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;
const SCREEN_SIZE = 505;

var AnimatedSprite = function(x, y, sprite) {
    this.x= x ? x : 0;
    this.y= y ? y : 0;
    this.sprite = sprite;
};

AnimatedSprite.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(startY) {
    AnimatedSprite.call(this, Math.random()*400, startY, 'images/enemy-bug.png');
    this.startY = startY;
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

var Player = function() {
    AnimatedSprite.call(this, 200, 300, 'images/char-pink-girl.png');
    this.gridX=2;
    this.gridY=5;
    this.x = this.getCellX(this.gridX);
    this.y = this.getCellY(this.gridY);
    this.update = jumpInPlace(this.x, this.y).bind(this);
};

function jumpHorizontally(fromX, toX, y, height, whenDone) {
    var velocity = (toX - fromX) / JUMP_TIME;
    var distance = Math.abs(toX - fromX);
    var maxVerticalSpeed = distance*distance/4;
    var offsetX = 0;
    return function update(dt) {
        this.jumping = true;
        offsetX += (velocity * dt);
        this.x = fromX + offsetX;
        var verticalSpeed = Math.abs(distance/2 - Math.abs(offsetX));
        this.y = y - height + (Math.abs(verticalSpeed*verticalSpeed) / maxVerticalSpeed)*height;
        if(Math.abs(offsetX) > distance) {
            this.x = toX;
            this.y = y;
            this.jumping = false;
            whenDone();
        }
    }
}

function jumpVertically(x, fromY, toY, height, whenDone) {
    var velocity = (toY - fromY) / JUMP_TIME;
    var distance = Math.abs(toY - fromY);
    var maxVerticalSpeed = distance*distance/4;
    var offsetY = 0;
    return function update(dt) {
        this.jumping = true;
        offsetY += (velocity * dt);
        this.x = x;
        var verticalSpeed = Math.abs(distance/2 - Math.abs(offsetY));
        this.y = fromY + offsetY - height + (Math.abs(verticalSpeed*verticalSpeed) / maxVerticalSpeed)*height;
        if(Math.abs(offsetY) > distance) {
            this.y = toY;
            this.jumping = false;
            whenDone();
        }
    }
}

function jumpInPlace(x, y) {
    var jumpX = 0;
    var jumpY = 0;
    var jumpVelocity = -50;
    var positionX = x;
    var positionY = y;
    return function update(dt) {
        jumpX += jumpVelocity * dt;
        if (jumpX < 0 ) {
            jumpVelocity = -jumpVelocity;
            jumpX = 0;
        } else if(jumpX>14) {
            jumpVelocity = -jumpVelocity;
            jumpX = 14;
        }
        var deltaX = jumpX - 7;
        jumpY = (Math.abs(deltaX) * Math.abs(deltaX)) / 10;
        this.x = positionX + deltaX;
        this.y = positionY + jumpY;
    }
}

Player.prototype = Object.create(AnimatedSprite.prototype);

Player.prototype.handleInput = function(direction) {
    if(!!this.jumping) return;
    switch(direction) {
        case 'left': {
            if(this.gridX>0) {
                this.jumpToCellHorizontally(-1);
            }
            break;
        }
        case 'right': {
            if(this.gridX<4) {
                this.jumpToCellHorizontally(+1);
            }
            break;
        }
        case 'down': {
            if(this.gridY<5) {
                this.jumpToCellVertically(1);
            }
            break;
        }
        case 'up': {
            if(this.gridY>0) {
                this.jumpToCellVertically(-1);
            }
            break;
        }
    }
};

Player.prototype.jumpToCellHorizontally = function (cellOffset) {
    var jumpToX = this.getCellX(this.gridX + cellOffset);
    var jumpToY = this.getCellY(this.gridY);
    this.update = jumpHorizontally(this.x, jumpToX, jumpToY, 50, function() {
        this.gridX += cellOffset;
        this.update = jumpInPlace(jumpToX, jumpToY).bind(this);
    }.bind(this));
};

Player.prototype.jumpToCellVertically = function (cellOffset) {
    var jumpToX = this.getCellX(this.gridX);
    var jumpToY = this.getCellY(this.gridY + cellOffset);
    this.update = jumpVertically(this.x, this.getCellY(this.gridY), jumpToY, 50, function() {
        this.gridY += cellOffset;
        this.update = jumpInPlace(jumpToX, jumpToY).bind(this);
    }.bind(this));
};

Player.prototype.getCellX = function(cellX){
    return cellX*CELL_WIDTH;
};

Player.prototype.getCellY = function(cellY){
    return cellY*CELL_HEIGHT - 40;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

allEnemies = [ new Enemy(50), new Enemy(135), new Enemy(220)];
player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
