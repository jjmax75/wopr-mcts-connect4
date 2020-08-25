'use strict';

const util = require('util');
const path = require('path');
const ffi = require('@saleae/ffi');

const Game = require('./game-engine/game-c4');
const NodeyMonteCarlo = require('./node-wopr/monte-carlo');

const RustyMonteCarlo = path.resolve(__dirname, './rust-wopr/target/release/librust_wopr');

const api = ffi.Library(RustyMonteCarlo, {
  addition: ['uint32', ['uint32', 'uint32']],
});

const game = new Game();
const mcts = new NodeyMonteCarlo(game);

let state = game.start();
let winner = game.winner(state);

// game loop - todo - add player input
while (winner === null) {
  console.log();
  console.log(`player: ${state.player === -1 ? 2 : state.player}`);
  state.board.forEach(row => {
    console.log(row.map(cell => cell === -1 ? 2 : cell).join());
  });

  mcts.runSearch(state, 1);

  const stats = mcts.getStats(state);
  console.log(util.inspect(stats, { showHidden: false, depth: null }));

  const play = mcts.bestPlay(state);
  console.log(`chosen play: ${util.inspect(play, { showHidden: false, depth: null })}`);

  state = game.nextState(state, play);
  winner = game.winner(state);
}

console.log();
console.log(`winner: ${winner === -1 ? 2 : winner}`);
state.board.forEach(row => {
  console.log(row.map(cell => cell === -1 ? 2 : cell).join());
});

console.log(`Rust says hello from a Node call: ${api.addition(1, 2)}`);
