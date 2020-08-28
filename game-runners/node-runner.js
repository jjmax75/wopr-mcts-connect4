'use strict';

const util = require('util');
const readlineSync = require('readline-sync');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

const Game = require('../game-engine/game-c4');
const NodeyMonteCarlo = require('../node-wopr/monte-carlo');

let game, mcts, state, winner;

const newGame = () => {
  game = new Game();
  mcts = new NodeyMonteCarlo(game);

  state = game.start();
  winner = game.winner(state);
}

const computerPlayer = () => {
  mcts.runSearch(state, 30);

  // const stats = mcts.getStats(state);
  // console.log(util.inspect(stats, { showHidden: false, depth: null }));

  const play = mcts.bestPlay(state);
  console.log(`wopr player: ${util.inspect(play, { showHidden: false, depth: null })}`);

  return play
}

const humanTerminalPlayer = () => {
  console.log("your go meat sack");
  
  const validPlays = mcts.nodes[state.hash()].children;
  const validPlaysArr = Array.from(validPlays.keys());
  
  const index = readlineSync.keyInSelect(validPlaysArr, 'Which row, column?', { cancel: false });
  const play = validPlays.get(validPlaysArr[index]).play;
  console.log(`human plays: ${util.inspect(play, { showHidden: false, depth: null })}`);

  return play;
}

const printTerminalBoard = () => {
  console.log();
  const validPlays = mcts.nodes[state.hash()].children;
  state.board.forEach((row, i) => {
    let rowString = '';
    row.map((cell, j) => {
      if (validPlays.has(`${i},${j}`)) {
        rowString += ` M${j + 1} `;
      } else if (cell !== 0) {
        rowString += ` P${cell === -1 ? 2 : cell} `
      } else {
        rowString += `  ${cell} `;
      }
      if (j !== 6) {
        rowString += `|`;
      }
    });
    if (i !== 0) {
      console.log(' --   --   --   --   --   --   -- ');
    }
    console.log(rowString);
  });
  console.log();
}

const humanBrowserPlayer = coords => {
  const validPlays = mcts.nodes[state.hash()] && mcts.nodes[state.hash()].children;
  return validPlays && validPlays.get(coords).play;
}

const nodeRunner = function () {
  newGame();
  wss.on('connection', ws => {
    console.log('websocket opened');
    ws.on('message', message => {
      console.log(message);
      let play;
      if (message === 'begin') {
        play = computerPlayer();
        state = game.nextState(state, play);
        winner = game.winner(state);
      } else {
        play = humanBrowserPlayer(message);

        state = game.nextState(state, play);
        winner = game.winner(state);

        if (!winner) {
          play = computerPlayer();
          state = game.nextState(state, play);
          winner = game.winner(state);
        }
      }

      ws.send(JSON.stringify({
        board: state.board,
        player: state.player,
        validPlays: Array.from(mcts.nodes[state.hash()].children.keys()),
        winner
      }));

      if (winner) {
        newGame();
      }
    });
  })
};

module.exports = nodeRunner;
