import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { timeRangeUpdated } from "../../features/FiltersSlice"
import { styled } from "@mui/material/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";


const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    '& .MuiToggleButtonGroup-grouped': {
        '&:not(:first-of-type)': {
            border: "var(--border-bg-color) solid 2px",
            borderRadius: "4px",
            "&.Mui-selected": {
                border: "var(--border-bg-color) solid 2px !important",
                color: "black"
            },
        },
        '&:first-of-type': {
            border: "var(--border-bg-color) solid 2px",
            borderRadius: "4px",
            marginLeft: "0",
            "&.Mui-selected": {
                border: "var(--border-bg-color) solid 2px",
                color: "black"
            },
        },
    },
})

const StyledToggleButton = styled(ToggleButton)({
    border: "var(--border-bg-color) solid 2px",
    width: "49%",
    height: "42px",
    margin: "1px",
    padding: "4px",
    color: "black",
    fontSize: "0.74em",
    lineHeight: "18px",
    "&.Mui-selected": {
        backgroundColor: "var(--main-bg-color)",
        color: "black"
    },
    "&.Mui-selected:hover": {
        backgroundColor: "var(--border-bg-color)",
        boxShadow: "1px 1px var(--shadow-bg-color)"
    },
    "&:hover": {
        backgroundColor: "var(--light-bg-color)",
        boxShadow: "1px 1px var(--border-bg-color)"
    }
})


const MemoizedStyledToggleButtonGroup = React.memo(StyledToggleButtonGroup);
const MemoizedStyledStyledToggleButton = React.memo(StyledToggleButton);

const CategorySelector = () => {
    const dispatch = useDispatch()


    const [selectedEvent] = useSelector(state => {
        return [state.filters.selectedEvent];
    }, shallowEqual);


    const handleClick = (item) => {
        dispatch(timeRangeUpdated({ timeRange: [item.startTime, item.endTime] }))

    }

    const events = [
        {
            value: "event-1",
            label: "Filter by time",
            startTime: new Date('2022-05-04 11:00').getTime(),
            endTime: new Date('2022-05-04 21:00').getTime(),
        }
    ]



    return (
        <div>
            <p>Events</p>
            <MemoizedStyledToggleButtonGroup
                color="primary"
            >
                {events.map(item => {
                    return <MemoizedStyledStyledToggleButton
                        key={item.value}
                        className="typeButton"
                        value={item.value}
                        onClick={() => handleClick(item)}
                    >
                        {item.label}
                    </MemoizedStyledStyledToggleButton>
                })}
            </MemoizedStyledToggleButtonGroup>
        </div>
    )
}

export default CategorySelector;
