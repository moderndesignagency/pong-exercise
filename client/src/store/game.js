import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import GameState from '../enums/game-state'
import Sockette from 'sockette'
import { createSlice } from '@reduxjs/toolkit'
import OnlineStatus from '../enums/online-status'

export const gameApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: build => ({
    getGameState: build.query({
      query: channel => channel,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getCacheEntry, dispatch }
      ) {
        let isCachedDataLoaded = false
        const listener = event => {
          const data = JSON.parse(event.data)
          const cachedEntry = getCacheEntry()
          if (
            !isCachedDataLoaded ||
            (data.state !== GameState.PLAY && data.state === cachedEntry.data?.state)
          ) {
            return
          }

          updateCachedData(() => {
            return data
          })
        }
        const ws = new Sockette('ws://localhost:8080/ws', {
          maxAttemps: 50,
          timeout: 5000,
          onmessage: listener,
          onopen: () => dispatch(updateOnlineStatus({ status: OnlineStatus.ONLINE })),
          onreconnect: () => dispatch(updateOnlineStatus({ status: OnlineStatus.RECONNECTING })),
          onerror: () => dispatch(updateOnlineStatus({ status: OnlineStatus.OFFLINE })),
        })
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded
          isCachedDataLoaded = true
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

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    onlineStatus: OnlineStatus.CONNECTING,
  },
  reducers: {
    updateOnlineStatus(state, { payload }) {
      const { status } = payload
      state.onlineStatus = status
    },
  },
})

export const { useGetGameStateQuery } = gameApi

export const { updateOnlineStatus } = gameSlice.actions
