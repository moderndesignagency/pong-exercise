package pong

import (
	"image/color"

	"github.com/moderndesignagency/pong-exercise/server/input"
)

type Paddle struct {
	X       float32     `json:"x"`
	Y       float32     `json:"y"`
	Speed   float32     `json:"-"`
	Width   int         `json:"width"`
	Height  int         `json:"height"`
	Color   color.Color `json:"color"`
	Score   int         `json:"score"`
	Up      input.Key   `json:"-"`
	Down    input.Key   `json:"-"`
	pressed keysPressed
}

type keysPressed struct {
	up   bool
	down bool
}

func (p *Paddle) Update(screen *Screen) {
	_, h := screen.Size()

	// @Todo: Add the key management here
	if input.IsKeyJustPressed(p.Up) {
		p.pressed.down = false
		p.pressed.up = true
	} else if input.IsKeyJustReleased(p.Up) || !input.IsKeyPressed(p.Up) {
		p.pressed.up = false
	}
	if input.IsKeyJustPressed(p.Down) {
		p.pressed.up = false
		p.pressed.down = true
	} else if input.IsKeyJustReleased(p.Down) || !input.IsKeyPressed(p.Down) {
		p.pressed.down = false
	}

	if p.pressed.up {
		p.Y -= p.Speed
	} else if p.pressed.down {
		p.Y += p.Speed
	}

	if p.Y-float32(p.Height/2) < 0 {
		p.Y = 0
	} else if p.Y+float32(p.Height) > h {
		p.Y = h - float32(p.Height)
	}
}

func (p *Paddle) AiUpdate(screen *Screen, b *Ball) {
	meanPosition := b.Cy - float32(p.Height)/2
	_, h := screen.Size()

	if meanPosition < 0 {
		p.Y = 0
	} else if meanPosition+float32(p.Height) > h {
		p.Y = h - float32(p.Height)
	} else {
		p.Y = meanPosition
	}
}
