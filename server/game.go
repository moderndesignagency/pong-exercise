package main

import (
	"encoding/json"
	"image/color"
	"log"
	"os"
	"sync"
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
	initPaddleSpeed  = 9.0
	speedUpdateCount = 6
	speedIncrement   = 0.5
)

const (
	windowWidth  = 900.0
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
		IsAI:   os.Getenv("PLAYER1_AI") == "true",
	}
	g.Player2 = &pong.Paddle{
		X:      windowWidth - InitPaddleShift - InitPaddleWidth,
		Y:      (windowHeight - InitPaddleHeight) / 2,
		Score:  0,
		Speed:  initPaddleSpeed,
		Width:  InitPaddleWidth,
		Height: InitPaddleHeight,
		Color:  whiteColor,
		Up:     input.KeyUp,
		Down:   input.KeyDown,
		IsAI:   os.Getenv("PLAYER2_AI") == "true",
	}
	g.Ball = &pong.Ball{
		Cx:     float32(windowWidth / 2),
		Cy:     float32(windowHeight / 2),
		Radius: InitBallRadius,
		Color:  color.RGBA{255, 255, 255, 200},
		Vx:     float32(pong.RandomPlusOrMinusOne()) * initBallVelocity,
		Vy:     float32(pong.RandomPlusOrMinusOne()) * initBallVelocity / 2,
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
		g.Color = pong.RandomColor()
	}
	g.Player1.X = InitPaddleShift
	g.Player1.Y = (h - InitPaddleHeight) / 2
	g.Player1.Speed = initPaddleSpeed

	g.Player2.X = w - InitPaddleShift - InitPaddleWidth
	g.Player2.Y = (h - InitPaddleHeight) / 2
	g.Player1.Speed = initPaddleSpeed

	g.Ball.Cx = w / 2
	g.Ball.Cy = h / 2
	g.Ball.Vx = float32(pong.RandomPlusOrMinusOne()) * initBallVelocity
	g.Ball.Vy = float32(pong.RandomPlusOrMinusOne()) * initBallVelocity / 2
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

		g.Player1.Update(g.Screen, g.Ball)
		g.Player2.Update(g.Screen, g.Ball)

		prevVx := g.Ball.Vx
		g.Ball.Update(g.Player1, g.Player2, g.Screen)

		if prevVx*g.Ball.Vx < 0 {
			g.rally += 1
			if (g.rally)%speedUpdateCount == 0 {
				g.Level++
				g.Ball.Vx += pong.Sign(g.Ball.Vx) * speedIncrement
				g.Ball.Vy += pong.Sign(g.Ball.Vy) * speedIncrement / 2
				g.Player1.Speed += speedIncrement / 2
				g.Player2.Speed += speedIncrement / 2
			}
		}

		if g.Ball.Cx-g.Ball.Radius < 0 {
			g.Player2.Score += 1
			g.reset(PlayState)
		} else if g.Ball.Cx+g.Ball.Radius > float32(w) {
			g.Player1.Score += 1
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
	defer ticker.Stop()

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		countCall := 1
		for {
			<-ticker.C
			prevState := g.State
			input.UpdateInputState()
			g.update()
			countCall += 1

			if g.State == PlayState || (g.State == prevState && countCall%50 == 0) {
				if v, err := json.Marshal(g); err != nil {
					log.Fatalln("Error when Marshalling the game state", err)
				} else {
					hub.Broadcast <- v
				}
			}
		}
	}()
	wg.Wait()
}
