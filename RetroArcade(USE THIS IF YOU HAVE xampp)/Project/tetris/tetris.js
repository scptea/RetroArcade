/* The code `let AllLinesOut=0; let isPaused=false;` is declaring and initializing two variables. */
let AllLinesOut=0;
let isPaused=false;

/**
 * The getRandomInt function returns a random integer between a minimum and maximum value.
 * @param min - The minimum value that the random integer can be.
 * @param max - The maximum value that the random integer can be.
 * @returns a random integer between the minimum and maximum values provided as arguments.
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * The function generates a random sequence of tetromino names by shuffling an initial sequence.
 */
function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

// get the next tetromino in the sequence
/**
 * The function `getNextTetromino` returns the next tetromino piece to be used in a game, including its
 * name, matrix, row, and column.
 * @returns an object with the following properties:
 * - name: the name of the tetromino piece (L, O, etc.)
 * - matrix: the current rotation matrix for the tetromino
 * - row: the current row position of the tetromino (starts offscreen)
 * - col: the current column position of the tetromino
 */
function getNextTetromino() {
  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const name = tetrominoSequence.pop();
  const matrix = tetrominos[name];

  // I and O start centered, all others start in left-middle
  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  // I starts on row 21 (-1), all others start on row 22 (-2)
  const row = name === 'I' ? -1 : -2;

  return {
    name: name,      // name of the piece (L, O, etc.)
    matrix: matrix,  // the current rotation matrix
    row: row,        // current row (starts offscreen)
    col: col         // current col
  };
}


/**
 * The `rotate` function takes a matrix as input and returns a new matrix that is rotated 90 degrees
 * clockwise.
 * @param matrix - The parameter `matrix` is a two-dimensional array representing a square matrix. Each
 * element in the matrix represents a value at a specific row and column position.
 * @returns a rotated version of the input matrix.
 */
function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}

// check to see if the new matrix/row/col is valid
function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] && (
          // outside the game bounds
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          // collides with another piece
          playfield[cellRow + row][cellCol + col])
        ) {
        return false;
      }
    }
  }

  return true;
}

// place the tetromino on the playfield
/**
 * The function "placeTetromino" places a tetromino on the playfield, checks for line clears, and
 * updates the next tetromino.
 * @returns the result of the `showGameOver()` function if any part of the tetromino is offscreen.
 * Otherwise, it does not explicitly return anything.
 */
function placeTetromino() {
  let linesOut=0;
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {

        // game over if piece has any part offscreen
        if (tetromino.row + row < 0) {
          return showGameOver();
        }

        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
  }

  // check for line clears starting from the bottom and working our way up
  for (let row = playfield.length - 1; row >= 0; ) {
    if (playfield[row].every(cell => !!cell)) {

      // drop every row above this one
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r-1][c];
        }
      }
      linesOut++;
      //console.log('linesOut++');
    }
    else {
      row--;
    }
  }

  if(linesOut>0)
   {
    //alert(linesOut);
    AllLinesOut+=linesOut;
    document.getElementById('AllLinesOut').innerHTML='LinesOut: '+AllLinesOut;
   }

  tetromino = tetrominoNext;
  tetrominoNext = getNextTetromino();
  document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
}

// show the game over screen
/**
 * The function "showGameOver" displays a game over message on the canvas and prompts the player to
 * enter their name.
 */
function showGameOver() {
  cancelAnimationFrame(rAF);
  gameOver = true;

  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 90);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
  context.fillText('Lines: '+AllLinesOut, canvas.width / 2, canvas.height / 2+40);

  var PlayerName=prompt('Your Result: "'+AllLinesOut+'", name:', 'Player1');
}

/* These lines of code are initializing variables and creating an empty playfield for the game. */
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];


const playfield = [];

/* The code is initializing the `playfield` array, which represents the game board. */
for (let row = -2; row < 20; row++) {
  playfield[row] = [];

  for (let col = 0; col < 10; col++) {
    playfield[row][col] = 0;
  }
}


