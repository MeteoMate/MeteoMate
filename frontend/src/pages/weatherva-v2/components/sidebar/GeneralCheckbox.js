import React, { useState } from 'react';
import { Checkbox } from "@mui/material";
import { useDispatch } from "react-redux";

import FormControlLabel from '@mui/material/FormControlLabel';

const GeneralCheckbox = (props) => {

  const { label, action, defaultCheck = false } = props;

  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(defaultCheck);

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    dispatch(action(checked));
  };

  return (
    <FormControlLabel
      control={
        <Checkbox className="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      }
      label={label}
    />
  );
}
export default GeneralCheckbox;
