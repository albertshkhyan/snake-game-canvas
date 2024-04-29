import { Snake } from './Snake';
import { Food } from './Food';

export class Renderer {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') || this.createFallbackContext();
    }

    private createFallbackContext(): CanvasRenderingContext2D {
        // Create a fallback context or handle the error appropriately
        throw new Error('Failed to get 2D rendering context from canvas.');
    }

    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderGame(snake: Snake, food: Food): void {
        this.clearCanvas();
        this.renderSnake(snake);
        this.renderFood(food); // Render the food
    }

    private renderSnake(snake: Snake): void {
        const snakeBody = snake.getBody(); // Get the snake's body coordinates

        this.ctx.fillStyle = snake.color;

        // Loop through each segment of the snake's body and draw it on the canvas
        snakeBody.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, snake.getSize(), snake.getSize());
        });
    }

    private renderFood(food: Food): void {
        this.ctx.fillStyle = food.getColor();
        this.ctx.fillRect(food.position.x, food.position.y, food.getSize(), food.getSize()); // Use getSize() method to retrieve the size
    }

    displayMessage(message: string): void {
        this.clearCanvas();
        this.ctx.fillStyle = '#333';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
    }
}
