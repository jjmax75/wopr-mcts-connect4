'use strict';

const util = require('util');

const Game = require('../game-engine/game-c4');
const NeonyMonteCarlo = require('./../neon-wopr');

const game = new Game();
const mcts = new NeonyMonteCarlo(game);

let state = game.start();
let winner = game.winner(state);

const neonRunner = function () {
  // while (winner === null) {
  //   console.log();
  //   console.log(`player: ${state.player === -1 ? 2 : state.player}`);
  //   state.board.forEach(row => {
  //     console.log(row.map(cell => cell === -1 ? 2 : cell).join());
  //   });

    mcts.runSearch(state);

//     const stats = mcts.getStats(state);
//     console.log(util.inspect(stats, { showHidden: false, depth: null }));
// 
//     const play = mcts.bestPlay(state);
//     console.log(`chosen play: ${util.inspect(play, { showHidden: false, depth: null })}`);
// 
//     state = game.nextState(state, play);
//     winner = game.winner(state);
//   }
// 
//   console.log();
//   console.log(`winner: ${winner === -1 ? 2 : winner}`);
//   state.board.forEach(row => {
//     console.log(row.map(cell => cell === -1 ? 2 : cell).join());
//   });
};

module.exports = neonRunner;
