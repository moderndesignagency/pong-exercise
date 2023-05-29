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
	IsAI    bool        `json:"isAI"`
	pressed keysPressed
}

type keysPressed struct {
	up   bool
	down bool
}

func (p *Paddle) Update(screen *Screen, b *Ball) {
	if p.IsAI {
		p.AiUpdate(screen, b)
		return
	}

	_, h := screen.Size()

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

	if p.Y < 0 {
		p.Y = 0
	} else if p.Y+float32(p.Height) > h {
		p.Y = h - float32(p.Height)
	}
}

func (p *Paddle) AiUpdate(screen *Screen, b *Ball) {
	if (p.X-b.Cx)*b.Vx < 0 {
		return
	}
	_, h := screen.Size()

	middleBarHeight := p.Y + float32(p.Height)/2
	if b.Cy < middleBarHeight-float32(p.Height)/4 {
		p.Y -= p.Speed
	} else if b.Cy > middleBarHeight+float32(p.Height)/4 {
		p.Y += p.Speed
	}

	if p.Y < 0 {
		p.Y = 0
	} else if p.Y+float32(p.Height) > h {
		p.Y = h - float32(p.Height)
	}
}
