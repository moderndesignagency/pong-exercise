package pong

import (
	"image/color"
	"math/rand"
	"time"
)

var foregroundColors = []color.Color{
	color.RGBA{73, 126, 118, 200},
	color.RGBA{150, 36, 36, 200},
	color.RGBA{34, 113, 179, 200},
	color.RGBA{222, 076, 138, 200},
	color.RGBA{20, 20, 30, 200},
	color.RGBA{205, 102, 113, 200},
	color.RGBA{205, 160, 122, 200},
	color.RGBA{32, 178, 170, 200},
	color.RGBA{105, 106, 250, 200},
	color.RGBA{128, 0, 128, 200},
	color.RGBA{150, 150, 0, 200},
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
