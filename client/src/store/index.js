import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { gameApi } from './game/game-api'
import { gameSlice } from './game/game-slice'
import websocket from './game/ws-client'

export const store = configureStore({
  reducer: {
    [gameApi.reducerPath]: gameApi.reducer,
    [gameSlice.name]: gameSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: { extraArgument: { ws: websocket } } }).concat(
      gameApi.middleware
    ),
})

setupListeners(store.dispatch)
