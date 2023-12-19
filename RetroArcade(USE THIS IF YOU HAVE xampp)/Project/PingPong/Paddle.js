// Constant representing the speed at which the paddle moves
const SPEED = 0.02;

// Paddle class representing the player or computer-controlled paddles
export default class Paddle {
    // Constructor to initialize the paddle with its HTML element
    constructor(paddleElm) {
        this.paddleElm = paddleElm;
        this.reset();
    }

    // Getter for the position of the paddle
    get position() {
        return parseFloat(getComputedStyle(this.paddleElm).getPropertyValue("--position"));
    }

    // Setter for the position of the paddle
    set position(value) {
        this.paddleElm.style.setProperty("--position", value);
    }

    // Get the bounding rectangle of the paddle element
    rect() {
        return this.paddleElm.getBoundingClientRect();
    }

    // Reset the paddle position to the default
    reset() {
        this.position = 50;
    }

    // Update the paddle position based on delta time and the height of the ball
    update(delta, ballHeight) {
        // Move the paddle towards the height of the ball at a constant speed
        this.position += SPEED * delta * (ballHeight - this.position);
    }
}


    