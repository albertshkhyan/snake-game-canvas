// index.ts
import './styles/main.css';
import { Renderer } from '@components/Renderer';
import { Snake } from '@components/Snake';
import { Food } from '@components/Food';
import { Game } from '@components/Game';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';

// 1) Grab the <canvas> element and set its size
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// 2) Create the Renderer (still needs the canvas ID)
const renderer = new Renderer('gameCanvas');

// 3) Create Snake, Food, Game, etc.
const snake = new Snake({ x: 80, y: 80 }, 20, '#4285F4', 4);
const food = new Food(20, '#FF0000', { x: 200, y: 200 });
const game = new Game(renderer, snake, food, CANVAS_WIDTH, CANVAS_HEIGHT);

// 4) Start the game
game.start();
