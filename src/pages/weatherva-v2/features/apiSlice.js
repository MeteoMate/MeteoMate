import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../../helpers/constants'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getTrajectories: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/api/v1/trajectories?${queryParams}`;
      },
    }),
    getReports: builder.query({
      query: ({ categories, starttime, endtime, images }) => {
        const queryParams = new URLSearchParams();

        if (categories) {
          categories.forEach(category => queryParams.append('category', category));
        }

        if (starttime) {
          queryParams.set('starttime', starttime);
        }

        if (endtime) {
          queryParams.set('endtime', endtime);
        }

        if (images) {
          queryParams.set('images', images);
        }


        return `/api/v1/reports?${queryParams}`;
      },
    }),
    getRadar: builder.query({
      query: ({ starttime, endtime }) => {
        const queryParams = new URLSearchParams();

        if (starttime) {
          queryParams.set('starttime', starttime);
        }

        if (endtime) {
          queryParams.set('endtime', endtime);
        }

        return `/api/v1/radar-czc?${queryParams}`;
      },
    }),
    getBZC: builder.query({
      query: ({ starttime, endtime }) => {
        const queryParams = new URLSearchParams();

        if (starttime) {
          queryParams.set('starttime', starttime);
        }

        if (endtime) {
          queryParams.set('endtime', endtime);
        }

        return `/api/v1/radar-bzc?${queryParams}`;
      },
    })
  }),
})

export const {
  useGetTrajectoriesQuery,
  useGetReportsQuery,
  useGetRadarQuery,
  useGetBZCQuery
} = apiSlice
