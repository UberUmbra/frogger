
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

function Game(sounds) {
    this.sounds = sounds;
    this.allEnemies=[];
    this.player={};
    this.youWinSprite = new AnimatedSprite(60,140, 'images/YouWin.png');
    this.youLooseALifeSprites = [
        new AnimatedSprite(10, 125, 'images/WatchOut.png'),
        new AnimatedSprite(20, 125, 'images/LooseALife.png'),
        new AnimatedSprite(10, 125, 'images/avoidBugs.png')
    ];
    this.gameOverSprite = new AnimatedSprite(15,140, 'images/GameOver.png');

    this.reset();

    var roundEndSoundListener = function() {
        this.reset();
        this.sounds.music.play();
    }.bind(this);

    this.startGameKeyListener = function() {
        document.removeEventListener('keyup', this.startGameKeyListener);
        this.reset();
        this.sounds.music.play();
    }.bind(this);

    var gameOverSoundListener = function() {
        document.addEventListener('keyup', this.startGameKeyListener)
    }.bind(this);

    sounds.roundWinSound.addEventListener('ended', roundEndSoundListener);
    sounds.roundLooseSound.addEventListener('ended', roundEndSoundListener);
    sounds.gameOverSound.addEventListener('ended', gameOverSoundListener);


    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        if(!this.roundEnded) {
            this.player.handleInput(allowedKeys[e.keyCode]);
        }
    }.bind(this));
}

Game.prototype.reset = function() {
    this.roundEnded = false;
    this.message = null;
    if(!this.lives) this.lives = 3;
    this.allEnemies = [ new Enemy(1), new Enemy(2), new Enemy(3)];
    this.player = new Player(this.sounds);
};

Game.prototype.roundWin = function() {
    this.roundEnded = true;
    this.message = this.youWinSprite;
    this.allEnemies = [];
    this.sounds.music.pause();
    this.sounds.roundWinSound.play();
};

Game.prototype.roundLoose = function() {
    this.roundEnded = true;
    this.lives--;
    this.sounds.music.pause();
    if(this.lives==0) {
        this.sounds.music.currentTime = 0;
        this.allEnemies = [];
        this.player.y = -500;
        this.message = this.gameOverSprite;
        this.sounds.gameOverSound.play();
    } else {
        this.message = this.youLooseALifeSprites[Math.floor(Math.random()*3)];
        this.sounds.roundLooseSound.play();
    }
};

/* This is called by the update function and loops through all of the
 * objects within your allEnemies array as defined in app.js and calls
 * their update() methods. It will then call the update function for your
 * player object. These update methods should focus purely on updating
 * the data/properties related to the object. Do your drawing in your
 * render methods.
 */
Game.prototype.update = function (dt) {
    if(!this.roundEnded) {
        this.allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        this.player.update(dt);

        this.checkCollisions();
    }
};

Game.prototype.checkCollisions = function() {
    var player = this.player;
    if(player.gridX == 2 && player.gridY == 0) {
        this.roundWin();
    } else {
        this.allEnemies.some(function(bug) {
            if(((bug.x + BUG_WIDTH) > player.x && bug.x < player.x + PLAYER_WIDTH) &&
                player.gridY == bug.gridY) {
                this.roundLoose();
            }
        }.bind(this))
    }
};

Game.prototype.render = function() {
    this.allEnemies.forEach(function(enemy) {
        enemy.render();
    });

    this.player.render();

    if(this.roundEnded) {
        if(this.message) {
            this.message.render();
        }
    }
};