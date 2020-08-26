'use strict';

const Game = require('../game-engine/game-c4');
const NeonyMonteCarlo = require('./../neon-wopr');

const game = new Game();

let state = game.start();
let winner = game.winner(state);

const neonRunner = function () {
  console.log();
  console.log(`player: ${state.player === -1 ? 2 : state.player}`);
  state.board.forEach(row => {
    console.log(row.map(cell => cell === -1 ? 2 : cell).join());
  });

  NeonyMonteCarlo.runSearch();
};

module.exports = neonRunner;
