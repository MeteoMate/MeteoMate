import React, { useState } from 'react';
import { Checkbox } from "@mui/material";
import { useDispatch } from "react-redux";

import FormControlLabel from '@mui/material/FormControlLabel';
import { getTrajectoriesUpdated } from '../../features/FiltersSlice';

const TobacCheckbox = () => {


  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    dispatch(getTrajectoriesUpdated({ trajectoriesflag: checked }));
  };

  return (
    <FormControlLabel
      control={
        <Checkbox className="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      }
      label="Trajectories"
    />
  );
}
export default TobacCheckbox;
