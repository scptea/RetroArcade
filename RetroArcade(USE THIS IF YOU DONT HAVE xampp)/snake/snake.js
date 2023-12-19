/* The code is creating three objects: `Game`, `Keyboard`, and `Component`. If these objects already
exist, it assigns them to themselves (`Game = Game`) to avoid overwriting them. If they don't exist,
it assigns them to empty objects (`Game = {}`) so that they can be used later in the code. */
var Game = Game || {};
var Keyboard = Keyboard || {};
var Component = Component || {};

Keyboard.Keymap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};
/* The `Keyboard.ControllerEvents` function is creating an object that handles keyboard events. */

/* The `Keyboard.ControllerEvents` function is creating an object that handles keyboard events. */
Keyboard.ControllerEvents = function () {
  var self = this;
  this.pressKey = null;
  this.keymap = Keyboard.Keymap;

  document.onkeydown = function (event) {
    self.pressKey = event.which;
  };

  this.getKey = function () {
    return this.keymap[this.pressKey];
  };
};

/* The `Component.Stage` function is creating a new stage object for the snake game. It takes two
parameters: `canvas` and `conf`. */
Component.Stage = function (canvas, conf) {
  this.keyEvent = new Keyboard.ControllerEvents();
  this.width = canvas.width;
  this.height = canvas.height;
  this.length = [];
  this.food = {};
  this.score = 0;
  this.direction = 'right';
  this.conf = {
    cw: 20,
    size: 5,
    fps: 100
  };

  if (typeof conf === 'object') {
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) {
        this.conf[key] = conf[key];
      }
    }
  }
};

/* The `Component.Snake` function is creating a new snake object for the snake game. It takes two
parameters: `canvas` and `conf`. */
Component.Snake = function (canvas, conf) {
  this.stage = new Component.Stage(canvas, conf);

  this.initSnake = function () {
    this.stage.length = [];
    var middleX = Math.floor(this.stage.width / (2 * this.stage.conf.cw));
    var middleY = Math.floor(this.stage.height / (2 * this.stage.conf.cw));

    for (var i = this.stage.conf.size - 1; i >= 0; i--) {
      this.stage.length.push({ x: middleX + i, y: middleY });
    }
  };

  this.initSnake();

  this.initFood = function () {
    this.stage.food = {
      x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw),
      y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw),
    };
  };

  this.initFood();

  this.restart = function () {
    this.initSnake();
    this.initFood();
    this.stage.score = 0;
    this.stage.direction = 'right';
  };
};

/* The `Game.Draw` function is responsible for drawing the game stage and handling the game logic. It
takes two parameters: `context` (the canvas context) and `snake` (the snake object). */
Game.Draw = function (context, snake) {
  this.drawStage = function () {
    var keyPress = snake.stage.keyEvent.getKey();
    if (typeof (keyPress) !== 'undefined') {
      if (
        (keyPress === 'up' && snake.stage.direction !== 'down') ||
        (keyPress === 'down' && snake.stage.direction !== 'up') ||
        (keyPress === 'left' && snake.stage.direction !== 'right') ||
        (keyPress === 'right' && snake.stage.direction !== 'left')
      ) {
        snake.stage.direction = keyPress;
      }
    }

    context.fillStyle = "#211a35";
    context.fillRect(0, 0, snake.stage.width, snake.stage.height);

    var nx = snake.stage.length[0].x;
    var ny = snake.stage.length[0].y;

    switch (snake.stage.direction) {
      case 'right':
        nx++;
        break;
      case 'left':
        nx--;
        break;
      case 'up':
        ny--;
        break;
      case 'down':
        ny++;
        break;
    }

    if (this.collision(nx, ny) || this.selfCollision(nx, ny)) {
      snake.restart();
      document.getElementById('loseSound').play(); // Play lose sound
      alert('Game Over! Your Score: ' + snake.stage.score);
      gameRunning = false;
      return;
    }

    if (nx === snake.stage.food.x && ny === snake.stage.food.y) {
      var tail = { x: nx, y: ny };
      snake.stage.score++;
      snake.initFood();
      document.getElementById('eatSound').play(); // Play eat sound
    } else {
      var tail = snake.stage.length.pop();
      tail.x = nx;
      tail.y = ny;
    }
    snake.stage.length.unshift(tail);

    for (var i = 0; i < snake.stage.length.length; i++) {
      var cell = snake.stage.length[i];
      this.drawCircle(cell.x, cell.y);
    }

    this.drawCircle(snake.stage.food.x, snake.stage.food.y, true);

    document.getElementById('score').innerHTML = 'Score: ' + snake.stage.score;
    
  };


  this.drawCircle = function (x, y, isFood) {
    var radius = snake.stage.conf.cw / 2;
    var centerX = x * snake.stage.conf.cw + radius;
    var centerY = y * snake.stage.conf.cw + radius;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = isFood ? '#FF0000' : '#fff';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = isFood ? '#FF0000' : '#211a35';
    context.stroke();
  };

  this.collision = function (nx, ny) {
    return nx === -1 || nx === (snake.stage.width / snake.stage.conf.cw) || ny === -1 || ny === (snake.stage.height / snake.stage.conf.cw);
  };

  this.selfCollision = function (nx, ny) {
    for (var i = 0; i < snake.stage.length.length; i++) {
      if (snake.stage.length[i].x === nx && snake.stage.length[i].y === ny) {
        return true;
      }
    }
    return false;
  };
};

/* The `Game.Snake` function is responsible for initializing and starting the snake game. It takes two
parameters: `elementId` (the id of the canvas element where the game will be displayed) and `conf`
(an optional configuration object for the game). */
Game.Snake = function (elementId, conf) {
  var canvas = document.getElementById(elementId);
  var context = canvas.getContext("2d");
  var snake = new Component.Snake(canvas, conf);
  var gameDraw = new Game.Draw(context, snake);

  var gameRunning = false;

  window.startGame = function () {
    if (!gameRunning) {
      snake.restart();
      gameRunning = true;
      setInterval(function () { gameDraw.drawStage(); }, snake.stage.conf.fps);
    }
  };
};

/* The `window.onload` event is triggered when the webpage has finished loading. In this code, it is
used to wait for the webpage to load before initializing and starting the snake game. */
window.onload = function () {
  var snake = new Game.Snake('stage', { fps: 100, size: 4 });
};