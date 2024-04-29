import {getRandomPosition} from "@utils/getRandomPosition";

export class Food {
    private _position: { x: number; y: number };
    private readonly _size: number;
    private readonly _color: string;

    constructor(size: number, color: string, position: { x: number; y: number }) {
        this._size = size;
        this._color = color;
        this._position = position; // Initialize position
    }

    get position(): { x: number; y: number } {
        return this._position;
    }

    public getSize(): number {
        return this._size;
    }

    public getColor(): string {
        return this._color;
    }

    // Generate a new random position for the food
    generateNewPosition(canvasWidth: number, canvasHeight: number): void {
        const newPosition = getRandomPosition(canvasWidth, canvasHeight, this._size);
        this._position = { x: newPosition.x, y: newPosition.y }; // Update _position with a new object
    }

    // Get the position of the food
    getPosition(): { x: number; y: number } {
        return this.position;
    }
}
