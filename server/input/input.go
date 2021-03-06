package input

import (
	"sync"
	"time"
)

type keyPressedMap struct {
	keys map[Key]time.Time
	m    sync.RWMutex
}

var (
	theKeyPressMap = keyPressedMap{
		keys: make(map[Key]time.Time),
		m:    sync.RWMutex{},
	}
)

const keyPressedValidity = 50 // 50 milliseconds

func AddPressedKey(k Key, t time.Time) {
	theKeyPressMap.m.Lock()
	current := theKeyPressMap.keys[k]
	if t.Sub(current) > 0 {
		theKeyPressMap.keys[k] = t
	}
	theKeyPressMap.m.Unlock()
}

func IsKeyPressed(k Key) bool {
	theKeyPressMap.m.RLock()
	defer theKeyPressMap.m.RUnlock()
	return time.Since(theKeyPressMap.keys[k]).Milliseconds() <= keyPressedValidity
}
