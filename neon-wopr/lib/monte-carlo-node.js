'use strict';

class MonteCarloNode {
  /**
   * Create a MonteCarloNode in the search tree
   * @param {MonteCarloNode} parent - the parent node
   * @param {Play} play - the last play played to get to this state
   * @param {State} state - the corresponding state
   * @param {Play[]} - the node's unexpanded child plays
   */
  constructor (parent, play, state, unexpandedPlays) {
    this.play = play;
    this.state = state;

    this.n_plays = 0;
    this.n_wins = 0;

    this.parent = parent;
    this.children = new Map();
    for (const play of unexpandedPlays) {
      this.children.set(play.hash(), { play, node: null });
    }
  }

  /**
   * Get the MonteCarloNode corresponding to the given play
   * @param {number} play - The play leading to the child node
   * @return {MonteCarloNode} - the child node corresponding to the play
   */
  childNode (play) {
    const child = this.children.get(play.hash());

    if (child === undefined) {
      throw new Error('No such play');
    } else if (child.node === null) {
      throw new Error('Child is not expanded');
    }

    return child.node;
  }

  /**
   * Expand the specified child play and return the new child node
   * Add the node to the array of children nodes
   * Remove the play from the array of unexpanded plays
   * @param {Play} play - the play to expand
   * @param {State} childState - the child state corresponding to the given play
   * @param {Play[]} unexpandedPlays - the given child's unexpanded child plays; typically all of them
   * @return {MonteCarloNode} - the new child node
   */
  expand (play, childState, unexpandedPlays) {
    if (!this.children.has(play.hash())) {
      throw new Error('No such play');
    }
    const childNode = new MonteCarloNode(this, play, childState, unexpandedPlays);
    this.children.set(play.hash(), { play, node: childNode });
    return childNode;
  }

  /**
   * Get all legal plays from this node
   * @return {Plays[]} all plays
   */
  allPlays () {
    const plays = [];
    for (const child of this.children.values()) {
      plays.push(child.play);
    }
    return plays;
  }

  /**
   * Get all unexpanded legal plays from this node
   * @return {Play[]} all unexpanded plays
   */
  unexpandedPlays () {
    const plays = [];
    for (const child of this.children.values()) {
      if (child.node === null) {
        plays.push(child.play);
      }
    }
    return plays;
  }

  /**
   * Check wheter this node is fully expanded
   * @return {boolean} is this node fully expanded
   */
  isFullyExpanded () {
    for (const child of this.children.values()) {
      if (child.node === null) {
        return false;
      }
    }
    return true;
  }

  /**
   * Whether this node is terminal in the node tree, not inclusive of termination due to winning
   * @return {boolean} is this node a leaf in the tree
   */
  isLeaf () {
    if (this.children.size === 0) {
      return true;
    }
    return false;
  }

  /**
   * Get the UCB1 value for this node
   * @param {number} biasParam the square of the bias parameter in the UCB1 algorithm, defaults to 2
   * @return {number} the UCB1 value of this node
   */
  getUCB1 (biasParam) {
    return (
      (this.n_wins / this.n_plays) +
      Math.sqrt(biasParam * Math.log(this.parent.n_plays) / this.n_plays)
    );
  }
}

module.exports = MonteCarloNode;