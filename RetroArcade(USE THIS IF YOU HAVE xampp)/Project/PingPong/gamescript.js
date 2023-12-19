// Import the Ball and Paddle classes from separate modules
import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

// Create instances of the Ball and Paddle classes and get references to score elements
const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");

// Variable to store the last frame time for calculating delta time
let lastTime;

// Main update function to animate the game
function update(time) {
    // Check if lastTime is not null (not the first frame)
    if (lastTime != null) {
        // Calculate the time difference between frames (delta time)
        const delta = time - lastTime;

        // Update the ball and computer paddle based on the delta time
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
        computerPaddle.update(delta, ball.y);

        // Check if the ball has gone out of bounds and handle the loss condition
        if (isLose()) handleLose();
    }

    // Store the current time for the next frame
    lastTime = time;

    // Request the next animation frame to continue the animation loop
    window.requestAnimationFrame(update);
}

// Check if the ball has gone out of bounds (left or right)
function isLose() {
    const rect = ball.rect();
    return rect.right >= window.innerWidth || rect.left <= 0;
}

// Handle the loss condition by updating scores, resetting the ball, and resetting the computer paddle
function handleLose() {
    const rect = ball.rect();
    if (rect.right >= window.innerWidth) {
        // If the ball went out on the right side, increase the player's score
        playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
    } else {
        // If the ball went out on the left side, increase the computer's score
        computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
    }

    // Reset the ball and computer paddle positions
    ball.reset();
    computerPaddle.reset();
}

// Listen for mouse movement to control the player paddle position
document.addEventListener("mousemove", e => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
});

// Start the animation loop by requesting the first animation frame
window.requestAnimationFrame(update);