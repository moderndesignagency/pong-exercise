import GameState from '../enums/game-state'
import { startConfetti, stopConfetti } from './confetti'
import { renderProton } from './dragon'

const game = {
  hitPaddleAudio: new Audio('/assets/audio/hit_paddle.mp3'),
  hitWallAudio: new Audio('/assets/audio/hit_paddle.mp3'),
  previousState: null,
  FPS: 50,
}

function scaleCanvas(canvas) {
  const parentHeight = canvas.parentElement.parentElement.offsetHeight
  const parentWidth = canvas.parentElement.parentElement.offsetWidth
  canvas.style.transform = `scale(${Math.min(
    parentHeight / canvas.height,
    parentWidth / canvas.width
  )})`
}

export function initCanvas(canvas) {
  canvas.setAttribute('width', '900')
  canvas.setAttribute('height', '600')
  scaleCanvas(canvas)
  game.hitPaddleAudio.volume = 0.6
  game.hitWallAudio.volume = 0.6

  window.addEventListener('resize', () => scaleCanvas(canvas))
}

/**
 * Draws the current game state on the canvas
 * @param {HTMLCanvasElement} canvas
 * @param {*} gameState The current game state
 */
export function draw(canvas, gameState) {
  window.canvas = canvas
  canvas.width = gameState.screen.width
  canvas.height = gameState.screen.height

  if (gameState.state === GameState.OVER) {
    drawGameOver(canvas, gameState)
  } else if (gameState.state === GameState.START) {
    drawGameStart(canvas, gameState)
  } else {
    drawGamePlay(canvas, gameState)
  }
}

// Game drawing functions

function drawGamePlay(canvas, gameState) {
  const ctx = canvas.getContext('2d')
  drawRect(ctx, 0, 0, canvas.width, canvas.height, parseColor(gameState.color))
  stopConfetti()

  const { previousState } = game
  if (
    previousState &&
    Math.abs(previousState.ball.vy + gameState.ball.vy) < 1e-6 &&
    Math.abs(previousState.ball.cy - gameState.ball.cy) < 1e-6
  ) {
    game.hitWallAudio.play()
    shakeGameScene(ctx, gameState.ball.vy > 0 ? -4 : 4)
  }

  drawCircle(
    ctx,
    gameState.ball.cx,
    gameState.ball.cy,
    gameState.ball.radius,
    parseColor(gameState.ball.color)
  )
  renderProton(gameState.ball)

  if (
    previousState &&
    Math.abs(previousState.ball.vx + gameState.ball.vx) < 1e-6 &&
    Math.abs(previousState.ball.cx - gameState.ball.cx) < 1e-6
  ) {
    game.hitPaddleAudio.play()
  }

  drawRect(
    ctx,
    gameState.player1.x,
    gameState.player1.y,
    gameState.player1.width,
    gameState.player1.height,
    parseColor(gameState.player1.color)
  )
  drawRect(
    ctx,
    gameState.player2.x,
    gameState.player2.y,
    gameState.player2.width,
    gameState.player2.height,
    parseColor(gameState.player1.color)
  )

  ctx.textAlign = 'center'
  ctx.font = 'bold 200px "Patrick Hand"'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.fillText(gameState.player1.score, 170, 300)
  ctx.fillText(gameState.player2.score, canvas.width - 190, 300)

  ctx.font = '30px "Patrick Hand"'
  ctx.fillText('PLAYER 1', 170, 140)
  ctx.fillText('PLAYER 2', canvas.width - 190, 140)

  drawControlsAndLevel(canvas, gameState)
  game.previousState = gameState
}

function drawGameStart(canvas, gameState) {
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawRect(ctx, 0, 0, canvas.width, canvas.height, parseColor(gameState.color))
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3

  ctx.font = 'bold 90px "Patrick Hand"'
  ctx.strokeText('???PONG GAME???', canvas.width / 2, 200)

  ctx.font = '50px "Patrick Hand"'
  ctx.fillText('Hit Space to start a new Game', canvas.width / 2, 300)
}

function drawGameOver(canvas, gameState) {
  const ctx = canvas.getContext('2d')
  const middleWidth = canvas.width / 2
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawRect(ctx, 0, 0, canvas.width, canvas.height, parseColor(gameState.color))
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3

  ctx.font = 'bold 100px "Patrick Hand"'
  ctx.strokeText('GAME OVER', middleWidth, 200)

  ctx.font = 'bold 70px "Patrick Hand"'
  ctx.fillText(
    `??? PLAYER ${gameState.player1.score > gameState.player2.score ? 1 : 2} Won ???`,
    middleWidth,
    320
  )

  ctx.font = '50px "Patrick Hand"'
  ctx.fillText('Hit Space to start a new Game', middleWidth, 400)

  drawControlsAndLevel(canvas, gameState)
  if (game.previousState) startConfetti()
}

// Utility functions

function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.fill()
  ctx.closePath()
}

function drawCircle(ctx, cx, cy, radius, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2, true)
  ctx.fill()
  ctx.closePath()
}

function parseColor(color) {
  return `rgba(${color.R}, ${color.G}, ${color.B}, ${color.A / 255})`
}

function drawControlsAndLevel(canvas, gameState) {
  const ctx = canvas.getContext('2d')
  ctx.font = '25px "Patrick Hand"'
  ctx.fillText(`Level: ${gameState.level}`, canvas.width / 2, 30)

  ctx.textAlign = 'left'
  ctx.fillText('Controls: W/S', 30, canvas.height - 30)
  ctx.fillText(
    `${gameState.player1.isAI ? 'Computer' : 'Human'}: ${gameState.player1.score}`,
    30,
    canvas.height - 60
  )
  ctx.textAlign = 'right'
  ctx.fillText('Controls: Up/Down', canvas.width - 30, canvas.height - 30)
  ctx.fillText(
    `${gameState.player2.isAI ? 'Computer' : 'Human'}: ${gameState.player2.score}`,
    canvas.width - 30,
    canvas.height - 60
  )
}

function shakeGameScene(ctx, dy) {
  if (Math.abs(dy) < 1) {
    ctx.translate(0, 0)
    return
  }
  ctx.translate(0, dy)
  setTimeout(() => shakeGameScene(ctx, -dy / 2), 1000 / game.FPS)
}
