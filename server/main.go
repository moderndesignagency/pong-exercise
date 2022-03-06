package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/moderndesignagency/pong-exercise/server/ws"
)

var g *Game
var addr = flag.String("addr", ":"+os.Getenv("PORT"), "http service address")

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func getGameState(rw http.ResponseWriter, r *http.Request) {
	setupResponse(&rw, r)
	if (*r).Method == "OPTIONS" {
		return
	}
	rw.Header().Set("Content-Type", "application/json")
	json.NewEncoder(rw).Encode(g)
}

func main() {
	g = NewGame()
	hub := ws.NewHub()

	go hub.Run()
	go g.Start(hub)

	http.HandleFunc("/", getGameState)
	http.HandleFunc("/ws", func(rw http.ResponseWriter, r *http.Request) {
		ws.ServeWs(hub, rw, r)
	})

	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatal("ListenAndServe error", err)
	}
}
