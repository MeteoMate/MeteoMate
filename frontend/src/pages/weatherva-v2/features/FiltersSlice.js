import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  timeRange: [new Date("2022-05-04T11:00Z").getTime(), new Date("2022-05-04T21:00Z").getTime()],
  categories: [],
  intensities: [],
  pictures: 0,
  trajectoriesflag: false,
  reportsAccumulatedFlag: false,
  radarCZCFlag: false,
  radarBZCFlag: false,
  selectedTimestamp: null,
  loadingFlag: false
}



const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    timeRangeUpdated(state, action) {
      const { timeRange } = action.payload;
      state.timeRange = timeRange;
    },
    categoriesUpdated(state, action) {
      const { categories } = action.payload;
      state.categories = categories;
    },
    intensitiesUpdated(state, action) {
      const { intensities } = action.payload;
      state.intensities = intensities;

    },
    getTrajectoriesUpdated(state, action) {
      const { trajectoriesflag } = action.payload;
      state.trajectoriesflag = trajectoriesflag;
    },
    getAccumulatedReports(state, action) {
      const { reportsAccumulatedFlag } = action.payload;
      state.reportsAccumulatedFlag = reportsAccumulatedFlag;
    },
    getCZCRadar(state, action) {
      const { radarCZCFlag } = action.payload;
      state.radarCZCFlag = radarCZCFlag;
    },
    getBZCRadar(state, action) {
      const { radarBZCFlag } = action.payload;
      state.radarBZCFlag = radarBZCFlag;
    },
    setLoading(state, action) {
      const { loadingFlag } = action.payload;
      state.loadingFlag = loadingFlag;
    },
    setSelectedTimestep(state, action) {
      state.selectedTimestamp = action.payload;
    }
  }
})

export const { timeRangeUpdated, getBZCRadar, categoriesUpdated, intensitiesUpdated, getTrajectoriesUpdated, getAccumulatedReports, getCZCRadar, setLoading, setSelectedTimestep } = filtersSlice.actions


export default filtersSlice.reducer