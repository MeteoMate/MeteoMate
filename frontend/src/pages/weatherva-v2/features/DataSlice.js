import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  reports: null,
  accumulatedReports: null,
  trajectories: null,
  radar: {},
  bzc: {}
}


const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    reportsUpdated(state, action) {
      const { reports } = action.payload;
      state.reports = reports;
    },
    accumulatedReportsUpdated(state, action) {
      const { accumulatedReports } = action.payload;
      state.accumulatedReports = accumulatedReports;
    },
    radarUpdated(state, action) {
      const { radar } = action.payload
      state.radar = radar;
    },
    bzcUpdated(state, action) {
      const { radar } = action.payload
      state.bzc = radar;
    },
    trajectoriesUpdated(state, action) {
      const { trajectories } = action.payload
      state.trajectories = trajectories;
    }
  }
})

export const { reportsUpdated, accumulatedReportsUpdated, radarUpdated, bzcUpdated, trajectoriesUpdated } = dataSlice.actions

export default dataSlice.reducer