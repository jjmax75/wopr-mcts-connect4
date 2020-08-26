use neon::prelude::*;

// fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
//     Ok(cx.string("hello node"))
// }
fn run_search(cx: FunctionContext)-> JsResult<JsUndefined> {
  println!("Running the search so I am");
  
}

fn get_stats(cx: FunctionContext)-> JsResult<JsUndefined> {
  println!("Getting the games stats");
  unimplemented!("work in progress");
}

fn best_play(cx: FunctionContext)-> JsResult<JsUndefined> {
  println!("Getting the best play");
  unimplemented!("work in progress");
}

register_module!(mut m, {
    m.export_function("runSearch", run_search);
    m.export_function("getStats", get_stats);
    m.export_function("bestPlay", best_play)
});
