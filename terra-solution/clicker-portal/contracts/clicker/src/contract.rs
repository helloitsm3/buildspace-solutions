#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{ to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{SpeedResponse, MigrateMsg, QueryMsg, ExecuteMsg, InstantiateMsg, ScoreResponse};
use crate::state::{State, STORAGE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:clicker";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> StdResult<Response> {
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
  deps: DepsMut,
  _env: Env,
  info: MessageInfo,
  msg: InstantiateMsg,
) -> Result<Response, ContractError> {

    let state = State {
        speed: msg.speed,
        owner: info.sender.clone(),
        scores: vec![],
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STORAGE.save(deps.storage, &state)?;

  Ok(Response::default()
    .add_attribute("method", "instantiate")
    .add_attribute("owner", info.sender)
    .add_attribute("speed", msg.speed.to_string())
    .add_attribute("scores", "".to_string())
    )
}
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::UpsertScore { score } => try_upsert_score(deps, info, score),
    }
}

fn try_upsert_score(
    deps: DepsMut,
    info: MessageInfo,
    score: u16,
) -> Result<Response, ContractError> {
    let mut state = STORAGE.load(deps.storage)?;
    let sender = info.sender.clone();
    let scores = &mut state.scores;
    let index = scores.iter().position(|(s, _)| s == &sender);
    match index {
        Some(i) => {
            scores[i].1 = score;
        },
        None => {
            scores.push((sender.clone(), score));
        }
    }
        STORAGE.save(deps.storage, &state)?;
        Ok(Response::new()
            .add_attribute("method", "upsert")
            .add_attribute("player", info.sender)
            .add_attribute("score", score.to_string())
        )
    }
    



#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
  match msg {
      QueryMsg::GetSpeed {} => to_binary(&query_speed(deps)?),
      QueryMsg::GetScores {} => to_binary(&query_scores(deps)?),
  }
}

fn query_speed(deps: Deps) -> StdResult<SpeedResponse> {
  let state = STORAGE.load(deps.storage)?;
  Ok(SpeedResponse { speed: state.speed })
}

fn query_scores(deps: Deps) -> StdResult<ScoreResponse> {
    let state = STORAGE.load(deps.storage)?;
    Ok(ScoreResponse { scores: state.scores })
}