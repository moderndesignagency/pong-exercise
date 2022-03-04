import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: builder => ({
    getGameState: builder.query({
      query: () => '',
    }),
  }),
})

export const { useGetGameStateQuery } = gameApi
