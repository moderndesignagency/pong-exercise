import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import GameState from '../../enums/game-state'
import OnlineStatus from '../../enums/online-status'
import config from '../../config'
import { updateOnlineStatus } from './game-slice'

export const gameApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: config.apiURL }),
  endpoints: build => ({
    getGameState: build.query({
      query: channel => channel,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getCacheEntry, dispatch, extra }
      ) {
        const { ws } = extra
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          ws.onmessage = event => {
            let data
            try {
              data = JSON.parse(event.data)
            } catch (e) {
              console.error('Error when parsing JSON from server')
            }

            const cachedEntry = getCacheEntry()
            if (
              !data ||
              (data.state !== GameState.PLAY && data.state === cachedEntry.data?.state)
            ) {
              return
            }

            updateCachedData(() => {
              return data
            })
          }
          ws.onopen = () => dispatch(updateOnlineStatus({ status: OnlineStatus.ONLINE }))
          ws.onreconnect = () => dispatch(updateOnlineStatus({ status: OnlineStatus.RECONNECTING }))
          ws.onerror = () => dispatch(updateOnlineStatus({ status: OnlineStatus.OFFLINE }))

          ws.open()
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
