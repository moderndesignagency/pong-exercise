import OnlineStatus from '../../enums/online-status'
import { createSlice } from '@reduxjs/toolkit'

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

export const { updateOnlineStatus } = gameSlice.actions
