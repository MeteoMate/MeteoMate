import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './features/SettingsSlice'
import savedReducer from './features/SavingsSlice'
import histogramReducer from './features/HistogramSlice'
import mapReducer from './features/MapSlice'
import comparisonReducer from './features/ComparisonSlice'
import playerReducer from './features/PlayerSlice'
import filtersReducer from '../../pages/weatherva-v2/features/FiltersSlice'
import dataReducer from '../../pages/weatherva-v2/features/DataSlice'
import { apiSlice } from '../../pages/weatherva-v2/features/apiSlice'

export default configureStore({
    reducer: {
        settings: settingsReducer,
        savings: savedReducer,
        histogram: histogramReducer,
        map: mapReducer,
        comparison: comparisonReducer,
        player: playerReducer,
        filters: filtersReducer,
        data: dataReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiSlice.middleware),
});
