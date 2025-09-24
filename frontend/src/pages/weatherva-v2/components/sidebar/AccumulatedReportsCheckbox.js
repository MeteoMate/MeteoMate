import React, { useState } from 'react';
import { Checkbox } from "@mui/material";
import { useDispatch } from "react-redux";

import FormControlLabel from '@mui/material/FormControlLabel';
import { getAccumulatedReports } from '../../features/FiltersSlice';

const AccumulatedReportsCheckbox = () => {

  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    dispatch(getAccumulatedReports({ reportsAccumulatedFlag: checked }));
  };

  return (
    <FormControlLabel
      control={
        <Checkbox className="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      }
      label="Show accumulated reports"
    />
  );
}
export default AccumulatedReportsCheckbox;
