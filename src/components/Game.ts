import { Renderer } from './Renderer';
import { Snake } from './Snake';
import { Food } from './Food';

export class Game {
    private readonly renderer: Renderer;
    private readonly snake: Snake;
    private readonly food: Food;
    private readonly canvasWidth: number;
    private readonly canvasHeight: number;
    private intervalId: NodeJS.Timeout | undefined;

    constructor(renderer: Renderer, snake: Snake, food: Food, canvasWidth: number, canvasHeight: number) {
        this.renderer = renderer;
        this.snake = snake;
        this.food = food;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.intervalId = undefined; // Initialize intervalId to null
    }

    // Start the game loop
    start(): void {
        this.intervalId = setInterval(() => this.gameLoop(), 100); // Adjust the interval as needed

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.getElementById('restartButton')?.addEventListener('click', this.handleRestartClick.bind(this));

    }

    // Stop the game loop
    stop(): void {
        clearInterval(this.intervalId);

        // Remove event listener for keyboard input
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private handleRestartClick(): void {
        // Stop the previous game loop before resetting
        this.stop();

        // Reset snake state
        const initialPosition = { x: 0, y: 0 };
        this.snake.reset(initialPosition);

        // Generate new food position
        this.food.generateNewPosition(this.canvasWidth, this.canvasHeight);

        // Restart game loop
        this.start();
    }

    // Game loop
    private gameLoop(): void {
        this.snake.update(); // Update snake position
        if (this.snake.checkCollision(this.canvasWidth, this.canvasHeight)) {
            this.stop(); // Stop the game if snake collides with boundaries or itself
            this.renderer.displayMessage('Game Over');
            return;
        }
        if (this.snakeHasEatenFood()) {
            this.snake.increaseLength(); // Increase snake's length if it eats food
            this.food.generateNewPosition(this.canvasWidth, this.canvasHeight); // Generate new food position
        }
        this.renderer.renderGame(this.snake, this.food); // Render game elements including the food
    }

    // Check if the snake has eaten the food
    private snakeHasEatenFood(): boolean {
        const snakeHead = this.snake.getHeadPosition();
        const foodPosition = this.food.getPosition();
        return snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y;
    }

    // Handle keydown events
    handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                this.snake.setDirection('up');
                break;
            case 'ArrowDown':
                this.snake.setDirection('down');
                break;
            case 'ArrowLeft':
                this.snake.setDirection('left');
                break;
            case 'ArrowRight':
                this.snake.setDirection('right');
                break;
        }
    }
}
