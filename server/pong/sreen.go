package pong

const (
	defaultScreenWidth  = 800.0
	defaultScreenHeight = 600.0
)

type Screen struct {
	W float32 `json:"width"`
	H float32 `json:"height"`
}

func (s Screen) Size() (float32, float32) {
	return s.W, s.H
}
