'use strict';

const path = require('path');
const ffi = require('@saleae/ffi');

const RustyMonteCarlo = path.resolve(__dirname, '../rust-wopr/target/release/librust_wopr');

const api = ffi.Library(RustyMonteCarlo, {
  run_search: ['void', []],
  get_stats: ['void', []],
  best_play: ['void', []],
});

const nodeFfiRunner = function () {
  api.run_search();
  api.get_stats();
  api.best_play();
};

module.exports = nodeFfiRunner;
