package pong

import "image/color"

type Ball struct {
	Cx     float32     `json:"cx"`
	Cy     float32     `json:"cy"`
	Radius float32     `json:"radius"`
	Vx     float32     `json:"vx"`
	Vy     float32     `json:"vy"`
	Color  color.Color `json:"color"`
}

func (b *Ball) Update(leftPaddle *Paddle, rightPaddle *Paddle, screen *Screen) {
	_, h := screen.Size()

	nextX := b.Cx + b.Vx
	nextY := b.Cy + b.Vy

	// Bounce off top and bottom edges
	if nextY+b.Radius > h || b.Cy-b.Radius < 0 {
		b.Vy = -b.Vy
	}

	// bounce off right paddle
	if b.Vx > 0 &&
		nextX+b.Radius > rightPaddle.X &&
		b.Cy+b.Radius > rightPaddle.Y &&
		b.Cy-b.Radius < rightPaddle.Y+float32(rightPaddle.Height) &&
		nextX+b.Radius < rightPaddle.X+float32(rightPaddle.Width) {
		b.Vx = -b.Vx
	} else if b.Vx < 0 &&
		b.Cx-b.Radius < leftPaddle.X+float32(leftPaddle.Width) &&
		b.Cy+b.Radius > leftPaddle.Y &&
		b.Cy-b.Radius < leftPaddle.Y+float32(leftPaddle.Height) &&
		b.Cx-b.Radius > leftPaddle.X {
		b.Vx = -b.Vx
	}

	// Make move
	b.Cx += b.Vx
	b.Cy += b.Vy
}
