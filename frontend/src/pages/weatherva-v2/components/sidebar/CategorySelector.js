import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { categoriesUpdated, intensitiesUpdated } from "../../features/FiltersSlice"
import { styled } from "@mui/material/styles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { StyledSlider, StyledTooltip } from "../../../../static/style/muiStyling";
import weather_categories from "../../../../static/data/weather_categories.json"



import { getIcon } from '../../../../components/shared/functions/WeatherIcons';


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

const StyledRangeSlider = styled(StyledSlider)({
    width: "90%",
    "& .MuiSlider-rail": {
        width: "103.7%",
        left: "-1%"
    },
    "& .MuiSlider-mark": {
        height: "6px",
        width: "6px",
        borderRadius: "3px"
    },
    "& .MuiSlider-markLabel": {
        fontSize: "0.75rem",
        width: "min-content",
        whiteSpace: "inherit",
        textAlign: "center",
        minWidth: "60px"
    }
})

const StyledManyRangeSlider = styled(StyledRangeSlider)({
    marginTop: "15px",
    "& .MuiSlider-markLabel": {
        '&[data-index="1"]': {
            bottom: "30px",
            top: "auto"
        },
        '&[data-index="3"]': {
            bottom: "30px",
            top: "auto"
        },
        '&[data-index="5"]': {
            bottom: "30px",
            top: "auto"
        },
        '&[data-index="7"]': {
            bottom: "30px",
            top: "auto"
        },
    },
})

const MemoizedStyledManyRangeSlider = React.memo(StyledManyRangeSlider);
const MemoizedStyledToggleButtonGroup = React.memo(StyledToggleButtonGroup);
const MemoizedStyledStyledToggleButton = React.memo(StyledToggleButton);
const MemoizedStyledStyledTooltip = React.memo(StyledTooltip);

const CategorySelector = () => {
    const dispatch = useDispatch()

    const [categories, intensities] = useSelector(state => {
        return [state.filters.categories, state.filters.intensities];
    }, shallowEqual); // shallowEqual for comparison of lists

    const isSelected = (value) => {
        return categories.includes(value)
    }

    const handleChange = (event, categoryList) => {
        dispatch(categoriesUpdated({ categories: categoryList }))
    }

    const getIntensityValue = (category, max) => {
        const intensityEntry = intensities.length > 0 ?
            intensities.find(e => e.category === category) : undefined
        if (intensityEntry !== undefined) {
            return intensityEntry.value
        } else {
            return [0, max]
        }
    }

    const configureFilter = (list) => {
        return list.map(le => {
            return weather_categories
                .find(e => e.category === le.category).intensity
                .slice(le.value[0], le.value[1] + 1)
                .map(e => e.name)
        }).flat()
    }
    const handleSliderChange = (event, max) => {
        const cat = event.name;
        const val = event.value;

        const currentNames = configureFilter([{ category: cat, value: val }]);

        const entryIndex = intensities.findIndex(e => e.category === cat);

        let needsUpdate = false;
        if (entryIndex === -1) {
            needsUpdate = true; // New category selection
        } else {
            // Check if the value or names have changed
            needsUpdate = intensities[entryIndex].value !== val
        }

        if (needsUpdate) {
            let locIntensities = [...intensities];
            if (entryIndex !== -1) {
                locIntensities.splice(entryIndex, 1); // Remove old entry
            }
            // Push new entry with updated names and value
            locIntensities.push({ category: cat, names: currentNames, value: val });
            dispatch(intensitiesUpdated({ intensities: locIntensities }));
        }
    };

    const getSlider = () => {
        return categories.map(category => {
            const categoryInfos = weather_categories.find(e2 => e2.category === category)

            const maxValue = categoryInfos.intensity.length - 1

            const bottomMargin = ["HAGEL", "REGEN", "SCHNEEDECKE"].includes(categoryInfos.category) ?
                { marginBottom: "20px" } : { marginBottom: "35px" }

            if (maxValue < 5) {
                const marks = categoryInfos.intensity.map(e => {
                    return {
                        value: e.value,
                        label:
                            <MemoizedStyledStyledTooltip title={e.enLong}>
                                <p className={"tooltipbase"}>{e.en}</p>
                            </MemoizedStyledStyledTooltip>
                    }
                })

                return <div className="categorySlider" key={categoryInfos.category}>
                    <p>{categoryInfos.intensity_Name.en} ({categoryInfos.en})</p>
                    <StyledRangeSlider
                        valueLabelDisplay="off"
                        name={categoryInfos.category}
                        step={1}
                        marks={marks}
                        min={0}
                        max={maxValue}
                        sx={bottomMargin}
                        value={getIntensityValue(categoryInfos.category, maxValue)}
                        onChange={e => handleSliderChange(e.target, maxValue)}
                    />
                </div>
            } else {
                const marks = categoryInfos.intensity.map(e => {
                    if (e.value % 2 === 0) {
                        return {
                            value: e.value,
                            label:
                                <MemoizedStyledStyledTooltip title={e.enLong}>
                                    <p className={"tooltipbase"}>{e.en}</p>
                                </MemoizedStyledStyledTooltip>
                        }
                    } else {
                        return {
                            value: e.value,
                            label:
                                <MemoizedStyledStyledTooltip title={e.enLong} placement="top">
                                    <p className={"tooltipbase"}>{e.en}</p>
                                </MemoizedStyledStyledTooltip>
                        }
                    }
                })

                return <div className="categorySlider" key={categoryInfos.category}>
                    <p>{categoryInfos.intensity_Name.en} ({categoryInfos.en})</p>
                    <MemoizedStyledManyRangeSlider
                        valueLabelDisplay="off"
                        name={categoryInfos.category}
                        step={1}
                        marks={marks}
                        min={0}
                        max={maxValue}
                        sx={bottomMargin}
                        value={getIntensityValue(categoryInfos.category, maxValue)}
                        onChange={e => handleSliderChange(e.target, maxValue)}
                    />
                </div>
            }
        })
    }

    return (
        <div>
            <p>Category</p>
            <MemoizedStyledToggleButtonGroup
                color="primary"
                value={categories}
                onChange={handleChange}
            >
                {weather_categories.map(e => {
                    return <MemoizedStyledStyledToggleButton
                        key={e.category}
                        className="typeButton"
                        value={e.category}
                        selected={isSelected(e.category)}>
                        <img src={getIcon(e.category)} alt={e.en} />
                        {e.en}
                    </MemoizedStyledStyledToggleButton>
                })}
            </MemoizedStyledToggleButtonGroup>
            {getSlider()}
        </div>
    )
}

export default CategorySelector;
