import { Game } from '@components/Game';
import { Renderer } from '@components/Renderer';
import { Snake } from '@components/Snake';
import { Food } from '@components/Food';

console.log('Hello From Entry Point');

// Constants for canvas dimensions
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// Initialize game components
const renderer = new Renderer('gameCanvas'); // Assuming 'gameCanvas' is the ID of your canvas element
const snake = new Snake({ x: 50, y: 50 }, 10, '#008000', 10);
const initialPosition = { x: 0, y: 0 }; // Define the initial position
const food = new Food(10, '#FF0000', initialPosition);

// Initialize game instance
const game = new Game(renderer, snake, food, CANVAS_WIDTH, CANVAS_HEIGHT);

// Start the game
game.start();
