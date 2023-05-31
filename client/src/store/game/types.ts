import { GameEvolutionState } from '../../enums/game-state'

export type GameState = {
  state: GameEvolutionState
  ball: ApiBall
  player1: ApiPlayer
  player2: ApiPlayer
  screen: {
    width: number
    height: number
  }
  level: number
  color: ApiColor
}

export type ApiColor = {
  R: number
  G: number
  B: number
  A: number
}

export type ApiPlayer = {
  x: number
  y: number
  width: number
  height: number
  color: ApiColor
  score: number
  isAI: boolean
}

export type ApiBall = {
  cx: number
  cy: number
  radius: number
  vx: number
  vy: number
  color: ApiColor
}
