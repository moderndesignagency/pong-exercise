package input

type Key string

const (
	KeyUp    Key = "up"
	KeyDown  Key = "down"
	KeyW     Key = "w"
	KeyS     Key = "s"
	KeySpace Key = "space"
)

var AllKeys = map[Key]bool{
	KeyDown:  true,
	KeyUp:    true,
	KeyW:     true,
	KeyS:     true,
	KeySpace: true,
}

func (k Key) IsValid() bool {
	return AllKeys[k]
}
