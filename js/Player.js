var Player = function(sounds) {
    this.sounds = sounds;
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
    this.playJumpSound();
    this.update = jumpHorizontally(this.x, jumpToX, jumpToY, 50, function() {
        this.gridX += cellOffset;
        this.update = jumpInPlace(jumpToX, jumpToY).bind(this);
    }.bind(this));
};

Player.prototype.playJumpSound = function () {
    this.sounds.jumpSounds[Math.floor(Math.random()*3)].play();
};

Player.prototype.jumpToCellVertically = function (cellOffset) {
    var jumpToX = this.getCellX(this.gridX);
    var jumpToY = this.getCellY(this.gridY + cellOffset);
    this.playJumpSound();
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