extern crate neon;
extern crate neon_serde;
#[macro_use]
extern crate serde_derive;

use neon::prelude::*;

mod helpers;
use helpers::State;

// fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
//     Ok(cx.string("hello node"))
// }
fn run_search(mut cx: FunctionContext)-> JsResult<JsUndefined> {
  println!("Running the search so I am");
  Ok(cx.undefined())
}

fn get_stats(mut cx: FunctionContext)-> JsResult<JsUndefined> {
  println!("Getting the games stats");
  Ok(cx.undefined())
}

fn best_play(mut cx: FunctionContext)-> JsResult<JsUndefined> {
  println!("Getting the best play");
  Ok(cx.undefined())
}

fn select(mut cx: FunctionContext) -> JsResult<JsUndefined> {
  let x = cx.argument::<JsValue>(0)?;
  let x_value: State = neon_serde::from_value(&mut cx, x)?;
  println!("player {}", x_value.player);
  Ok(cx.undefined())
  // let node = this.nodes.get(state.hash());

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
    m.export_function("runSearch", run_search);
    m.export_function("getStats", get_stats);
    m.export_function("bestPlay", best_play);
    m.export_function("select", select)
});
