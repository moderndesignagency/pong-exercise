package pong

import (
	"image/color"
	"math/rand"
	"time"
)

var foregroundColors = []color.Color{
	color.RGBA{073, 126, 118, 200},
	color.RGBA{100, 036, 036, 200},
	color.RGBA{034, 113, 179, 200},
	color.RGBA{222, 076, 138, 200},
	color.RGBA{0, 0, 0, 200},
}

func RandomColor() color.Color {
	source := rand.NewSource(time.Now().UnixMicro())
	r := rand.New(source)
	return foregroundColors[r.Intn(len(foregroundColors))]
}

func RandomPlusOrMinusOne() int {
	source := rand.NewSource(time.Now().UnixMicro())
	r := rand.New(source)
	if r.Intn(100) < 50 {
		return -1
	}
	return 1
}

func Sign(f float32) float32 {
	if f < 0 {
		return -1
	}
	return 1
}
