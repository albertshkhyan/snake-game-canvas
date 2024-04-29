export class Snake {
    private readonly body: { x: number; y: number }[];
    private direction: string;
    private readonly _size: number;
    private readonly _color: string;
    private readonly _initialWidth: number;
    private hasEatenFood: boolean = false;

    constructor(initialPosition: { x: number; y: number }, size: number, color: string, initialWidth: number = 1) {
        console.log('Initializing snake with initial position:', initialPosition);

        // this.body = [initialPosition];
        this.body = [];
        for (let i = 0; i < initialWidth; i++) {
            // Adjust the x-coordinate calculation to space out the segments properly
            this.body.push({ x: initialPosition.x - i * size, y: initialPosition.y });
        }
        this.direction = 'right';
        this._size = size;
        this._color = color;
        this._initialWidth = initialWidth;
    }

    get color(): string {
        return this._color;
    }

    public getSize(): number {
        return this._size;
    }

    reset(initialPosition: { x: number; y: number }): void {
        console.log('Resetting snake with initial position:', initialPosition);

        // Clear the existing body
        this.body.length = 0;

        // Reinitialize the body with the correct number of segments and positions
        for (let i = 0; i < this._initialWidth; i++) {
            // Adjust the x-coordinate calculation to space out the segments properly
            this.body.push({ x: initialPosition.x - i * this._size, y: initialPosition.y });
        }

        // Reset the direction
        this.direction = 'right';
    }

    getBody(): { x: number; y: number }[] {
        return this.body;
    }

    getHeadPosition(): { x: number; y: number } {
        return this.body[0];
    }

    setDirection(direction: string): void {
        // Ensure the snake cannot reverse its direction
        if (
            (direction === 'up' && this.direction !== 'down') ||
            (direction === 'down' && this.direction !== 'up') ||
            (direction === 'left' && this.direction !== 'right') ||
            (direction === 'right' && this.direction !== 'left')
        ) {
            this.direction = direction;
        }
    }

    update(): void {
        // Move the snake in the current direction
        let newX = this.body[0].x;
        let newY = this.body[0].y;

        switch (this.direction) {
            case 'up':
                newY -= this.getSize();
                break;
            case 'down':
                newY += this.getSize();
                break;
            case 'left':
                newX -= this.getSize();
                break;
            case 'right':
                newX += this.getSize();
                break;
        }

        console.log('New head position:', { x: newX, y: newY });


        // Add the new head position to the beginning of the snake's body
        this.body.unshift({ x: newX, y: newY });

        // Check if the snake has eaten food (length should increase)
        // If it hasn't, remove the last segment to maintain its length
        if (!this.hasEatenFood) {
            this.body.pop();
        }

        // Reset the flag for the next update cycle
        this.hasEatenFood = false;
    }

    increaseLength(): void {
        // Add a new segment to the snake's body when it eats food
        const lastSegment = this.body[this.body.length - 1];
        this.body.push({ x: lastSegment.x, y: lastSegment.y });

        // Set the flag to indicate that the snake has eaten food
        this.hasEatenFood = true;
    }

    checkCollision(canvasWidth: number, canvasHeight: number): boolean {
        // Check if the snake collides with the canvas boundaries or itself
        const head = this.body[0];

        // Check if the head collides with the canvas boundaries
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
            return true;
        }

        // Check if the head collides with the body segments (except the head itself)
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    }
}
