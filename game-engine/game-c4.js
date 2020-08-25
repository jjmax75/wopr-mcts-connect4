'use strict';

const State = require('./state-c4');
const Play = require('./play-c4');
const N_ROWS = 6;
const N_COLS = 7;

const boardPrototype = Array(N_ROWS).fill(Array(N_COLS).fill(0));
const checkPrototype = Array(N_ROWS + 1).fill(Array(N_COLS + 2).fill(0));

class GameC4 {
  start () {
    const newBoard = boardPrototype.map(row => row.slice());
    return new State([], newBoard, 1);
  }

  legalPlays (state) {
    const legalPlays = [];
    for (let col = 0; col < N_COLS; col++) {
      for (let row = N_ROWS - 1; row >= 0; row--) {
        if (state.board[row][col] === 0) {
          legalPlays.push(new Play(row, col));
          break;
        }
      }
    }
    return legalPlays;
  }

  nextState (state, play) {
    const newHistory = state.playHistory.slice();
    newHistory.push(play);
    const newBoard = state.board.map(row => row.slice());
    newBoard[play.row][play.col] = state.player;
    const newPlayer = -state.player;

    return new State(newHistory, newBoard, newPlayer);
  }

  winner (state) {
    const boardFull = !state.board[0].includes(0);

    if (boardFull) {
      return 0;
    }

    const checkBoards = new Map();
    checkBoards.set('horiz', checkPrototype.map(row => row.slice()));
    checkBoards.set('verti', checkPrototype.map(row => row.slice()));
    checkBoards.set('ldiag', checkPrototype.map(row => row.slice()));
    checkBoards.set('rdiag', checkPrototype.map(row => row.slice()));

    for (let row = 0; row < N_ROWS; row++) {
      for (let col = 0; col < N_COLS; col++) {
        const cell = state.board[row][col];
        for (const [key, val] of checkBoards) {
          let acc;
          switch (key) {
            case 'horiz': acc = val[row + 1][col];
              break;
            case 'verti': acc = val[row][col + 1];
              break;
            case 'ldiag': acc = val[row][col];
              break;
            case 'rdiag': acc = val[row][col + 2];
              break;
          }

          val[row + 1][col + 1] = cell;
          if ((cell < 0 && acc < 0) || (cell > 0 && acc > 0)) {
            val[row + 1][col + 1] += acc;
          }
          if (val[row + 1][col + 1] === 4) {
            return 1;
          }
          if (val[row + 1][col + 1] === -4) {
            return -1;
          }
        }
      }
    }
    return null;
  }
}

module.exports = GameC4;
