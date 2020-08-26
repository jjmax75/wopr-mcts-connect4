'use strict';

const argv = require('yargs').argv;

const nodeRunner = require('./game-runners/node-runner');
const nodeFfiRunner = require('./game-runners/node-ffi-runner');
const neonRunner = require('./game-runners/neon-runner');

switch (argv.runner) {
  case 'node':
    nodeRunner();
    break;
  case 'node-ffi':
    nodeFfiRunner();
    break;
  case 'neon':
    neonRunner();
    break;
  default:
    console.log('unrecognised argument for runner. options: --runnner [node, node-ffi, neon]');
};
