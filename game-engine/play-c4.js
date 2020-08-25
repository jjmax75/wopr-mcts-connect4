'use strict';

class PlayC4 {
  constructor (row, col) {
    this.row = row;
    this.col = col;
  };

  hash () {
    return `${this.row.toString()},${this.col.toString()}`;
  }
}

module.exports = PlayC4;
