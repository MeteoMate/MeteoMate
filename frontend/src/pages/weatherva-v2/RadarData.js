
import Sidebar from "./components/sidebar/Sidebar"
import TimeSlider from "./components/time-slider/TimeSlider";
import Map from './containers/map/Map';
import React, { useEffect, useState } from "react";



import { useDispatch, useSelector } from "react-redux";
import { useGetReportsQuery, useGetTrajectoriesQuery, useGetRadarQuery, useGetBZCQuery } from "./features/apiSlice";

import { radarUpdated, bzcUpdated, reportsUpdated, trajectoriesUpdated } from "./features/DataSlice";
import { setSelectedTimestep, setLoading } from "./features/FiltersSlice";

// memoizing components
const MemoizedMap = React.memo(Map);
const MemoizedSidebar = React.memo(Sidebar);
const MemoizedTimeSlider = React.memo(TimeSlider);

const RadarData = () => {
    const dispatch = useDispatch()
    const [selectedTimestamp, setSelectedTimestamp] = useState();

    const stepInMinutes = 5;
    const [starttime, endtime] = useSelector((state) => state.filters.timeRange);
    const [step, setStep] = useState(0);
    const [isDragging, setIsDragging] = useState(false);


    const timeStampToString = (timestamp) => {

        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    const categories = useSelector((state) => state.filters.categories)
    const images = useSelector(state => state.savings.current.images)

    const trajectoriesflag = useSelector((state) => state.filters.trajectoriesflag);
    const reportsAccumulatedFlag = useSelector((state) => state.filters.reportsAccumulatedFlag);
    const radarCZCFlag = useSelector((state) => state.filters.radarCZCFlag);
    const radarBZCFlag = useSelector((state) => state.filters.radarBZCFlag);

    const { data, error, isLoading, refetch: refetchReports, isSuccess } = useGetReportsQuery({
        starttime: starttime,
        endtime: endtime,
        categories: categories,
        images: images
    }, { skip: reportsAccumulatedFlag || isDragging, });

    const { data: trajectoriesData, error: trajectoriesError, isLoading: trajectoriesLoading, refetch: trajectoriesRefetch, isSuccess: trajectoriesSuccess } = useGetTrajectoriesQuery({
        starttime: timeStampToString(starttime - (2 * 60 * 60 * 1000)), // Add 2 hours in milliseconds to starttime
        endtime: timeStampToString(endtime - (2 * 60 * 60 * 1000)), // Add 2 hours in milliseconds to endtime
    }, { skip: !trajectoriesflag || isDragging });


    const { data: radarData, error: radarError, isLoading: radarIsLoading, refetch: radarRefetch, isSuccess: radarIsSuccesss } = useGetRadarQuery({
        starttime: starttime,
        endtime: endtime,
    }, { skip: !radarCZCFlag || isDragging, });


    const { data: bzcData, error: bzcError, isLoading: bzcIsLoading, refetch: bzcRefetch, isSuccess: bzcIsSuccess } = useGetBZCQuery({
        starttime: starttime,
        endtime: endtime,
    }, { skip: !radarBZCFlag || isDragging, });


    useEffect(() => {
        if (isLoading) {
            dispatch(setLoading({ loadingFlag: true }))
        } else if (isSuccess) {
            dispatch(reportsUpdated({ reports: data }))
            dispatch(setLoading({ loadingFlag: false }))
        } else if (error) {
            console.log(error)
        }
        if (trajectoriesLoading) {
            dispatch(setLoading({ loadingFlag: true }));
        }
        else if (trajectoriesSuccess) {
            dispatch(trajectoriesUpdated({ trajectories: trajectoriesData }));
            dispatch(setLoading({ loadingFlag: false }));
        } else if (trajectoriesError) {
            console.log(trajectoriesError)
        }
        if (radarIsLoading) {
            dispatch(setLoading({ loadingFlag: true }));
        } else if (radarIsSuccesss) {
            dispatch(radarUpdated({ radar: radarData }))
            dispatch(setLoading({ loadingFlag: false }));
        } else if (radarError) {
            console.log(error)
        }
        if (bzcIsLoading) {
            dispatch(setLoading({ loadingFlag: true }));
        } else if (bzcIsSuccess) {
            dispatch(bzcUpdated({ radar: bzcData }))
            dispatch(setLoading({ loadingFlag: false }));
        } else if (bzcError) {
            console.log(error)
        }
    }, [isLoading, isSuccess, error, trajectoriesLoading, trajectoriesSuccess, trajectoriesError, radarIsLoading, radarIsSuccesss, radarError]);

    function toLocalISOString(timestring) {
        let localDate = new Date(timestring);
        let timezoneOffset = localDate.getTimezoneOffset() * 60000; // convert offset to milliseconds
        let adjustedDate = new Date(localDate.getTime() - timezoneOffset);
        return adjustedDate.toISOString();
    }

    function setTimestamps() {
        const timesStamp = starttime + (step) * stepInMinutes * 1000 * 60;
        dispatch(setSelectedTimestep(timesStamp));
        const timeString = new Date(timesStamp).toISOString();
        const date = new Date(timeString);
        setSelectedTimestamp(date.toISOString());
    };


    useEffect(() => {
        setTimestamps();
    }, [step, reportsAccumulatedFlag, trajectoriesflag, radarCZCFlag, starttime]);


    return (
        <div className="App" style={{ overflow: "hidden" }}>

            <MemoizedSidebar />
            <div id="Map">

                <MemoizedMap selectedTimestamp={selectedTimestamp} />

                <MemoizedTimeSlider
                    startDate={starttime}
                    endDate={endtime}
                    stepInMinutes={stepInMinutes}
                    setStep={setStep}
                    setIsDragging={setIsDragging}

                />
            </div>
        </div>
    );
}

export default RadarData;
