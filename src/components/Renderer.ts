import { Snake } from './Snake';
import { Food } from './Food';

export class Renderer {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    // Store a reference to the apple image
    private readonly appleImage: HTMLImageElement;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') || this.createFallbackContext();

        // Load the apple image from /public/assets/apple-icon.png
        this.appleImage = new Image();
        this.appleImage.src = '/assets/apple-icon.png';

        this.appleImage.onload = () => {
            console.log('Apple icon loaded!');
        };
    }

    private createFallbackContext(): CanvasRenderingContext2D {
        throw new Error('Failed to get 2D rendering context from canvas.');
    }

    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Renders the entire game each frame:
     *   - Checkerboard background
     *   - Snake (head + body)
     *   - Food (apple icon)
     *   - Score text
     */
    renderGame(snake: Snake, food: Food, score: number): void {
        this.clearCanvas();
        this.drawCheckerboardBackground();
        this.renderSnake(snake);
        this.renderFood(food);
        // this.renderScore(score);
    }

    /**
     * Checkerboard uses two CSS variables: --grid-color-1, --grid-color-2
     */
    private drawCheckerboardBackground() {
        const cellSize = 20;
        const cols = this.canvas.width / cellSize;
        const rows = this.canvas.height / cellSize;

        const rootStyles = getComputedStyle(document.documentElement);
        const color1 = rootStyles.getPropertyValue('--grid-color-1').trim();
        const color2 = rootStyles.getPropertyValue('--grid-color-2').trim();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isEven = (row + col) % 2 === 0;
                this.ctx.fillStyle = isEven ? color1 : color2;
                this.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    /**
     * Renders the snake:
     *   - The head (with elliptical shape + eyes)
     *   - The body segments (each drawn as an oval with a gradient)
     */
    private renderSnake(snake: Snake): void {
        const snakeBody = snake.getBody();
        if (!snakeBody.length) return;

        // Grab colors from CSS, or fallback to a gradient in code
        const rootStyles = getComputedStyle(document.documentElement);
        const bodyColor = rootStyles.getPropertyValue('--snake-color').trim();
        const headColor = rootStyles.getPropertyValue('--snake-head-color').trim() || bodyColor;

        // Draw the head first
        const headSegment = snakeBody[0];
        this.drawSnakeHead(headSegment, snake.direction, headColor, snake.getSize());

        // Draw the remaining body segments
        for (let i = 1; i < snakeBody.length; i++) {
            const segment = snakeBody[i];
            this.drawBodyOval(segment.x, segment.y, snake.getSize());
        }
    }

    /**
     * standart effect
     * Draws an oval segment with a simple left-to-right gradient
     */
    private drawBodyOval(x: number, y: number, size: number) {
        this.ctx.save();

        // Move origin to the segment center
        this.ctx.translate(x + size / 2, y + size / 2);
        this.ctx.scale(1.2, 1);

        this.ctx.beginPath();
        this.ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);

        // Create a gradient from left to right
        const grad = this.ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
        grad.addColorStop(0, '#4d90fe');  // lighter blue
        grad.addColorStop(1, '#4285f4');  // darker
        this.ctx.fillStyle = grad;
        this.ctx.fill();

        this.ctx.restore();
    }

    //gradient effect
    // private drawBodyOval(x: number, y: number, size: number) {
    //     this.ctx.save();
    //     this.ctx.translate(x + size / 2, y + size / 2);
    //     this.ctx.scale(1.2, 1);
    //
    //     this.ctx.beginPath();
    //     this.ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);
    //
    //     // Multi-stop rainbow gradient
    //     const rainbowGrad = this.ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
    //     rainbowGrad.addColorStop(0, 'red');
    //     rainbowGrad.addColorStop(0.16, 'orange');
    //     rainbowGrad.addColorStop(0.33, 'yellow');
    //     rainbowGrad.addColorStop(0.5, 'green');
    //     rainbowGrad.addColorStop(0.66, 'blue');
    //     rainbowGrad.addColorStop(0.83, 'indigo');
    //     rainbowGrad.addColorStop(1, 'violet');
    //     this.ctx.fillStyle = rainbowGrad;
    //
    //     this.ctx.fill();
    //     this.ctx.restore();
    // }


    /**
     * Draws the head as an ellipse with a gradient, plus two eyes with pupils
     */
    private drawSnakeHead(
        head: { x: number; y: number },
        direction: string,
        fallbackColor: string,
        size: number
    ) {
        this.ctx.save();

        // Move origin to head’s center
        this.ctx.translate(head.x + size / 2, head.y + size / 2);

        // Rotate so that “forward” is to the right
        switch (direction) {
            case 'up':
                this.ctx.rotate(-Math.PI / 2);
                break;
            case 'down':
                this.ctx.rotate(Math.PI / 2);
                break;
            case 'left':
                this.ctx.rotate(Math.PI);
                break;
            // case 'right': no rotation needed
        }

        // Elliptical scaling
        this.ctx.beginPath();
        this.ctx.scale(1.5, 1);

        // Create a gradient from left to right within the scaled ellipse
        const grad = this.ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
        grad.addColorStop(0, '#4d90fe');
        grad.addColorStop(1, '#4285f4');
        // If you want a fallback:
        // this.ctx.fillStyle = fallbackColor;
        // But we’ll use the gradient:
        this.ctx.fillStyle = grad;

        // Draw the ellipse (in scaled space, it’s a circle)
        this.ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);

        // Undo the scale
        this.ctx.scale(1 / 1.5, 1);

        this.ctx.fill();

        // Draw eyes (white + pupil)
        const eyeOffsetX = size / 3;
        const eyeOffsetY = size / 6;

        // Left eye (white)
        this.ctx.beginPath();
        this.ctx.arc(eyeOffsetX, -eyeOffsetY, size * 0.15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();

        // Left pupil (slightly forward in x)
        this.ctx.beginPath();
        this.ctx.arc(eyeOffsetX + 1, -eyeOffsetY, size * 0.06, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#000';
        this.ctx.fill();

        // Right eye
        this.ctx.beginPath();
        this.ctx.arc(eyeOffsetX, eyeOffsetY, size * 0.15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();

        // Right pupil
        this.ctx.beginPath();
        this.ctx.arc(eyeOffsetX + 1, eyeOffsetY, size * 0.06, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#000';
        this.ctx.fill();

        this.ctx.restore();
    }

    /**
     * Draws the scaled apple icon.
     * We scale it 1.5x bigger than the grid cell so it looks bigger than the cell.
     */
    private renderFood(food: Food): void {
        const cellSize = food.getSize();
        const scale = 1.5;
        const drawSize = cellSize * scale;
        const offset = (drawSize - cellSize) / 2;
        const { x, y } = food.getPosition();

        this.ctx.drawImage(this.appleImage, x - offset, y - offset, drawSize, drawSize);
    }

    /**
     * Displays the score in the top-left corner
     */
    // private renderScore(score: number): void {
    //     this.ctx.fillStyle = '#333';
    //     this.ctx.font = '16px Arial';
    //     this.ctx.textAlign = 'left';
    //     this.ctx.fillText(`Score: ${score}`, 10, 20);
    // }

    /**
     * If you want to draw a big “Game Over” text on the canvas, use this.
     * But if you’re using an HTML overlay, you might skip or remove this.
     */
    // displayMessage(message: string, score: number): void {
    //     this.clearCanvas();
    //     this.drawCheckerboardBackground();
    //     this.renderScore(score);
    //
    //     this.ctx.fillStyle = '#333';
    //     this.ctx.font = '24px Arial';
    //     this.ctx.textAlign = 'center';
    //     this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
    // }
}
