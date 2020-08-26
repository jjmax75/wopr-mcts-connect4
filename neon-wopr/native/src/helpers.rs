#[derive(Serialize, Deserialize, Debug)]
pub struct State {
    pub playHistory: Vec<State>,
    pub board: Vec<Vec<f64>>,
    pub player: f64,
}