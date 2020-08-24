'use strict';

const Game = require('./game-c4.js');

const N_GAMES = 1000;

const game = new Game();

let state = game.start();
let winner = null;

let ngames = 0;
let playerOneWins = 0;
let haveDisplayed = false;

while (ngames < N_GAMES) {
  const plays = game.legalPlays(state);
  const play = plays[Math.floor(Math.random() * plays.length)];
  state = game.nextState(state, play);
  winner = game.winner(state);

  // If there's a winner, reset
  if (winner != null) {
    // display one board
    if (!haveDisplayed) {
      state.board.map(row => {
        const resultRow = row.map(cell => {
          return cell === -1 ? 2 : cell;
        });
        console.log(resultRow.join());
      });
      console.log(`The winner is player ${winner === -1 ? 2 : winner}`);
      haveDisplayed = true;
    }

    ngames += 1;
    playerOneWins += (winner === 1);
    state = game.start();
    winner = null;
  }
}

console.log(playerOneWins / ngames);
