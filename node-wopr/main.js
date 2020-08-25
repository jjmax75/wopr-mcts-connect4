'use strict';

const Game = require('./game-c4');
const MonteCarlo = require('./monte-carlo');

const game = new Game();
const mcts = new MonteCarlo(game);

let state = game.start();
let winner = game.winner(state);

while (winner === null) {
  mcts.runSearch(state, 1);
  const play = mcts.bestPlay(state);
  state = game.nextState(state, play);
  winner = game.winner(state);
}

console.log(winner);
