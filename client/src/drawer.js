export function setupCanvas(canvas) {
  canvas.setAttribute('width', '800')
  canvas.setAttribute('height', '600')
}

export function draw(canvas, gameState) {
  const ctx = canvas.getContext('2d')

  drawRect(ctx, 0, 0, canvas.width, canvas.height, 'black')

  // Drawing ball
  drawCircle(
    ctx,
    gameState.ball.X + gameState.ball.Radius,
    gameState.ball.Y + gameState.ball.Radius,
    gameState.ball.Radius,
    'white'
  )

  // Drawing paddles
  drawRect(
    ctx,
    gameState.Player1.X,
    gameState.Player1.Y,
    gameState.Player1.Width,
    gameState.Player1.Height,
    'white'
  )
  drawRect(
    ctx,
    gameState.Player2.X,
    gameState.Player2.Y,
    gameState.Player2.Width,
    gameState.Player2.Height,
    'white'
  )

  // Score
  ctx.font = "150px Arial";
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "white";
  ctx.fillText(gameState.Player1.Score, 100, 200);
  ctx.fillText(gameState.Player2.Score, canvas.width - 150, 200);
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
