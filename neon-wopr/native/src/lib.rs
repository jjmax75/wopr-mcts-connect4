extern crate neon;
extern crate neon_serde;

use neon::prelude::*;

mod helpers;
use helpers::State;

fn run_search(mut cx: FunctionContext) -> JsResult<JsString> {
  let state_raw = cx.argument::<JsValue>(0)?;
  let state: State = neon_serde::from_value(&mut cx, state_raw)?;
  let count = cx.argument::<JsNumber>(1)?.value();
  let nodes_handle: Handle<JsObject> = cx.argument::<JsObject>(2)?;

  let state_hash = State::hash(state.playHistory);
  let key = state_hash.as_str();

  let node = nodes_handle.get(&mut cx, key)?;
  // let node = select(&state_hash);

  // for x in 0..count as i32 {
  //   println!("{} - {:?}", x, state.playHistory);
  // }

  Ok(cx.string(state_hash))
}

fn select(state_hash: &str) {
  // let node = nodes[state_hash];

  // while (node.isFullyExpanded() && !node.isLeaf()) {
  //   const plays = node.allPlays();
  //   let bestPlay;
  //   let bestUCB1 = -Infinity;

  //   for (const play of plays) {
  //     const childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam);
  //     if (childUCB1 > bestUCB1) {
  //       bestPlay = play;
  //       bestUCB1 = childUCB1;
  //     }
  //   }
  //   node = node.childNode(bestPlay);
  // }
  // return node;
}

register_module!(mut m, {
    m.export_function("runSearch", run_search)
});
