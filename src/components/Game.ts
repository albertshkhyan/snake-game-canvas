// src/components/Game.ts (example path)
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

    private score: number;
    private bestScore: number = 0;

    private readonly handleKeyDownBound: (event: KeyboardEvent) => void;

    constructor(
        renderer: Renderer,
        snake: Snake,
        food: Food,
        canvasWidth: number,
        canvasHeight: number
    ) {
        this.renderer = renderer;
        this.snake = snake;
        this.food = food;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.intervalId = undefined;
        this.score = 0;

        this.handleKeyDownBound = this.handleKeyDown.bind(this);
    }

    // Start the game loop
    start(): void {
        // Prevent multiple intervals from stacking
        if (this.intervalId != null) return;

        this.intervalId = setInterval(() => this.gameLoop(), 100);

        document.addEventListener('keydown', this.handleKeyDownBound);
        document
            .getElementById('restartButton')
            ?.addEventListener('click', () => {
                this.handleRestartClick();
            });
    }

    /**
     * Stop the game loop, optionally show the "Game Over" overlay
     */
    stop(showOverlay = false): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        document.removeEventListener('keydown', this.handleKeyDownBound);

        if (showOverlay) {
            // Show the overlay
            const overlay = document.getElementById('gameOverOverlay');
            if (overlay) {
                overlay.classList.remove('hidden');
            }
        }
    }

    private handleRestartClick(): void {
        // Stop without showing the overlay
        this.stop(false);

        // Hide the overlay if it was previously visible
        const overlay = document.getElementById('gameOverOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }

        // Reset snake, score, and reposition food
        this.score = 0;
        const initialPosition = { x: 0, y: 0 };
        this.snake.reset(initialPosition);
        this.food.generateNewPosition(this.canvasWidth, this.canvasHeight);

        // Restart the loop
        this.start();
    }

// Then in your "gameLoop" or wherever you increment score:
    private gameLoop(): void {
        this.snake.update();

        if (this.snake.checkCollision(this.canvasWidth, this.canvasHeight)) {
            this.stop(true);
            return;
        }

        if (this.snakeHasEatenFood()) {
            this.snake.increaseLength();
            this.food.generateNewPosition(this.canvasWidth, this.canvasHeight);

            this.score += 1;

            const currentScoreElem = document.getElementById('currentScore');
            if (currentScoreElem) {
                currentScoreElem.textContent = this.score.toString();
            }

            // Update bestScore if you want a high score
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                const bestScoreElem = document.getElementById('bestScore');
                if (bestScoreElem) {
                    bestScoreElem.textContent = this.bestScore.toString();
                }
            }
        }

        this.renderer.renderGame(this.snake, this.food, this.score);
    }


    private snakeHasEatenFood(): boolean {
        const snakeHead = this.snake.getHeadPosition();
        const foodPosition = this.food.getPosition();
        return snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y;
    }

    private handleKeyDown(event: KeyboardEvent): void {
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
