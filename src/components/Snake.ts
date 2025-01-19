export class Snake {
    private readonly body: { x: number; y: number }[];
    private _direction: string;
    private readonly _size: number;
    private readonly _color: string;
    private readonly _initialWidth: number;
    private hasEatenFood: boolean = false;

    constructor(initialPosition: { x: number; y: number }, size: number, color: string, initialWidth: number = 1) {
        console.log('Initializing snake with initial position:', initialPosition);

        this.body = [];
        for (let i = 0; i < initialWidth; i++) {
            // Space out the segments
            this.body.push({ x: initialPosition.x - i * size, y: initialPosition.y });
        }
        this._direction = 'right';
        this._size = size;
        this._color = color;
        this._initialWidth = initialWidth;
    }

    // If you still want color from the Snake (not just from CSS)
    get color(): string {
        return this._color;
    }

    public getSize(): number {
        return this._size;
    }

    /**
     *  NEW: Public getter for the direction
     */
    get direction(): string {
        return this._direction;
    }

    reset(initialPosition: { x: number; y: number }): void {
        console.log('Resetting snake with initial position:', initialPosition);

        // Clear the existing body
        this.body.length = 0;

        // Reinitialize
        for (let i = 0; i < this._initialWidth; i++) {
            this.body.push({ x: initialPosition.x - i * this._size, y: initialPosition.y });
        }

        this._direction = 'right';
    }

    getBody(): { x: number; y: number }[] {
        return this.body;
    }

    getHeadPosition(): { x: number; y: number } {
        return this.body[0];
    }

    setDirection(direction: string): void {
        // Prevent reversing
        if (
            (direction === 'up' && this._direction !== 'down') ||
            (direction === 'down' && this._direction !== 'up') ||
            (direction === 'left' && this._direction !== 'right') ||
            (direction === 'right' && this._direction !== 'left')
        ) {
            this._direction = direction;
        }
    }

    update(): void {
        // Move the snake
        let newX = this.body[0].x;
        let newY = this.body[0].y;

        switch (this._direction) {
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

        // Add new head position
        this.body.unshift({ x: newX, y: newY });

        // If it hasn’t eaten food, remove the tail segment
        if (!this.hasEatenFood) {
            this.body.pop();
        }
        this.hasEatenFood = false;
    }

    increaseLength(): void {
        // Extend the snake’s body
        const lastSegment = this.body[this.body.length - 1];
        this.body.push({ x: lastSegment.x, y: lastSegment.y });
        this.hasEatenFood = true;
    }

    checkCollision(canvasWidth: number, canvasHeight: number): boolean {
        // Collide with boundaries?
        const head = this.body[0];
        if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
            return true;
        }

        // Collide with itself?
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}
