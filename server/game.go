package main

import (
	"encoding/json"
	"image/color"
	"log"
	"time"

	"github.com/moderndesignagency/pong-exercise/server/input"
	"github.com/moderndesignagency/pong-exercise/server/pong"
	"github.com/moderndesignagency/pong-exercise/server/ws"
)

type Game struct {
	State       GameState    `json:"state"`
	Ball        *pong.Ball   `json:"ball"`
	Player1     *pong.Paddle `json:"player1"`
	Player2     *pong.Paddle `json:"player2"`
	Screen      *pong.Screen `json:"screen"`
	Level       int          `json:"level"`
	color.Color `json:"color"`
	rally       int
	maxScore    int
}

const (
	InitBallRadius   = 10.0
	initBallVelocity = 5.0
	initPaddleSpeed  = 10.0
	speedUpdateCount = 6
	speedIncrement   = 0.5
)

const (
	windowWidth  = 800.0
	windowHeight = 600.0
)

const (
	InitPaddleWidth  = 20
	InitPaddleHeight = 100
	InitPaddleShift  = 50
)

var whiteColor = color.RGBA{255, 255, 255, 255}

// NewGame creates an initializes a new game
func NewGame() *Game {
	g := &Game{}
	g.Init()
	return g
}

func (g *Game) Init() {
	g.maxScore = 3
	g.State = StartState
	g.Color = pong.RandomColor()
	g.Screen = &pong.Screen{W: windowWidth, H: windowHeight}

	g.Player1 = &pong.Paddle{
		X:      InitPaddleShift,
		Y:      (windowHeight - InitPaddleHeight) / 2,
		Score:  0,
		Speed:  initPaddleSpeed,
		Width:  InitPaddleWidth,
		Height: InitPaddleHeight,
		Color:  whiteColor,
		Up:     input.KeyW,
		Down:   input.KeyS,
	}
	g.Player2 = &pong.Paddle{
		X:      windowWidth - InitPaddleShift - InitPaddleWidth,
		Y:      (windowHeight - InitPaddleHeight) / 2,
		Score:  2,
		Speed:  initPaddleSpeed,
		Width:  InitPaddleWidth,
		Height: InitPaddleHeight,
		Color:  whiteColor,
		Up:     input.KeyUp,
		Down:   input.KeyDown,
	}
	g.Ball = &pong.Ball{
		Cx:     float32(windowWidth / 2),
		Cy:     float32(windowHeight / 2),
		Radius: InitBallRadius,
		Color:  color.RGBA{255, 255, 255, 200},
		Vx:     initBallVelocity,
		Vy:     -initBallVelocity,
	}
	g.Level = 1
}

func (g *Game) reset(state GameState) {
	w, h := g.Screen.Size()
	g.State = state
	g.rally = 0
	g.Level = 1
	if state == StartState {
		g.Player1.Score = 0
		g.Player2.Score = 0
	}
	g.Player1.X = InitPaddleShift
	g.Player1.Y = (h - InitPaddleHeight) / 2

	g.Player2.X = w - InitPaddleShift - InitPaddleWidth
	g.Player2.Y = (h - InitPaddleHeight) / 2

	g.Ball.Cx = w / 2
	g.Ball.Cy = h / 2
	g.Ball.Vx = initBallVelocity
	g.Ball.Vy = -initBallVelocity
}

func (g *Game) update() {
	switch g.State {
	case StartState:
		if input.IsKeyJustPressed(input.KeySpace) {
			g.State = PlayState
		}

	case GameOverState:
		if input.IsKeyJustPressed(input.KeySpace) {
			g.reset(StartState)
			g.State = PlayState
		}

	case PlayState:
		w, _ := g.Screen.Size()

		g.Player1.Update(g.Screen)
		// g.Player2.Update(g.Screen)
		// @FixMe: remove the code above
		// g.Player1.AiUpdate(g.Screen, g.Ball)
		g.Player2.AiUpdate(g.Screen, g.Ball)

		prevVx := g.Ball.Vx
		g.Ball.Update(g.Player1, g.Player2, g.Screen)

		if prevVx*g.Ball.Vx < 0 {
			g.rally += 1
			if (g.rally)%speedUpdateCount == 0 {
				g.Level++
				g.Ball.Vx += speedIncrement
				g.Ball.Vy += speedIncrement
				g.Player1.Speed += speedIncrement
				g.Player2.Speed += speedIncrement
			}
		}

		if g.Ball.Cx-g.Ball.Radius < 0 {
			g.Player2.Score += 1
			g.reset(PlayState)
		} else if g.Ball.Cx+g.Ball.Radius > float32(w) {
			g.Player1.Score += 1
			g.reset(PlayState)
		} else if g.Level > 20 {
			// @FixMe: remove this code
			g.Player1.Score += 1
			g.Player2.Score += 1
			g.reset(PlayState)
		}

		if g.Player1.Score == g.maxScore || g.Player2.Score == g.maxScore {
			g.State = GameOverState
		}
	}
}

func (g *Game) Start(hub *ws.Hub) {
	// 50 FPS
	ticker := time.NewTicker(time.Second / 50)

	go func() {
		for {
			<-ticker.C
			input.UpdateInputState()
			g.update()
			if v, err := json.Marshal(g); err != nil {
				log.Fatalln("Error when Marshalling the game state", err)
			} else {
				hub.Broadcast <- v
			}
		}
	}()

	// @FixMe: find a better solution
	time.Sleep(1000 * time.Hour)

	defer ticker.Stop()
}
