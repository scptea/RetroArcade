/* The code is declaring two constants: `INITIAL_VELOCITY` and `VELOCITY_INCREASE`. */

const INITIAL_VELOCITY = .025
const VELOCITY_INCREASE = 0.00001

/* The Ball class represents a ball element in a game and provides methods for updating its position
and handling collisions with paddle elements. */
export default class Ball {
    constructor(ballElem) {
        this.ballElem = ballElem;
        this.reset();
    }

    // Getter for the x-coordinate of the ball
    get x() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
    }

    // Setter for the x-coordinate of the ball
    set x(value) {
        this.ballElem.style.setProperty("--x", value);
    }

    // Getter for the y-coordinate of the ball
    get y() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
    }

    // Setter for the y-coordinate of the ball
    set y(value) {
        this.ballElem.style.setProperty("--y", value);
    }

    // Get the bounding rectangle of the ball element
    rect() {
        return this.ballElem.getBoundingClientRect();
    }

    // Reset the ball position, direction, and velocity
    reset() {
        this.x = 50;
        this.y = 50;
        this.direction = { x: 0 };
        while (
            Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9
        ) {
            const heading = randomNumberBetween(0, 2 * Math.PI);
            this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
        }
        this.velocity = INITIAL_VELOCITY;
    }

    // Update the ball position based on time, and check for collisions with paddles
    update(delta, paddleRects) {
        this.x += this.direction.x * this.velocity * delta;
        this.y += this.direction.y * this.velocity * delta;
        this.velocity += VELOCITY_INCREASE * delta;
        const rect = this.rect();

        // Reflect the ball if it hits the top or bottom of the window
        if (rect.bottom >= window.innerHeight || rect.top <= 0) {
            this.direction.y *= -1;
        }

        // Reflect the ball if it collides with any of the paddles
        if (paddleRects.some(r => isCollision(r, rect))) {
            this.direction.x *= -1;
        }
    }
}

// Generate a random number between min and max
function randomNumberBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// Check if there is a collision between two rectangles
function isCollision(rect1, rect2) {
    return (
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left &&
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top
    );
}