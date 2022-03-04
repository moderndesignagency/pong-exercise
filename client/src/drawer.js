import GameState from './enums/game-state'

export function setupCanvas(canvas) {
  canvas.setAttribute('width', '800')
  canvas.setAttribute('height', '600')
}

export function draw(canvas, gameState) {
  const ctx = canvas.getContext('2d')

  if (gameState.state !== GameState.PLAY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  drawRect(ctx, 0, 0, canvas.width, canvas.height, parseColor(gameState.color))

  // Drawing ball
  drawCircle(
    ctx,
    gameState.ball.cx + gameState.ball.radius,
    gameState.ball.cy + gameState.ball.radius,
    gameState.ball.radius,
    'white'
  )

  // Drawing paddles
  drawRect(
    ctx,
    gameState.player1.x,
    gameState.player1.y,
    gameState.player1.width,
    gameState.player1.height,
    'white'
  )
  drawRect(
    ctx,
    gameState.player2.x,
    gameState.player2.y,
    gameState.player2.width,
    gameState.player2.height,
    'white'
  )

  // Score
  ctx.textAlign = 'center'
  ctx.font = '200px Arial'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.fillText(gameState.player1.score, 170, 300)
  ctx.fillText(gameState.player2.score, canvas.width - 190, 300)

  // Players
  ctx.font = '30px Arial'
  ctx.fillText('Player 1', 170, 140)
  ctx.fillText('Player 2', canvas.width - 190, 140)

  // Level
  ctx.font = '20px Arial'
  ctx.fillText(`Level: ${gameState.level}`, canvas.width / 2, 30)
}

function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.fill()
}

function drawCircle(ctx, cx, cy, radius, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2, true)
  ctx.fill()
}

function parseColor(color) {
  return `rgba(${color.R}, ${color.G}, ${color.B}, ${color.A / 255})`
}