/* The above code is defining a JavaScript object called `tetrominos`. This object contains the shapes
of different Tetris pieces, represented as 2D arrays of 0s and 1s. Each key in the object represents
a different Tetris piece, and the corresponding value is the shape of that piece. */
const tetrominos = {
  'I': [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  'J': [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
  'L': [
    [0,0,1],
    [1,1,1],
    [0,0,0],
  ],
  'O': [
    [1,1],
    [1,1],
  ],
  'S': [
    [0,1,1],
    [1,1,0],
    [0,0,0],
  ],
  'Z': [
    [1,1,0],
    [0,1,1],
    [0,0,0],
  ],
  'T': [
    [0,1,0],
    [1,1,1],
    [0,0,0],
  ]
};

// color of each tetromino
const colors = {
  'I': 'maroon',
  'O': 'navy',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'teal'
};

let count = 0;
let tetrominoNext = getNextTetromino();
document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
let tetromino     = getNextTetromino();
let rAF = null;  // keep track of the animation frame so we can cancel it
let gameOver = false;

// game loop
/**
 * The function `loop` is responsible for continuously updating and rendering the game state, including
 * the playfield and the active tetromino.
 * @returns The function does not explicitly return a value.
 */
function loop() {
  window.status=isPaused;
  if(isPaused) { return; }
  rAF = requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);

  // draw the playfield
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        // drawing 1 px smaller than the grid creates a grid effect
        context.fillRect(col * grid, row * grid, grid-1, grid-1);
      }
    }
  }

  // draw the active tetromino
  if (tetromino) {

    // tetromino falls every 35 frames
    if (++count > 35) {
      tetromino.row++;
      count = 0;

      // place piece if it runs into anything
      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          // drawing 1 px smaller than the grid creates a grid effect
          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
        }
      }
    }
  }
}

// listen to keyboard events to move the active tetromino
/* The above code is adding an event listener to the document for the 'keydown' event. When a key is
pressed, the code checks which key was pressed and performs different actions based on the key code. */
document.addEventListener('keydown', function(e) {
  if (gameOver) return;

  // left and right arrow keys (move)
  if (e.which === 37 || e.which === 39) {
    const col = e.which === 37
      ? tetromino.col - 1
      : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }

  // up arrow key (rotate)
  if (e.which === 38) {
    const matrix = rotate(tetromino.matrix);
    if (isValidMove(matrix, tetromino.row, tetromino.col)) {
      tetromino.matrix = matrix;
    }
  }

  // down arrow key (drop)
  if(e.which === 40) {
     downOne();
  }

  
  // space key (fast drop)
  if(e.which === 32) {
     while(!downOne()){
     }
  }
  if(e.which === 'I'.charCodeAt()) {
     while(tetrominoNext.name!='I'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }
  if(e.which === 'J'.charCodeAt()) {
     while(tetrominoNext.name!='J'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }
  if(e.which === 'L'.charCodeAt()) {
     while(tetrominoNext.name!='L'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }
  if(e.which === 'O'.charCodeAt()) {
     while(tetrominoNext.name!='O'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }
  if(e.which === 'S'.charCodeAt()) {
     while(tetrominoNext.name!='S'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }
  if(e.which === 'T'.charCodeAt()) {
     while(tetrominoNext.name!='T'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }
  if(e.which === 'Z'.charCodeAt()) {
     while(tetrominoNext.name!='Z'){
        tetrominoNext = getNextTetromino();
       }
     document.getElementById('nextFigureDIV').innerHTML='NextFigure: '+tetrominoNext.name;
  }

  if((e.which === 27)||(e.which === 13)) {
    isPaused=!isPaused;
    //alert('"Pause". Press "Ok" for continue.');
  }
  //alert('"keyDownCode:="'+e.which);
});

/**
 * The function moves a tetromino down one row if it is a valid move, otherwise it places the tetromino
 * and returns true.
 * @returns a boolean value. If the move is valid and the tetromino can be moved down one row, the
 * function returns false. If the move is not valid and the tetromino cannot be moved down, the
 * function returns true.
 */
function downOne()
  {
   const row = tetromino.row + 1;
   if (!isValidMove(tetromino.matrix, row, tetromino.col))
     {
      tetromino.row = row - 1;

      placeTetromino();
      return true;
     }
   tetromino.row = row;
   return false;
  }


/**
 * The restartGame function resets the game state, clears the playfield, generates a new tetromino
 * sequence, and starts the game loop.
 */
function restartGame()
 {
  cancelAnimationFrame(rAF);  // Cancel the current animation frame
  gameOver = false;            // Set the game over flag to false

  for (let row = -2; row < playfield.length; row++) {
    for (let col = 0; col < playfield[row].length; col++) {
      playfield[row][col] = 0;
    }
  }


  tetrominoSequence.length = 0;
  tetromino = getNextTetromino();

  rAF = requestAnimationFrame(loop);
 }
document.getElementById('restartButton').addEventListener('click', restartGame);

rAF = requestAnimationFrame(loop);