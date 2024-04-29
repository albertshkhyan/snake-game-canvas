export function positionsAreEqual(pos1: { x: number; y: number }, pos2: { x: number; y: number }): boolean {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}
