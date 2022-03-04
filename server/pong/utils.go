package pong

import (
	"image/color"
	"math/rand"
)

var foregroundColors = []color.Color{
	color.RGBA{073, 126, 118, 255},
	color.RGBA{100, 036, 036, 255},
	color.RGBA{034, 113, 179, 255},
	color.RGBA{222, 076, 138, 255},
	color.RGBA{0, 0, 0, 255},
}

func RandomColor() color.Color {
	return foregroundColors[rand.Intn(len(foregroundColors))]
}
