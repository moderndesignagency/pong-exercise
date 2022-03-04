import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { gameApi, gameSlice } from './game'

export const store = configureStore({
  reducer: {
    [gameApi.reducerPath]: gameApi.reducer,
    [gameSlice.name]: gameSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(gameApi.middleware),
})

setupListeners(store.dispatch)
