/* These lines of code are declaring and initializing variables and constants used in the game. */
let turn = "X";
let gameEnded = false;
const cells = document.querySelectorAll(".cell");
const turnElement = document.querySelector("#turn span");
const resetButton = document.getElementById("reset-button");
const prevButton = document.getElementById("previous-button");

// Winning combinations
/* The `winCombos` constant is an array of arrays that represents all the possible winning combinations
in a tic-tac-toe game. Each inner array contains three numbers that represent the indices of the
cells on the game board that need to be filled with the same symbol (X or O) in order to win the
game. For example, the first inner array `[0, 1, 2]` represents the top row of the game board, where
the cells with indices 0, 1, and 2 need to be filled with the same symbol to win. */
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Initialize the game
/**
 * The function "startGame" initializes a game by setting the initial turn to "X", resetting the game
 * state, and adding event listeners to each cell.
 */
function startGame() {
    turn = "X";
    gameEnded = false;
    turnElement.innerText = turn;
    cells.forEach(cell => {
        cell.innerText = "";
        cell.style.backgroundColor = "beige";
        cell.addEventListener("click", cellClicked);
        cell.addEventListener("keydown", cellKeydown);
        cell.tabIndex = 0; // Make the cell focusable
    });
}

// Handle cell click
/**
 * The function `cellClicked` is triggered when a cell is clicked, and it updates the cell's text and
 * background color, checks for a win, and toggles the turn.
 * @param event - The event parameter represents the event object that is passed to the function when
 * the cell is clicked. It contains information about the event, such as the target element that
 * triggered the event. In this case, the target element is the cell that was clicked.
 */
function cellClicked(event) {
    const cell = event.target;
    if (cell.innerText === "" && !gameEnded) {
        cell.innerText = turn;
        cell.style.backgroundColor = "lightblue";
        checkWin();
        toggleTurn();
    }
}

// Handle cell keydown (for Tab and Enter)
/**
 * The `cellKeydown` function handles keydown events for cells, allowing the user to navigate between
 * cells using the Enter and Tab keys.
 * @param event - The event parameter is an object that contains information about the event that
 * occurred, such as the type of event (keydown in this case), the key that was pressed, and the target
 * element that triggered the event.
 */
function cellKeydown(event) {
    if (event.key === "Enter") {
        cellClicked(event); // Pressing enter calls the pre existing cellclicked method

    } else if (event.key === "Tab") { // Pressing tab to traverse and making sure to loop back when the last cell is reached.
        event.preventDefault();
        const currentCellIndex = [...cells].indexOf(event.target);
        const nextCellIndex = currentCellIndex + (event.shiftKey ? -1 : 1);

        // making sure to loop back and not go out of bounds
        let nextIndex;
        if (nextCellIndex < 0) {
            nextIndex = cells.length - 1;
        } else if (nextCellIndex >= cells.length) {
            nextIndex = 0;
        } else {
            nextIndex = nextCellIndex;
        }
        cells[nextIndex].focus();
    }
}

/* The code `document.addEventListener("keydown", function (event) {
    if (event.key === "r" || event.key === "R") {
        startGame(); // Reset the game when "R" is pressed
    }
});` adds an event listener to the document object that listens for the "keydown" event. When a key
is pressed, the function specified as the second argument is executed. */
document.addEventListener("keydown", function (event) {
    if (event.key === "r" || event.key === "R") {
        startGame(); // Reset the game when "R" is pressed
    }
});

// Toggle the current player's turn
/**
 * The function toggles the turn between "X" and "O" and updates the turnElement with the new value.
 */
function toggleTurn() {
    turn = turn === "X" ? "O" : "X";
    turnElement.innerText = turn;
}

// Check for a win
/**
 * The function checks if there is a winning combination or a draw in a tic-tac-toe game.
 * @returns the result of the game. If a player has won, it returns the winning player's turn. If it's
 * a draw, it returns "It's a Draw!".
 */
function checkWin() {
    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (cells[a].innerText && cells[a].innerText === cells[b].innerText && cells[a].innerText === cells[c].innerText) {
            gameEnded = true;
            cells[a].style.backgroundColor = "lightgreen";
            cells[b].style.backgroundColor = "lightgreen";
            cells[c].style.backgroundColor = "lightgreen";
            document.querySelector("#turn").innerText = `${turn} wins!`;
            return;
        }
    }
    // Check for a draw
    if ([...cells].every(cell => cell.innerText !== "")) {
        gameEnded = true;
        document.querySelector("#turn").innerText = "It's a Draw!";
    }
}

// Reset the game
/* These lines of code are adding event listeners to the reset button and previous button elements. */
resetButton.addEventListener("click", startGame);

prevButton.addEventListener("click", function() {
    window.location.href = '../Homepage.html';
});

// Start the game initially
startGame();

/**
 * This JavaScript code creates a particle effect on a canvas element that follows the mouse movement.
 */
var w = window.innerWidth,
    h = window.innerHeight,
    canvas = document.getElementById('test'),
    ctx = canvas.getContext('2d'),
    rate = 60,
    arc = 100,
    time,
    count,
    size = 7,
    speed = 20,
    parts = new Array,
    colors = ['red', '#f57900', 'yellow', '#ce5c00', '#5c3566'];
var mouse = { x: 0, y: 0 };

canvas.setAttribute('width', w);
canvas.setAttribute('height', h);

function create() {
    time = 0;
    count = 0;

    for (var i = 0; i < arc; i++) {
        parts[i] = {
            x: Math.ceil(Math.random() * w),
            y: Math.ceil(Math.random() * h),
            toX: Math.random() * 5 - 1,
            toY: Math.random() * 2 - 1,
            c: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * size
        }
    }
}


function particles() {
    ctx.clearRect(0, 0, w, h);
    canvas.addEventListener('mousemove', MouseMove, false);
    for (var i = 0; i < arc; i++) {
        var li = parts[i];
        var distanceFactor = DistanceBetween(mouse, parts[i]);
        var distanceFactor = Math.max(Math.min(15 - (distanceFactor / 10), 10), 1);
        ctx.beginPath();
        ctx.arc(li.x, li.y, li.size * distanceFactor, 0, Math.PI * 2, false);
        ctx.fillStyle = li.c;
        ctx.strokeStyle = li.c;
        if (i % 2 == 0)
            ctx.stroke();
        else
            ctx.fill();

        li.x = li.x + li.toX * (time * 0.05);
        li.y = li.y + li.toY * (time * 0.05);

        if (li.x > w) {
            li.x = 0;
        }
        if (li.y > h) {
            li.y = 0;
        }
        if (li.x < 0) {
            li.x = w;
        }
        if (li.y < 0) {
            li.y = h;
        }


    }
    if (time < speed) {
        time++;
    }
    setTimeout(particles, 1000 / rate);
}
function MouseMove(e) {
    mouse.x = e.layerX;
    mouse.y = e.layerY;

    //context.fillRect(e.layerX, e.layerY, 5, 5);
    //Draw( e.layerX, e.layerY );
}
function DistanceBetween(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
create();
particles();
