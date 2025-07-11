import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Slider from 'react-input-slider';
import './time-slider.scss';
import { CircularProgress } from "@mui/material";


const dateToString = (selectedTime) => {
    const selectedDate = new Date(selectedTime);
    return `${selectedDate.getDate()}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()} - ${selectedDate.toLocaleTimeString().replace(/:\d+\s/, ' ')}`;
}

export default function TimeSlider(props) {
    const { stepInMinutes, initialSliderValue, setStep, setIsDragging } = props;

    const timeRange = useSelector((state) => state.filters.timeRange);
    const loadingFlag = useSelector((state) => state.filters.loadingFlag);

    const totalMinutes = Math.floor((timeRange[1] - timeRange[0]) / (60 * 1000));

    const [sliderValue, setSliderValue] = useState(initialSliderValue);
    const [selectedDate, setSelectedDate] = useState(timeRange[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };


    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                const newValue = sliderValue + 1;
                if (newValue <= totalMinutes / stepInMinutes) {
                    setSliderValue(newValue);
                } else {
                    setIsPlaying(false);
                }
            }, 1000); // Adjust the interval (in milliseconds) as needed

            return () => clearInterval(interval);
        }
    }, [isPlaying, sliderValue, stepInMinutes, totalMinutes]);



    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        setStep(sliderValue);
        const newDate = new Date(timeRange[0]);
        newDate.setMinutes(new Date(timeRange[0]).getMinutes() + sliderValue * stepInMinutes);

        setSelectedDate(newDate);
    }, [sliderValue, timeRange]);

    useEffect(() => {
        if (loadingFlag) {
            setIsPlaying(false); // Pause the slider when loading
        }
    }, [loadingFlag]);

    return (

        <div className="time-slider--wrapper">
            {loadingFlag ? (
                <div className="loading-indicator">
                    <CircularProgress size={70} />
                </div>
            ) : (
                <div className="time-slider">
                    <button className="time-slider__play-button" onClick={togglePlay}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <Slider
                        axis="x"
                        x={sliderValue}
                        xmin={0}
                        xmax={totalMinutes / stepInMinutes}
                        onChange={({ x }) => setSliderValue(x)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                    <div className="time-slider__selected-date">
                        {dateToString(selectedDate)}
                    </div>

                </div>)}

        </div>

    );
}

TimeSlider.defaultProps = {
    stepInMinutes: 5,
    initialSliderValue: 0
};