// The player's starting position and size of steps on each axis (constants)
var PLAYERSTARTINGX = 201;
var PLAYERSTARTINGY = 400;
var STEPX = 101;
var STEPY = 84;

// The player's starting score
var playerScore = 0;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Calculated enemy speed. Math.random() returns a floating point value
// (decimal) between 0-1, this is then multiplied by 7, and 1 is added
// to prevent edge-cases which make the enemy crawl across the canvas
// too slowly. This is then multiplied by 80.
Enemy.prototype.enemySpeed = function() {
    this.speed = (Math.random() * 7 + 1) * 80;
};

// Parameter: dt, a time delta between ticks is used to ensure the enemies
// run at the same speed for all computers.
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    // When an enemy disappears off the screen, reset enemy to starting
    // position and recalcuate enemy speed.
    if (this.x > 550) {
       this.x = -80;
       this.enemySpeed();
    }

    // Calculates the enemy dimensions (runs large for smoother gameplay)
    var enemyDimensions = {
       left : this.x - 75,
       right : this.x + 75,
       top : this.y - 75,
       bottom : this.y + 75
     };

   // Resets player to starting position when it runs into (shares the
   // same coordinates with) an enemy.
   if (player.x > enemyDimensions.left &&
       player.x < enemyDimensions.right &&
       player.y > enemyDimensions.top &&
       player.y < enemyDimensions.bottom) {
         player.resetPosition();
         // If the player's score is currently zero, does nothing
         if (playerScore === 0) {
            return null;
         }
         // If the player's score is currently more than zero, -1
         else {
            playerScore--;
            console.log(playerScore);
         }
   }
};

// Draws enemy on the game canvas in its starting position
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = PLAYERSTARTINGX;
    this.y = PLAYERSTARTINGY;
};

Player.prototype.update = function(dt) {
};

// Draws player on the game canvas in its starting position
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Resets player to starting position after reaching water/hitting enemy
Player.prototype.resetPosition = function() {
    this.x = PLAYERSTARTINGX;
    this.y = PLAYERSTARTINGY;
};

// Handles keyboard key presses (left, right, up, and down arrows) -
// returns null if player attempts to step out of game canvas.
Player.prototype.handleInput = function(keyPress) {
    if (keyPress === 'left') {
      if (this.x < 100) {
        return null;
      }
      this.x -= STEPX;
    }
    else if (keyPress === 'right') {
      if (this.x > 402) {
        return null;
      }
      this.x += STEPX;
    }
    else if (keyPress === 'up') {
      if (this.y < 100) {
        this.resetPosition();
        // +1 to player's score for reaching the water
        playerScore = playerScore + 3;
        console.log(playerScore);
      }
      this.y -= STEPY;
    }
    else if (keyPress === 'down') {
      if (this.y >= 400) {
        return null;
      }
      this.y += STEPY;
    }
    else {
      return null;
    }
};

var allEnemies = [];

for (var i = 0; i < 3; i++) {
    // Enemy starting speed, identical to Enemy.prototype.enemySpeed
    var enemyStartingSpeed = (Math.random() * 7 + 1) * 80;
    // Enemy starting position on x-axis, y-axis, and starting speed
    allEnemies.push(new Enemy(-80, 84 * i + 60, enemyStartingSpeed));
}

// Stars
var Star = function(x, y) {
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
};

var allStars = [];

for (var i = 0; i < 3; i++) {
    // Randomly places a star on one of the five stone blocks on each row
    var j = Math.floor(Math.random() * (4 - 0 + 1));
    allStars.push(new Star(101 * j, 85 * i + 70));
}

Star.prototype.update = function(dt) {
    // Calculates the star dimensions (runs large for smoother gameplay)
    var starDimensions = {
       left : this.x - 75,
       right : this.x + 75,
       top : this.y - 75,
       bottom : this.y + 75
     };

   if (player.x > starDimensions.left &&
       player.x < starDimensions.right &&
       player.y > starDimensions.top &&
       player.y < starDimensions.bottom) {
         this.x = -100;
         this.y = -100;
         playerScore++;
         console.log(playerScore);
   }
};

// Draws stars on the game canvas
Star.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Calls the Player function
var player = new Player();

// Listens for key presses and sends keys to the Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
