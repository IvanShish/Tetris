import Game from './src/game.js';
import View from './src/view.js';
import Controller from './src/controller.js';

function read(source) {
    source.innerHTML = "Игрок: " + localStorage["tetris.username"];
}

const root = document.querySelector('#root');

const game = new Game();
const width = 960;
const height = 640;
const rows = 20;
const columns = 10;
const view = new View(root, width, height, rows, columns);
const controller = new Controller(game, view);

const testh2 = document.querySelector(".classh2");
read(testh2);
const restartButton = document.querySelector(".restartButton");
restartButton.style.visibility = 'hidden';

window.game = game;
window.view = view;
window.controller = controller;