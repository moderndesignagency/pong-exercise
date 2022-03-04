package main

type GameState byte

const (
	StartState GameState = iota
	PlayState
	GameOverState
)
