import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../../helpers/constants'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getTrajectories: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams(params).toString();
        return `/trajectories?${queryParams}`;
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


        return `/reports?${queryParams}`;
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

        return `/radar?${queryParams}`;
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

        return `/radar-bzc?${queryParams}`;
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
