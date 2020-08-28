use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct State {
    pub playHistory: Vec<State>,
    pub board: Vec<Vec<f64>>,
    pub player: f64,
}

impl State {
  pub fn hash (playHistory: Vec<State>) -> String {
    stringify(playHistory)
  }
}

fn stringify (playHistory: Vec<State>) -> String {
  let json_string = serde_json::to_string(&playHistory).unwrap();

  json_string
}