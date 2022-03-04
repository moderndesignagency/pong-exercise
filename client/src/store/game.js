import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import GameState from '../enums/game-state'

export const gameApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: build => ({
    getGameState: build.query({
      query: channel => channel,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getCacheEntry }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://localhost:8080/ws')
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = event => {
            const data = JSON.parse(event.data)
            // console.log(data)
            const cachedEntry = getCacheEntry()
            if (data.state !== GameState.PLAY && data.state === cachedEntry.data?.state) {
              return
            }
            // console.log(cachedEntry);

            updateCachedData(() => {
              return data
            })
          }

          ws.addEventListener('message', listener)
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        console.log('Closing the socket connection')
        ws.close()
      },
    }),
  }),
})

export const { useGetGameStateQuery } = gameApi
