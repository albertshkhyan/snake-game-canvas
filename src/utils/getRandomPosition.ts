export function getRandomPosition(canvasWidth: number, canvasHeight: number, gridSize: number): { x: number; y: number } {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}
