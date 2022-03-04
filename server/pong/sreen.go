package pong

type Screen struct {
	W float32 `json:"width"`
	H float32 `json:"height"`
}

func (s Screen) Size() (float32, float32) {
	return s.W, s.H
}
