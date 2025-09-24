import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StyledTextField } from "../../../../static/style/muiStyling";
import { timeRangeUpdated } from "../../features/FiltersSlice"

const StyledTimeTextField = styled(StyledTextField)({
    width: "100%",
    '& label': {
        color: 'black',
    },
    paddingTop: "0px",
    marginTop: "10px",
    marginBottom: "15px"
})

const timePaperProps = {
    sx: {
        boxShadow: "#000000c4 0px 0px 5px",
        "& .MuiPickersDay-root.Mui-selected": {
            backgroundColor: "var(--main-bg-color)",
        },
        "& .MuiPickersDay-root.Mui-selected:hover": {
            backgroundColor: "var(--main-bg-color)",
            boxShadow: "1px 1px var(--shadow-bg-color)"
        },
        "& .css-118whkv": {
            backgroundColor: "var(--main-bg-color)",
            border: "16px solid var(--border-bg-color)",
        },
        "& .css-7lip4c": {
            backgroundColor: "var(--main-bg-color)",
        },
        "& .css-12ha4i7": {
            backgroundColor: "var(--main-bg-color)",
        },
        "& .css-a1rc6s": {
            backgroundColor: "var(--main-bg-color)",
        },
        "& .css-2ujp1m": {
            border: "16px solid var(--border-bg-color)",
        }
    }
}

const totalTimeRange = [new Date("2021-10-07T06:00Z").getTime(), new Date("2022-06-02T18:00Z").getTime()]

export default function TimePicker() {
    const dispatch = useDispatch()

    const timeRange = useSelector(state => {
        return state.filters.timeRange
    })

    const handleStartTimeChange = (val) => {
        if (!isNaN(val)) {
            let startVal = val.getTime()
            if (startVal < totalTimeRange[0]) {
                startVal = totalTimeRange[0]
            } else if (startVal > totalTimeRange[1]) {
                startVal = totalTimeRange[1]
            }
            dispatch(timeRangeUpdated({
                timeRange: [startVal,
                    timeRange[1]]
            }))
        }
    }

    const handleEndTimeChange = (val) => {
        let endVal = val.getTime()
        if (endVal > totalTimeRange[1]) endVal = totalTimeRange[1]
        dispatch(timeRangeUpdated({ timeRange: [timeRange[0], endVal] }))
    }

    return (
        <div>
            <p>Time range</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    ampm={false}
                    PaperProps={timePaperProps}
                    inputFormat="dd.MM.yyyy HH:mm"
                    label="Start time"
                    minDate={totalTimeRange[0]}
                    maxDate={totalTimeRange[1]}
                    value={timeRange[0]}
                    onChange={handleStartTimeChange}
                    renderInput={(params) => <StyledTimeTextField size={"small"} {...params} />}
                    sx={{}}
                />
                <DateTimePicker
                    ampm={false}
                    PaperProps={timePaperProps}
                    inputFormat="dd.MM.yyyy HH:mm"
                    renderInput={(params) => <StyledTimeTextField size={"small"} {...params} />}
                    label="End time"
                    minDate={timeRange[0]}
                    maxDate={totalTimeRange[1]}
                    value={timeRange[1]}
                    onChange={handleEndTimeChange}
                />
            </LocalizationProvider>
        </div>
    )
}
