package input

import (
	"sync"
)

/**
 * This is inspired by the ebiten inputstate package
 */

type inputState struct {
	keyDurations     map[Key]int
	prevKeyDurations map[Key]int

	m sync.RWMutex
}

var theInputState = inputState{
	keyDurations:     make(map[Key]int),
	prevKeyDurations: make(map[Key]int),
	m:                sync.RWMutex{},
}

func UpdateInputState() {
	theInputState.m.Lock()
	for k := range AllKeys {
		theInputState.prevKeyDurations = theInputState.keyDurations
		if IsKeyPressed(k) {
			theInputState.keyDurations[k] += 1
		} else {
			theInputState.keyDurations[k] = 0
		}
	}
	theInputState.m.Unlock()
}

func KeyPressDuration(k Key) int {
	theInputState.m.RLock()
	d := theInputState.keyDurations[k]
	theInputState.m.RUnlock()
	return d
}

func IsKeyJustPressed(k Key) bool {
	return KeyPressDuration(k) == 1
}

func IsKeyJustReleased(k Key) bool {
	theInputState.m.RLock()
	r := theInputState.keyDurations[k] == 0 && theInputState.prevKeyDurations[k] > 0
	theInputState.m.RUnlock()
	return r
}
