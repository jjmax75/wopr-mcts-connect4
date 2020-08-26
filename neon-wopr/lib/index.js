'use strict';

const native = require('../native');

const MonteCarloNode = require('./monte-carlo-node');

/**
 * Class representing the Monte Carlo search tree
 */
class MonteCarlo {
  constructor (game, UCB1ExploreParam = 2) {
    this.game = game;
    this.UCB1ExploreParam = UCB1ExploreParam;
    this.nodes = new Map(); // map: State.hash() => MonteCarloNode
  }

  /**
   * If given state does not exist create a dangling node - used to create the root node
   */
  makeNode (state) {
    const stateHash = state.hash();
    if (!this.nodes.has(stateHash)) {
      const unexpandedPlays = this.game.legalPlays(state).slice();
      const node = new MonteCarloNode(null, null, state, unexpandedPlays);
      this.nodes.set(stateHash, node);
    }
  }

  /**
   * From given state repeatedly run MCTS to build stats
   */
  runSearch (state, count = 1000) { // todo - do as atimed loop and count the iterations
  native.select(state);
//     this.makeNode(state);
//     for (let i = 1; i <= 1000; i++) {
//       let node = this.select(state);
//       let winner = this.game.winner(node.state);
// 
//       if (!node.isLeaf() && winner === null) {
//         node = this.expand(node);
//         winner = this.simulate(node);
//       }
//       this.backpropagate(node, winner);
//     }
  }

  /**
   * Get the best move from avaiilable statistics
   */
  bestPlay (state) {
    this.makeNode(state);

    if (!this.nodes.get(state.hash()).isFullyExpanded()) {
      throw new Error('not enoguh information');
    }

    const node = this.nodes.get(state.hash());
    const allPlays = node.allPlays();
    let bestPlay;
    let max = -Infinity;

    for (const play of allPlays) {
      const childNode = node.childNode(play);
      if (childNode.n_plays > max) {
        bestPlay = play;
        max = childNode.n_plays;
      }
    }
    return bestPlay;
  }

  /**
   * Phase 1 - Selection: select until not fully expanded or leaf
   * @return {MonteCarloNode} return the node that is either
   */
  select (state) {
    let node = this.nodes.get(state.hash());

    while (node.isFullyExpanded() && !node.isLeaf()) {
      const plays = node.allPlays();
      let bestPlay;
      let bestUCB1 = -Infinity;

      for (const play of plays) {
        const childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam);
        if (childUCB1 > bestUCB1) {
          bestPlay = play;
          bestUCB1 = childUCB1;
        }
      }
      node = node.childNode(bestPlay);
    }
    return node;
  }

  /**
   * Phase 2 - Expansion: expand a random unexpanded child node
   */
  expand (node) {
    const plays = node.unexpandedPlays();
    const index = Math.floor(Math.random() * plays.length);
    const play = plays[index];

    const childState = this.game.nextState(node.state, play);
    const childUnexpandedPlays = this.game.legalPlays(childState);
    const childNode = node.expand(play, childState, childUnexpandedPlays);
    this.nodes.set(childState.hash(), childNode);

    return childNode;
  }

  /**
   * Phase 3 - Simulation: play a game to terminal state, return winner
   */
  simulate (node) {
    let state = node.state;
    let winner = this.game.winner(state);

    while (winner === null) {
      const plays = this.game.legalPlays(state);
      const play = plays[Math.floor(Math.random() * plays.length)];
      state = this.game.nextState(state, play);
      winner = this.game.winner(state);
    }

    return winner;
  }

  /**
   * Phase 4 - Backpropagation: update ancestor statistics
   */
  backpropagate (node, winner) {
    while (node !== null) {
      node.n_plays += 1;
      if (node.state.isPlayer(-winner)) {
        node.n_wins += 1;
      }
      node = node.parent;
    }
  }

  getStats (state) {
    const node = this.nodes.get(state.hash());
    // eslint-disable-next-line camelcase
    const { n_plays, n_wins } = node;
    const stats = {
      n_plays,
      n_wins,
      children: [],
    };

    for (const child of node.children.values()) {
      const { node, play } = child;
      if (node === null) {
        stats.children.push({
          play,
          n_plays: null,
          n_wins: null,
        });
      } else {
        // eslint-disable-next-line camelcase
        const { n_plays, n_wins } = node;
        stats.children.push({
          play,
          n_plays,
          n_wins,
        });
      }
    }
    return stats;
  }
}

module.exports = MonteCarlo;
